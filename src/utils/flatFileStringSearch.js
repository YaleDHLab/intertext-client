import { selectSimilarity } from '../selectors/similarity';
import { selectSortProperty, sortProperties } from '../selectors/sort';
import {
  selectTypeaheadField,
  selectTypeaheadQuery
} from '../selectors/typeahead';
import { selectUseType, useTypes } from '../selectors/useType';
import { fetchFieldFile, fetchMatchFile } from './getJSONFile';

/**
 * Performs a search based on flat files
 *
 * 1. Load the appropriate field file (authors.json or titles.json)
 * 2. Locate and load matches files that with keys that have substring match
 * 3. Filter based on previous or later use selection
 * 4. Sort by specified property
 *
 * Returns: Promise<Array<Doc Object>>
 */
export function flatFileStringSearch(state) {
  const field = selectTypeaheadField(state);
  const searchTerm = selectTypeaheadQuery(state);

  return fetchFieldFile(state).then((json) => {
    // throw an error if the term isn't a key or empty

    let matchIDs = [];
    Object.keys(json)
      .filter((k) => {
        if (
          searchTerm.trim().length < 1 ||
          k.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
        return false;
      })
      .forEach((k) => {
        matchIDs = matchIDs.concat(json[k]);
      });

    const matches = matchIDs.map((matchID) => fetchMatchFile(matchID));

    return Promise.all(matches).then((matchLists) => {
      // Merge all the docs together
      let docs = [].concat.apply([], matchLists);

      // filter based on similarity slider
      const [minSimilarity, maxSimilarity] = selectSimilarity(state);
      docs = docs.filter(
        (doc) =>
          doc.similarity * 100 >= minSimilarity &&
          doc.similarity * 100 <= maxSimilarity
      );

      // filter based on previous or later use
      const useType = selectUseType(state);
      docs = docs.filter((doc) => {
        if (useType === useTypes.Both) {
          // Don't filter if both types allowed
          return true;
        }

        // Determine what property of doc to string match against
        const suffix = '_' + field.toLowerCase();
        let useTypeField;
        if (useType === useTypes.Previous) {
          useTypeField = 'source' + suffix;
        } else if (useType === useTypes.Later) {
          useTypeField = 'target' + suffix;
        }

        return doc[useTypeField]
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });

      // Sort docs by sort attribute
      const sortAttribute = selectSortProperty(state);

      switch (sortAttribute) {
        case sortProperties.Author:
          docs.sort((a, b) => a[sortAttribute] - b[sortAttribute]);
          break;
        case sortProperties.Year:
          docs.sort((a, b) => {
            return a[sortAttribute] - b[sortAttribute];
          });
          break;
        case sortProperties.Similarity:
          docs.sort((a, b) => b[sortAttribute] - a[sortAttribute]);
          break;
        default:
          break;
      }

      return docs;
    });
  });
}
