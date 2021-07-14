import { history } from '../store';
import { setCompare, filterResultsWithCompare } from './compare';
import {
  setTypeaheadQuery,
  setTypeaheadIndex,
  setTypeaheadField,
  fetchTypeaheadResults
} from './typeahead';
import { flatFileStringSearch } from '../utils/flatFileStringSearch';
import { fetchSortOrderFile } from '../utils/fetchJSONFile';
import { selectSortBy } from '../selectors/search';

export const fetchSearchResults = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'RESET_SEARCH' });
    dispatch(saveSearchInUrl());
    dispatch(setTypeaheadIndex(0));
    dispatch(fetchMoreSearchResults());
    window.scrollTo(0, 0);
  };
};

export const fetchMoreSearchResults = () => {
  return (dispatch, getState) => {
    return dispatch(flatFileStringSearch()).then(
      ({ count, docs }) => {
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS',
          docs: dispatch(filterResultsWithCompare(docs)),
          total: count,
          err: false
        });
      },
      (err) => {
        console.warn(err);
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS',
          docs: [],
          err: true
        });
      }
    );
  };
};

export const resetMaxDisplayedSearchResults = () => ({
  type: 'RESET_MAX_DISPLAYED_SEARCH_RESULTS'
});

export const displayMoreResults = () => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.search.maxDisplayed >= state.search.resultsMeta.totalResults) {
      return;
    }
    dispatch({ type: 'DISPLAY_MORE_SEARCH_RESULTS' });
    dispatch(fetchMoreSearchResults());
  };
};

export const saveSearchInUrl = () => {
  return (dispatch, getState) => {
    return;
    const state = getState();
    let hash = '?';
    hash += 'query=' + JSON.stringify(state.typeahead.query);
    hash += '&field=' + JSON.stringify(state.typeahead.field);
    hash += '&sort=' + JSON.stringify(state.search.sortBy);
    hash += '&similarity=' + JSON.stringify(state.search.similarity);
    hash += '&earlier=' + JSON.stringify(state.search.earlier);
    hash += '&later=' + JSON.stringify(state.search.later);
    hash += '&displayed=' + JSON.stringify(state.search.displayed);
    hash += '&compare=' + JSON.stringify(state.compare);
    history.push(hash);
  };
};

export const loadSearchFromUrl = () => {
  return (dispatch, getState) => {
    let search = window.location.hash.split('#/')[1];
    if (search.includes('?')) search = search.split('?')[1];
    if (!search) return;
    let obj = {};
    search
      .split('&')
      .filter((arg) => arg)
      .forEach((arg) => {
        try {
          const split = arg.split('=');
          obj = Object.assign({}, obj, {
            [split[0]]: JSON.parse(decodeURIComponent(split[1]))
          });
        } catch (e) {
          console.warn(`Error parsing ${arg}: ${e}`);
        }
      });
    dispatch({
      type: 'LOAD_SEARCH_FROM_URL',
      obj: obj
    });
    if (obj.compare && Object.values(obj.compare).length)
      dispatch(setCompare(obj.compare));
    if (obj.query && obj.query.length) dispatch(setTypeaheadQuery(obj.query));
    if (obj.field && obj.field.length) dispatch(setTypeaheadField(obj.field));
  };
};

export const runInitialSearch = () => {
  return (dispatch) => {
    // we need both the sorted match ids and the typeahead to allow search
    Promise.all([
      dispatch(fetchSortedResults()),
      dispatch(fetchTypeaheadResults())
    ]).then((v) => {
      dispatch(fetchSearchResults());
    });
  };
};

/**
 * Similarity
 **/

export const setDisplayedSimilarity = (val) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_DISPLAYED',
      val: val
    });
  };
};

export const setSimilarity = (val) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_SIMILARITY',
      val: val
    });
    dispatch(resetMaxDisplayedSearchResults());
    window.scrollTo(0, 0);
  };
};

export const setSimilarityAndSearch = (val) => {
  return (dispatch) => {
    dispatch(setSimilarity(val));
    dispatch(fetchSearchResults());
  };
};

/**
 * Use Types
 **/

export const setUseTypes = (obj) => ({
  type: 'SET_USE_TYPES',
  obj: obj
});

export const toggleUseTypes = (use) => {
  return (dispatch) => {
    dispatch({ type: 'TOGGLE_USE_TYPES', use: use });
    dispatch(fetchSearchResults());
  };
};

/**
 * Sort
 **/

const setSortOrderIndex = (orderIndex) => ({
  type: 'SET_SORT_ORDER_INDEX',
  orderIndex: orderIndex
});

const fetchSortedResults = () => {
  return (dispatch, getState) => {
    const state = getState();
    return fetchSortOrderFile(selectSortBy(state))
      .then((orderIndex) => {
        try {
          dispatch(setSortOrderIndex(orderIndex));
        } catch (err) {
          console.log(err);
        }
      })
      .catch((e) => {
        console.warn('Could not fetch sort order: ' + e);
      });
  };
};

export const setSort = (s) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_SORT', sortBy: s });
    return dispatch(fetchSortedResults());
  };
};

export const setSortAndSearch = (field) => {
  return (dispatch) => {
    dispatch(setSort(field)).then(() => {
      dispatch(fetchSearchResults());
    });
  };
};
