/**
 * Get results based on filters, search and sort state
 *
 * In order to prevent loading all match files in an
 * unrestricted search case, we introduce a pagination
 * to the redux store and use it here.
 *
 * Get a list of match IDs:
 *  - get sort order
 *  - filter by typeahead and earlier/later usage
 *  - filter by similarity
 *
 * Load matches from match files until we have enough
 */

import uniq from 'lodash.uniq';
import { selectSimilarity } from '../selectors/similarity';
import { selectSortOrder } from '../selectors/sort';
import { selectFieldFile, selectTypeaheadQuery } from '../selectors/typeahead';
import { selectUseType, useTypes } from '../selectors/useType';
import { fetchMatchFile } from './fetchJSONFile';

/**
 * Get a sorted list of match references
 * @param {} state
 */
async function getSortedMatchList(state) {
  const searchTerm = selectTypeaheadQuery(state).trim().toLowerCase();
  const fieldIndex = selectFieldFile(state);
  const sortIndex = selectSortOrder(state);
  const [minSim, maxSim] = selectSimilarity(state);
  const filterUseType = selectUseType(state);

  // get a list of match files based on the current typeahead query
  const matchFileIDs = Object.keys(fieldIndex)
    // filter to just those keys that match the typeahead query
    .filter((k) => {
      if (searchTerm.length < 1) {
        return true;
      }
      const ret = k.toLowerCase().includes(searchTerm);
      return ret;
    })
    // expand from the key (author or title) to the array of match file IDs
    .map((k) => {
      return fieldIndex[k];
    })
    // flatten [[match_id_1, [match_id_2]] to 1D array [match_id_1, match_id_2]
    .flat();

  // filter the sorted list of matches to only include matches that are
  // in the file matchFileIDs array, are the appropriate useType, and
  // fall within the specified similarity range
  return sortIndex.filter((item) => {
    const [matchFileID, , similarity, useType] = item
      .split('.')
      .map((x) => Number(x));

    // Drop if it's not in one of the author's match files
    if (!matchFileIDs.includes(matchFileID)) {
      return false;
    }

    // Drop if there is a search term and one useType selected
    // If both useTypes are selected, no filtering required
    if (
      searchTerm.length > 0 &&
      filterUseType === useTypes.Previous &&
      useType === 1
    ) {
      console.log('useCase mismatch a', item, filterUseType, useType);
      return false;
    } else if (
      searchTerm.length > 0 &&
      filterUseType === useTypes.Later &&
      useType === 0
    ) {
      console.log('useCase mismatch b', item, filterUseType, useType);
      return false;
    }

    // Drop if simlarity is out of range
    if (minSim > similarity || maxSim < similarity) {
      console.log('similarity mismatch', minSim, maxSim, similarity);
      return false;
    }
    return true;
  });
}

export async function flatFileStringSearch(state) {
  const orderedIndex = await getSortedMatchList(state);

  // const matchesPerPage = selectMatchesPerPage(state);
  // const pageNumber = selectPageNumber(state);
  const maxDisplayed = Math.min(
    state.search.maxDisplayed,
    state.search.resultsMeta.totalResults
  );
  // let currentIndex = -1;

  // Helper to fetch match file from memory or network
  let cache = {};
  const getMatchFile = async (matchFileID) => {
    if (!(matchFileID in cache)) {
      cache[matchFileID] = await fetchMatchFile(matchFileID);
    }

    return cache[matchFileID];
  };

  const getMatch = async (matchFileID, matchIndex) => {
    const matchFile = await getMatchFile(matchFileID);
    return matchFile[matchIndex];
  };

  // Determine which match files to load
  let matchCount = 0;
  const matchFilesToLoad = uniq(orderedIndex.map((x) => x.split('.')[0]));
  console.log('Match files to load: ', matchFilesToLoad);
  const matchesPerFile = {};
  matchFilesToLoad.forEach((matchFileID) => {
    matchesPerFile[matchFileID] = orderedIndex.filter(
      (x) => x.split('.')[0] === matchFileID
    ).length;
    matchCount += matchesPerFile[matchFileID];
  });
  console.log('Matches per file', matchesPerFile);
  console.log('Match count from files:', matchCount);

  // Build results in this array
  let results = [];
  // Load each match and determine whether it should be added to results
  // until we have enough results

  for (const matchSummary of orderedIndex) {
    // if we have enough results already, then stop
    if (results.length >= maxDisplayed) {
      break;
    }

    const [matchFileID, matchIndex] = matchSummary.split('.');
    const match = await getMatch(matchFileID, matchIndex);

    // determine if the match is already in the results
    const resultIDs = results.map((match) => match._id);
    if (resultIDs.includes(match._id)) {
      continue;
    }

    // if currentIndex is not high enough, then don't add this item
    // currentIndex += 1;
    // if (currentIndex < pageNumber * matchesPerPage) {
    //   continue;
    // }

    // if we make it this far, append the match
    results.push(match);
  }

  // TODO — We need to deduplicate this in certain cases
  const count = orderedIndex.length;

  return {
    count,
    docs: results
  };
}
