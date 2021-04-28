import { resetMaxDisplayedSearchResults, fetchSearchResults } from './search';

export const setDisplayedSimilarity = (val) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_DISPLAYED',
      val: val,
    })
    dispatch(resetMaxDisplayedSearchResults());
  }
}

export const setSimilarity = (val) => ({
  type: 'SET_SIMILARITY',
  val: val
});

export const setSimilarityAndSearch = (val) => {
  return (dispatch) => {
    dispatch(setSimilarity(val));
    dispatch(fetchSearchResults());
  };
};
