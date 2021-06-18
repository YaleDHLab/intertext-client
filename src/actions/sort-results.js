import { fetchSortOrder } from '../utils/fetchJSONFile';
import { fetchSearchResults } from './search';

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
