import { fetchTypeaheadFileIds } from '../utils/fetchJSONFile';

export const setTypeaheadField = (field) => ({
  type: 'SET_TYPEAHEAD_FIELD',
  field,
});

export const setTypeaheadQuery = (query) => ({
  type: 'SET_TYPEAHEAD_QUERY',
  query,
});

export const setTypeaheadIndex = (index) => ({
  type: 'SET_TYPEAHEAD_INDEX',
  index,
});

export const typeaheadRequestFailed = () => ({
  type: 'TYPEAHEAD_REQUEST_FAILED',
});

export function fetchTypeaheadResults() {
  return function (dispatch, getState) {
    const state = getState();
    return dispatch(fetchTypeaheadFileIds()).then((fileIds) => {
      dispatch({
        type: 'RECEIVE_TYPEAHEAD_FILE_IDS',
        results: Object.keys(fileIds[state.typeahead.field]).sort(),
        fileIds: fileIds,
      });
    });
  };
}

export const setTypeaheadFieldAndFetch = (field) => {
  return (dispatch) => {
    dispatch(setTypeaheadField(field));
    dispatch(fetchTypeaheadResults());
  };
};
