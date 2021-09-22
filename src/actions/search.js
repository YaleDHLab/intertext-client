import { history } from '../store';
import { fetchJSONFile } from './ajax';
import { addCacheRecord } from '../actions/cache';
import { uniq } from 'lodash';
import {
  setTypeaheadQuery,
  setTypeaheadIndex,
  setTypeaheadField,
  fetchTypeaheadMetadata,
} from './typeahead';

/**
 * Sort
 **/

const fetchSortIndex = () => {
  return (dispatch, getState) => {
    const state = getState();
    const url = `/api/indices/match-ids-by-${state.search.sortField.toLowerCase().trim()}.json`;
    return fetchJSONFile(url)
      .then(sortIndex => {
        dispatch({
          type: 'SET_SORT_ORDER_INDEX',
          sortIndex: sortIndex,
        });
      })
      .catch(e => {
        console.warn('Could not fetch sort order: ' + e);
      });
  };
};

export const setSortAndSearch = field => {
  return dispatch => {
    dispatch({ type: 'SET_SORT_FIELD', sortField: field });
    dispatch(fetchSortIndex()).then(() => {
      dispatch(fetchSearchResults());
    });
  };
};

/**
 * Advanced Filters
 **/

export const setAdvancedFilterField = obj => ({
  type: 'SET_ADVANCED_FILTER',
  ...obj,
});

export const clearAdvancedFilterType = type => {
  return dispatch => {
    dispatch({
      type: 'CLEAR_ADVANCED_FILTER_TYPE',
      earlierLater: type,
    });
  };
};

export const setLength = val => {
  return dispatch => {
    dispatch({
      type: 'SET_ADVANCED_FILTER_LENGTH',
      val: val,
    });
    dispatch({
      type: 'SET_ADVANCED_FILTER_CHANGE_COUNT',
    });
  };
};

export const setDisplayedLength = val => ({
  type: 'SET_ADVANCED_FILTER_DISPLAYED_LENGTH',
  val: val,
});

export const setSimilarity = val => {
  return dispatch => {
    dispatch({
      type: 'SET_ADVANCED_FILTER_SIMILARITY',
      val: val,
    });
    dispatch({
      type: 'SET_ADVANCED_FILTER_CHANGE_COUNT',
    });
  };
};

export const setDisplayedSimilarity = val => ({
  type: 'SET_ADVANCED_FILTER_DISPLAYED_SIMILARITY',
  val: val,
});

export const clearAdvancedFilters = () => {
  return dispatch => {
    dispatch({
      type: 'CLEAR_ADVANCED_FILTERS',
    });
    dispatch(setTypeaheadQuery(''));
    dispatch(fetchSearchResults());
  };
};

/**
 * Search + URL interactions
 **/

export const saveSearchInUrl = () => {
  return (dispatch, getState) => {
    const state = getState();
    let hash = '?';
    hash += 'query=' + JSON.stringify(state.typeahead.query);
    history.push(hash);
  };
};

export const loadSearchFromUrl = () => {
  return (dispatch, getState) => {
    const url = window.location.hash;
    if (url.includes('sankey') || url.includes('works')) return;
    let search = url.split('#/')[1];
    search = search.replace('cards', '');
    if (search.includes('?')) search = search.split('?')[1];
    if (!search) return;
    let obj = {};
    search
      .split('&')
      .filter(arg => arg)
      .forEach(arg => {
        try {
          const split = arg.split('=');
          obj = Object.assign({}, obj, {
            [split[0]]: JSON.parse(decodeURIComponent(split[1])),
          });
        } catch (e) {
          console.warn(`Error parsing ${arg}: ${e}`);
        }
      });
    // prepare the update object
    let update = {};
    if ('earlier' in obj) update['earlier'] = { fileId: obj.earlier };
    if ('later' in obj) update['later'] = { fileId: obj.later };
    dispatch({
      type: 'LOAD_SEARCH_FROM_URL',
      obj: update,
    });
    if (obj.query && obj.query.length) dispatch(setTypeaheadQuery(obj.query));
    if (obj.field && obj.field.length) dispatch(setTypeaheadField(obj.field));
  };
};

/**
 * Search
 **/

export const fetchSearchResults = () => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(setSearchLoading(true));
    const runSearch = () => {
      dispatch(resetMaxDisplayedSearchResults());
      dispatch(setTypeaheadIndex(0));
      dispatch(loadSearchFromUrl());
      dispatch(scrollToCardsTop());
      dispatch(fetchMoreSearchResults());
    };
    // check to see if we need to run the first search result
    if (state.search.sortIndex && state.typeahead.metadata) {
      runSearch();
    } else {
      Promise.all([
        dispatch(fetchSortIndex()), //
        dispatch(fetchTypeaheadMetadata()),
      ]).then(v => {
        runSearch();
      });
    }
  };
};

/**
 * Search Pagination
 **/

// called by client to load more matches into the DOM without running a new search
export const displayMoreResults = () => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.search.maxDisplayed >= state.search.resultsMeta.totalResults) return;
    dispatch({ type: 'DISPLAY_MORE_SEARCH_RESULTS' });
    dispatch(fetchMoreSearchResults());
  };
};

