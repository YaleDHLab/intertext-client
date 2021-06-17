import { history } from '../store';
import { setSort } from './sort-results';
import { setUseTypes } from './use-types';
import { setCompare, filterResultsWithCompare } from './compare';
import { setDisplayedSimilarity, setSimilarity } from './similarity-slider';
import {
  setTypeaheadQuery,
  setTypeaheadIndex,
  setTypeaheadField
} from './typeahead';
import { flatFileStringSearch } from '../utils/flatFileStringSearch';

export const fetchSearchResults = () => {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    dispatch(resetMaxDisplayedSearchResults());
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
        if (!docs || !docs.length) {
          return;
        }
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS_META',
          totalResults: count
        });
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS',
          docs: dispatch(filterResultsWithCompare(docs)),
          err: false
        });
        dispatch(setLoading(false));
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

const setLoading = (bool) => ({
  type: 'SET_SEARCH_LOADING',
  bool: bool
});

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
    let hash = 'results?';
    hash += '&query=' + JSON.stringify(state.typeahead.query);
    hash += '&sort=' + JSON.stringify({ field: state.sort.field });
    hash += '&displayed=' + JSON.stringify(state.similarity.displayed);
    hash += '&field=' + JSON.stringify(state.typeahead.field);
    hash += '&similarity=' + JSON.stringify(state.similarity);
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
    if (!search || !search.includes('?')) return; // str should be window.location.search
    if (search.includes('unit=')) return; // skip scatterplot urls
    let state = getState();
    search
      .split('?')[1]
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
    dispatch(setSort(state.sort.field));
    dispatch(setDisplayedSimilarity(state.similarity.displayed));
    dispatch(setSimilarity(state.similarity.similarity));
    dispatch(setUseTypes(state.useTypes));
    dispatch(setTypeaheadQuery(state.query));
    dispatch(setCompare(state.compare));
    dispatch(setTypeaheadField(state.typeahead.field));
  };
};
