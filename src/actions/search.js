import { history } from '../store';
import { setCompare, filterResultsWithCompare } from './compare';
import {
  setTypeaheadQuery,
  setTypeaheadIndex,
  setTypeaheadField
} from './typeahead';
import { flatFileStringSearch } from '../utils/flatFileStringSearch';
import { fetchSortOrder } from '../utils/fetchJSONFile';

export const fetchSearchResults = () => {
  return (dispatch, getState) => {
    dispatch({type: 'RESET_SEARCH'});
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
    const state = getState();
    let hash = '?';
    hash += 'query=' + JSON.stringify(state.typeahead.query);
    hash += '&sort=' + JSON.stringify({ field: state.sort.field });
    hash += '&field=' + JSON.stringify(state.typeahead.field);
    hash += '&displayed=' + JSON.stringify(state.search.displayed);
    hash += '&similarity=' + JSON.stringify(state.search.similarity);
    hash += '&useTypes=' + JSON.stringify(state.useTypes);
    hash += '&compare=' + JSON.stringify(state.compare);
    hash += '&typeahead=' + JSON.stringify({ field: state.typeahead.field });
    try {
      history.push(hash);
    } catch (err) {}
  };
};

export const loadSearchFromUrl = () => {
  return (dispatch, getState) => {
    let search = window.location.hash.split('#/')[1];
    if (search.includes('?')) search = search.split('?')[1];
    let state = getState();
    search
      .split('&')
      .filter((arg) => arg)
      .forEach((arg) => {
        try {
          const split = arg.split('=');
          state = Object.assign({}, state, {
            [split[0]]: JSON.parse(decodeURIComponent(split[1]))
          });
        } catch (e) {
          console.warn(`Error parsing ${arg}: ${e}`);
        }
      });
    dispatch({
      type: 'LOAD_SEARCH_FROM_OBJECT',
      obj: state.search,
    })
    if (Object.values(state.compare).length) dispatch(setCompare(state.compare));
    if (state.query && state.query.length) dispatch(setTypeaheadQuery(state.query || ''));
    dispatch(setTypeaheadField(state.typeahead.field));
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

/**
* Similarity
**/

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

export const setSort = (field, search) => {
  return (dispatch, getState) => {
    fetchSortOrder(field)
      .then((orderIndex) => {
        dispatch({
          type: 'SET_SORT',
          field: field
        });
        dispatch(setSortOrderIndex(orderIndex));
        if (search) dispatch(fetchSearchResults());
      })
      .catch((e) => {
        console.warn('Could not fetch sort order: ' + e);
      });
  };
};

export const setSortAndSearch = (field) => {
  return (dispatch) => {
    dispatch(setSort(field, true));
  };
};