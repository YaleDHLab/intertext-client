/**
 * Get results based on filters, search and sort state
 *
 * In order to prevent loading all match files in an
 * unrestricted search case, we precompute which match
 * files fit the search params and load them until we
 * have enough.
 *
 */

import { selectSortByIndex, selectSortAttribute } from '../selectors/search';
import {
  selectSimilarity,
  selectEarlierFileId,
  selectLaterFileId,
} from '../selectors/filters';
import { selectTypeaheadQuery } from '../selectors/typeahead';
import { fetchMatchFile } from './fetchJSONFile';
import { addCacheRecord } from '../actions/cache';
import { uniq } from 'lodash';

/**
 * Get a sorted list of match references
 */

function getSortedMatchList(state) {
  const searchTerm = selectTypeaheadQuery(state).trim().toLowerCase();
  const sortIndex = selectSortByIndex(state);
  const [minSim, maxSim] = selectSimilarity(state);
  const sortBy = selectSortAttribute(state);
  const earlierFileId = selectEarlierFileId(state);
  const laterFileId = selectLaterFileId(state);

  const getMatchingFileIds = (q, map) => {
    // set of file ids that match the provided query
    let s = new Set();
    // if there's no query everything matches
    const keys = Object.keys(map);
    // filter the keys of the map
    keys.map((k) => {
      // if there's no query add all values for this key
      if (!q || !q.length) {
        map[k].map((v) => s.add(v));
      } else {
        // check if this key (string) matches the query
        if (k.trim().toLowerCase().includes(q.toLowerCase())) {
          // add all the values assigned to this matching key
          map[k].map((v) => s.add(v));
        }
      }
      return null;
    });
    return s;
  };

  /**
   * Typeahead file ids
   **/

  let typeaheadFileIds = getMatchingFileIds(
    searchTerm,
    state.typeahead.fileIds[state.typeahead.field]
  );

  // if there are sankey file ids add them to the results
  if (earlierFileId !== null) typeaheadFileIds.add(earlierFileId);
  if (laterFileId !== null) typeaheadFileIds.add(laterFileId);

  /**
   * Advanced filter file ids
   **/

  // get the file ids for earlier and later files
  let earlierFileIds = new Set(
    [
      getMatchingFileIds(
        state.filters.advanced.earlier.Title,
        state.typeahead.fileIds.Title
      ),
      getMatchingFileIds(
        state.filters.advanced.earlier.Author,
        state.typeahead.fileIds.Author
      ),
    ].reduce((a, b) => [...a].filter((c) => b.has(c)))
  );

  let laterFileIds = new Set(
    [
      getMatchingFileIds(
        state.filters.advanced.later.Title,
        state.typeahead.fileIds.Title
      ),
      getMatchingFileIds(
        state.filters.advanced.later.Author,
        state.typeahead.fileIds.Author
      ),
    ].reduce((a, b) => [...a].filter((c) => b.has(c)))
  );

  /**
   * Filter matches
   **/

  // filter the sorted list of matches according to search criteria
  let filteredSortIndex = sortIndex.filter((item) => {
    const [, matchEarlierFileId, matchLaterFileId, similarity] = item;

    // If neither the earlier or later files match the typeahead query, bail
    if (
      !typeaheadFileIds.has(matchEarlierFileId) &&
      !typeaheadFileIds.has(matchLaterFileId)
    )
      return false;

    // If we have earlierFileIds or laterFileIds filter
    if (earlierFileIds.entries() && !earlierFileIds.has(matchEarlierFileId))
      return false;
    if (laterFileIds.entries() && !laterFileIds.has(matchLaterFileId))
      return false;

    // Drop if simlarity is out of range
    if (minSim > similarity || maxSim < similarity) return false;

    // Drop if the source or earlier or later file id isn't right
    if (earlierFileId !== null && earlierFileId !== matchEarlierFileId)
      return false;
    if (laterFileId !== null && laterFileId !== matchLaterFileId) return false;

    return true;
  });

  // use descending order for similarity sort
  if (sortBy === 'similarity') {
    filteredSortIndex = filteredSortIndex.reverse();
  }

  return filteredSortIndex;
}

export function flatFileStringSearch() {
  return (dispatch, getState) => {
    const state = getState();
    // get the full list of match index items that match the filter params
    const filteredOrderedIndex = getSortedMatchList(state);
    // slice off just the subset of the full index that we're displaying
    const orderedIndex = filteredOrderedIndex.slice(
      0,
      state.search.maxDisplayed
    );
    // get the unique match file ids for which we need to extract matches
    const matchFileIDs = uniq(orderedIndex.map((d) => d[1]));
    // get the match file contents
    return dispatch(getMatchFiles(matchFileIDs)).then((matchFiles) => {
      const matches = orderedIndex.reduce((arr, i) => {
        const [matchIndex, matchFileId] = i;
        arr.push(matchFiles[matchFileIDs.indexOf(matchFileId)][matchIndex]);
        return arr;
      }, []);
      return {
        count: filteredOrderedIndex.length,
        docs: matches,
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
