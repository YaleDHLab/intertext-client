import { resetMaxDisplayedSearchResults, fetchSearchResults } from './search';

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
