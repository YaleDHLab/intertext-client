import { resetMaxDisplayedSearchResults, fetchSearchResults } from './search';

/**
 * Similarity
 **/

export const setDisplayedSimilarity = (val) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_DISPLAYED',
      val: val,
    });
  };
};

export const setSimilarity = (val) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_SIMILARITY',
      val: val,
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
 * Advanced Filters
 **/

export const setAdvancedFilterField = (obj) => ({
  type: 'SET_ADVANCED_FILTER',
  ...obj,
});

export const clearAdvancedFilterType = (type) => {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_ADVANCED_FILTER_TYPE',
      earlierLater: type,
    });
    dispatch(fetchSearchResults());
  };
};
