import { history } from '../store';
import { setSort } from './sort-results';
import { setUseTypes } from './use-types';
import { setCompare, filterResultsWithCompare } from './compare';
import { setDisplayed, setSimilarity } from './similarity-slider';
import { setTypeaheadQuery, setTypeaheadIndex } from './typeahead';
import { flatFileStringSearch } from '../utils/flatFileStringSearch';

export const displayMoreResults = () => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.search.maxDisplayed >= state.search.resultsMeta.totalResults) {
      return;
    }
    return dispatch({
      type: 'DISPLAY_MORE_SEARCH_RESULTS'
    });
  };
};

export const resetMaxDisplayed = () => ({
  type: 'RESET_MAX_DISPLAYED_SEARCH_RESULTS'
});

export const fetchMoreSearchResults = () => {
  return (dispatch, getState) => {
    return dispatch(flatFileStringSearch()).then(
      ({ count, docs }) => {
        if (!docs) {
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

export const fetchSearchResults = () => {
  return (dispatch, getState) => {
    // Reset the max number of displayed results
    dispatch(resetMaxDisplayed());
    // Save the user's search in the url
    dispatch(saveSearchInUrl());
    // Reset the typeahead index given new results
    dispatch(setTypeaheadIndex(0));
    dispatch(fetchMoreSearchResults());
  };
};

export const getSearchUrl = (state) => {
  let url = window.location.origin + '/api/matches?',
    query = '',
    field = '';
  if (!state.typeahead && !state.field) return url;

  if (state.typeahead.query) {
    query = encodeURIComponent(state.typeahead.query);
  }
  if (state.typeahead.field) {
    field = state.typeahead.field.toLowerCase();
  }
  if (state.useTypes.previous && field && query) {
    url += '&source_' + field + '=' + query;
  }
  if (state.useTypes.later && field && query) {
    url += '&target_' + field + '=' + query;
  }
  if (state.similarity.similarity) {
    url += '&min_similarity=' + state.similarity.similarity[0];
    url += '&max_similarity=' + state.similarity.similarity[1];
  }
  if (state.sort.field && state.sort.field !== 'Sort By') {
    url += '&sort=' + state.sort.field;
  }
  if (state.compare.type) {
    url += '&' + state.compare.type + '_file_id=' + state.compare.file_id;
    url +=
      '&' + state.compare.type + '_segment_ids=' + state.compare.segment_ids;
  }
  url += '&limit=1000';
  return url;
};

export const saveSearchInUrl = () => {
  return (dispatch, getState) => {
    const state = getState();
    let hash = 'results?';
    hash += '&query=' + JSON.stringify(state.typeahead.query);
    hash += '&sort=' + JSON.stringify(state.sort.field);
    hash += '&displayed=' + JSON.stringify(state.similarity.displayed);
    hash += '&field=' + JSON.stringify(state.typeahead.field);
    hash += '&similarity=' + JSON.stringify(state.similarity);
    hash += '&useTypes=' + JSON.stringify(state.useTypes);
    hash += '&compare=' + JSON.stringify(state.compare);
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

    let sort = state.sort.field;

    search
      .split('?')[1]
      .split('&')
      .filter((arg) => arg)
      .forEach((arg) => {
        try {
          const split = arg.split('=');
          const k = split[0];
          const val = JSON.parse(decodeURIComponent(split[1]));
          if (k === 'sort') {
            sort = val;
          }
          state = Object.assign({}, state, {
            [k]: val
          });
        } catch (e) {
          console.warn(`Error parsing ${arg}: ${e}`);
        }
      });
    // the url is already long enough!
    dispatch(setSort(sort));
    dispatch(setDisplayed(state.similarity.displayed));
    dispatch(setSimilarity(state.similarity.similarity));
    dispatch(setUseTypes(state.useTypes));
    dispatch(setTypeaheadQuery(state.query));
    dispatch(setCompare(state.compare));
  };
};
