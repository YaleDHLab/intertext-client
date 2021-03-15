import { selectSimilarity } from '../selectors/similarity';
import { selectSortProperty, sortProperties } from '../selectors/sort';
import {
  selectTypeaheadField,
  selectTypeaheadQuery
} from '../selectors/typeahead';
import { selectUseType, useTypes } from '../selectors/useType';
import { fetchFieldFile, fetchMatchFile } from './fetchJSONFile';
import { uniqBy } from 'lodash';

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
  const searchTerm = selectTypeaheadQuery(state);
  return fetchFieldFile(state).then((json) => {
    // throw an error if the term isn't a key or empty
    const matches = Object.keys(json)
      // filter to those keys that match the user query
      .filter(k => searchTerm.trim().length < 1 || k.toLowerCase().includes(searchTerm.toLowerCase()))
      // get the match id values assigned to each key
      .map(k => json[k])
      // flatten [[match_id, match_id], []] to 1D array [match_id, match_id]
      .flat()
      // fetch each match file
      .map(fetchMatchFile)
    return Promise.all(matches).then(matchLists => processMatchLists(state, matchLists))
  });
}

export const processMatchLists = (state, matchLists) => {
  const field = selectTypeaheadField(state);
  const useType = selectUseType(state);
  const searchTerm = selectTypeaheadQuery(state);
  const sortAttribute = selectSortProperty(state);
  const [minSimilarity, maxSimilarity] = selectSimilarity(state);

  // deduplicate matches (each match list contains matches where the author/title is source and target)
  let docs = uniqBy([].concat.apply([], matchLists), d => d._id);

  // filter based on similarity slider
  return docs
    .filter(d => d.similarity * 100 >= minSimilarity && d.similarity * 100 <= maxSimilarity)
    .filter(d => {
      const prefix = useType === useTypes.Previous ? 'source_' : 'target_';
      return useType === useTypes.Both
        ? true
        : d[prefix + field.toLowerCase()]
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());
    })
    .sort((a, b) => {
      return sortAttribute === sortProperties.Author
        ? b[sortAttribute] - a[sortAttribute]
        : a[sortAttribute] - b[sortAttribute]
    })
}