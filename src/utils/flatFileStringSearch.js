/**
 * Get results based on filters, search and sort state
 *
 * In order to prevent loading all match files in an
 * unrestricted search case, we precompute which match
 * files fit the search params and load them until we
 * have enough.
 *
 */

import { selectSimilarity } from '../selectors/similarity';
import { selectSortOrder } from '../selectors/sort';
import { selectFieldFile, selectTypeaheadQuery } from '../selectors/typeahead';
import { selectUseType, useTypes } from '../selectors/useType';
import { fetchMatchFile } from './fetchJSONFile';
import { addCacheRecord } from '../actions/cache';
import { uniq, uniqBy } from 'lodash';

/**
 * Get a sorted list of match references
 */

function getSortedMatchList(state) {
  const searchTerm = selectTypeaheadQuery(state).trim().toLowerCase();
  const fieldIndex = selectFieldFile(state);
  const sortIndex = selectSortOrder(state);
  const [minSim, maxSim] = selectSimilarity(state);
  const filterUseType = selectUseType(state);

  // avoid race conditions
  if (!sortIndex) return [];

  // get a list of match files based on the current typeahead query
  const matchFileIDs = uniq(
    Object.keys(fieldIndex)
      // filter to just those keys that match the typeahead query
      .filter((k) =>
        searchTerm.length < 1 ? true : k.toLowerCase().includes(searchTerm)
      )
      // expand from the key (author or title) to the array of match file IDs
      .map((k) => fieldIndex[k])
      // flatten [[match_id_1], [match_id_2]] to 1D array [match_id_1, match_id_2]
      .flat()
  );

  // filter the sorted list of matches to only include matches that are
  // in the file matchFileIDs array, are the appropriate useType, fall
  // within the specified similarity range, and are unique
  const filteredSortIndex = sortIndex.filter((item) => {
    const [matchFileID, , , isPrevious, similarity] = item;

    // Drop if it's not in one of the author's match files
    if (!matchFileIDs.includes(matchFileID)) {
      return false;
    }
    // Skip this match if there's a search and the match isn't the selected source/target type
    if (
      searchTerm.length.length &&
      filterUseType === useTypes.Previous &&
      !isPrevious
    ) {
      return false;
    } else if (
      searchTerm.length.length &&
      filterUseType === useTypes.Later &&
      isPrevious
    ) {
      return false;
    }

    // Drop if simlarity is out of range
    if (minSim > similarity || maxSim < similarity) {
      return false;
    }

    return true;
  });

  return uniqBy(filteredSortIndex, (d) => d[1]);
}

export function flatFileStringSearch() {
  return (dispatch, getState) => {
    const state = getState();
    const filteredOrderedIndex = getSortedMatchList(state);
    const orderedIndex = filteredOrderedIndex.slice(
      0,
      state.search.maxDisplayed
    );
    // find the unique match file ids from which we need to extract matches
    const matchFileIDs = uniq(orderedIndex.map((d) => d[0]));
    // get the match file contents
    return dispatch(getMatchFiles(matchFileIDs)).then((matchFiles) => {
      const matches = orderedIndex.reduce((arr, i) => {
        const [matchFileID, , matchIndex, ,] = i;
        arr.push(matchFiles[matchFileIDs.indexOf(matchFileID)][matchIndex]);
        return arr;
      }, []);
      return {
        count: filteredOrderedIndex.length,
        docs: matches
      };
    });
  };
}

const getMatchFiles = (matchFileIDs) => {
  return (dispatch, getState) => {
    return Promise.all(
      matchFileIDs.map((matchFileID) => dispatch(getMatchFile(matchFileID)))
    );
  };
};

// Helper to fetch match file from memory or network
const getMatchFile = (matchFileID) => {
  return (dispatch, getState) => {
    const state = getState();
    const cacheKey = `matches/${matchFileID}.json`;
    return cacheKey in state.cache
      ? new Promise((resolve, reject) => resolve(state.cache[cacheKey]))
      : fetchMatchFile(matchFileID).then((match) => {
          dispatch(addCacheRecord(cacheKey, match));
          return match;
        });
  };
};
