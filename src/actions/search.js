import { history } from '../store';
import { setSort } from './sort-results';
import { setUseTypes } from './use-types';
import { setCompare, filterResultsWithCompare } from './compare';
import { setDisplayed, setSimilarity } from './similarity-slider';
import {
  setTypeaheadField,
  setTypeaheadQuery,
  setTypeaheadIndex
} from './typeahead';
import { flatFileStringSearch as flatFileSearch } from '../utils/flatFileStringSearch';

export const displayMoreResults = () => ({
  type: 'DISPLAY_MORE_SEARCH_RESULTS'
});

export const resetMaxDisplayed = () => ({
  type: 'RESET_MAX_DISPLAYED_SEARCH_RESULTS'
});

export const fetchSearchResults = () => {
  return (dispatch, getState) => {
    // Reset the max number of displayed results
    dispatch(resetMaxDisplayed());
    // Save the user's search in the url
    dispatch(saveSearchInUrl());
    // Reset the typeahead index given new results
    dispatch(setTypeaheadIndex(0));
    // Generate the query url
    return flatFileSearch(getState()).then(
      (docs) => {
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS',
          docs: dispatch(filterResultsWithCompare(docs)),
          err: false
        });
      },
      (err) => {
        dispatch({
          type: 'SET_ALL_SEARCH_RESULTS',
          docs: [],
          err: true
        });
      }
    );
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
  if (state.sort && state.sort !== 'Sort By') {
    url += '&sort=' + state.sort;
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
    let hash = 'results?store=true';
    hash += '&query=' + JSON.stringify(state.typeahead.query);
    hash += '&sort=' + JSON.stringify(state.sort);
    hash += '&similarity=' + JSON.stringify(state.similarity.similarity);
    hash += '&displayed=' + JSON.stringify(state.similarity.displayed);
    hash += '&field=' + JSON.stringify(state.typeahead.field);
    hash += '&useTypes=' + JSON.stringify(state.useTypes);
    hash += '&compare=' + JSON.stringify(state.compare);
    try {
      history.push(hash);
    } catch (err) {}
  };
};

export const loadSearchFromUrl = () => {
  return (dispatch, getState) => {
    const search = window.location.hash.split('#/')[1];
    if (!search) return; // str should be window.location.search
    if (search.includes('unit=')) return; // skip scatterlot urls
    let state = getState();
    search
      .substring(1)
      .split('&')
      .map((arg) => {
        const split = arg.split('=');
        state = Object.assign({}, state, {
          [split[0]]: JSON.parse(decodeURIComponent(split[1]))
        });
        return null;
      });
    dispatch(setSort(state.sort));
    dispatch(setDisplayed(state.displayed));
    dispatch(setSimilarity(state.similarity));
    dispatch(setUseTypes(state.useTypes));
    dispatch(setTypeaheadField(state.field));
    dispatch(setTypeaheadQuery(state.query));
    dispatch(setCompare(state.compare));
    dispatch(fetchSearchResults());
  };
};
