import { fetchSortOrder } from '../utils/fetchJSONFile';
import { fetchSearchResults } from './search';

const _setSort = (field) => ({
  type: 'SET_SORT',
  field: field
});

const setSortOrderIndex = (orderIndex) => ({
  type: 'SET_SORT_ORDER_INDEX',
  orderIndex: orderIndex
});

export const setSort = (field) => {
  return (dispatch, getState) => {
    fetchSortOrder(field)
      .then((orderIndex) => {
        dispatch(_setSort(field));
        dispatch(setSortOrderIndex(orderIndex));
        dispatch(fetchSearchResults());
      })
      .catch((e) => {
        console.warn('Could not fetch sort order: ' + e);
      });
  };
};

export const setSortAndSearch = (field) => {
  return (dispatch) => {
    dispatch(setSort(field));
    dispatch(fetchSearchResults());
  };
};