// load the match files for the set of displayed search results
const fetchMoreSearchResults = () => {
  return (dispatch, getState) => {
    const state = getState();
    // get the full list of match metadata vals for the search params
    const filteredSortIndex = getFilteredSortIndex(state);
    // slice off a page
    const orderedIndex = filteredSortIndex.slice(0, state.search.maxDisplayed);
    // get the unique match file ids for which we need to extract matches
    const matchFileIDs = uniq(orderedIndex.map(d => d[1]));
    // get the match file contents
    dispatch(getMatchFiles(matchFileIDs))
      .then(matchFiles => {
        const matches = orderedIndex.reduce((arr, i) => {
          const [matchIndex, matchFileId] = i;
          arr.push(matchFiles[matchFileIDs.indexOf(matchFileId)][matchIndex]);
          return arr;
        }, []);
        return {
          count: filteredSortIndex.length,
          docs: matches,
        };
      })
      .then(({ count, docs }) => {
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS',
          docs: docs,
          total: count,
          err: false,
        });
      })
      .catch(err => {
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS',
          docs: [],
          err: err,
        });
      });
  };
};

const resetMaxDisplayedSearchResults = () => ({
  type: 'RESET_MAX_DISPLAYED_SEARCH_RESULTS',
});

const scrollToCardsTop = () => {
  return () => {
    const elem = document.querySelector('#result-pairs-container');
    if (!elem) return;
    elem.scrollTo(0, 0);
  };
};

/**
 * Main search function that filters the sorted match index to find suitable matches
 */

const getFilteredSortIndex = state => {
  const { sortIndex, advanced, similarity } = { ...state.search };
  const { fileIds, field, query } = { ...state.typeahead };

  // handle case where Results.jsx runs first search instead of '../store.js'
  if (!fileIds) return;

  // given a query and a map from strings to lists of values, return values that match the query
  const getValuesOfMatchingKeys = (q, map) => {
    let s = new Set();
    // filter the keys of the map
    Object.keys(map).map(k => {
      // if there's no query add all values for this key
      if (!q || !q.length) {
        map[k].map(v => s.add(v));
      } else {
        // check if this key (string) matches the query
        if (k.trim().toLowerCase().includes(q.trim().toLowerCase())) {
          // add all the values assigned to this matching key
          map[k].map(v => s.add(v));
        }
      }
      return null;
    });
    return s;
  };

  const getEarlierOrLaterFileIds = (field, map) => {
    return Number.isInteger(advanced[field].fileId)
      ? new Set([advanced[field].fileId])
      : getSetIntersection([
          getValuesOfMatchingKeys(advanced[field].title, map.title),
          getValuesOfMatchingKeys(advanced[field].author, map.author),
        ]);
  };

  // given a list of sets, return a set with the intersection of all sets
  const getSetIntersection = sets => {
    return new Set(sets.reduce((a, b) => [...a].filter(c => b.has(c))));
  };

  /**
   * Get the file ids that are valid for the earlier, later, or either column
   **/

  const filterFileIds = {
    either: getValuesOfMatchingKeys(query, fileIds[field]), // from typeahead
    earlier: getEarlierOrLaterFileIds('earlier', fileIds), // from filters
    later: getEarlierOrLaterFileIds('later', fileIds), // from filters
  };

  // return the filtered sort index
  return sortIndex.filter(item => {
    // destructure a single row from the sorted match index
    const row = parseSortIndexRow(item);
    if (row.similarity < advanced.similarity[0] || row.similarity > advanced.similarity[1])
      return false;
    if (row.length < advanced.length[0] || row.length > advanced.length[1]) return false;
    if (!filterFileIds.earlier.has(row.earlierId)) return false;
    if (!filterFileIds.later.has(row.laterId)) return false;
    if (!filterFileIds.either.has(row.earlierId) && !filterFileIds.either.has(row.laterId))
      return false;
    return true;
  });
};

export const parseSortIndexRow = arr => {
  return {
    id: arr[0],
    earlierId: arr[1],
    laterId: arr[2],
    length: arr[3],
    probability: arr[4],
    similarity: arr[5],
  };
};

/**
 * Match file loading
 **/

const getMatchFiles = matchFileIDs => {
  return (dispatch, getState) => {
    return Promise.all(matchFileIDs.map(matchFileID => dispatch(getMatchFile(matchFileID))));
  };
};

// Helper to fetch match file from memory or network
const getMatchFile = matchFileID => {
  return (dispatch, getState) => {
    const state = getState();
    const cacheKey = `matches/${matchFileID}.json`;
    return cacheKey in state.cache
      ? new Promise((resolve, reject) => resolve(state.cache[cacheKey]))
      : fetchMatchFile(matchFileID.toString()).then(match => {
          dispatch(addCacheRecord(cacheKey, match));
          return match;
        });
  };
};

export const fetchMatchFile = textID => {
  return fetchJSONFile('/api/matches/' + String(textID) + '.json');
};

/**
 * Search loading
 **/

export const setSearchLoading = bool => ({
  type: 'SET_SEARCH_LOADING',
  bool: bool,
});
