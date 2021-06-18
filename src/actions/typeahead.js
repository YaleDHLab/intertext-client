import { selectTypeaheadQuery } from '../selectors/typeahead';
import { fetchTypeaheadFieldFile } from '../utils/fetchJSONFile';

export const setTypeaheadField = (field) => ({
  type: 'SET_TYPEAHEAD_FIELD',
  field
})

export const setTypeaheadQuery = (query) => ({
  type: 'SET_TYPEAHEAD_QUERY',
  query
})

export const setTypeaheadIndex = (index) => ({
  type: 'SET_TYPEAHEAD_INDEX',
  index
});

export const receiveTypeaheadResults = (obj) => ({
  type: 'RECEIVE_TYPEAHEAD_RESULTS',
  results: obj.results,
  fieldFile: obj.file,
});

export const typeaheadRequestFailed = () => ({
  type: 'TYPEAHEAD_REQUEST_FAILED'
});

export function fetchTypeaheadResults() {
  return function (dispatch, getState) {
    // Construct the data URL
    const q = selectTypeaheadQuery(getState()).toLowerCase();
    return dispatch(fetchTypeaheadFieldFile())
      .then(dataMap => dataMap)
      .then(dataMap => {
        dispatch({
          type: 'RECEIVE_TYPEAHEAD_RESULTS',
          file: dataMap,
          filtered: Object.keys(dataMap).filter((v) => v.toLowerCase().includes(q))
        });
      });
  };
}

export const setTypeaheadFieldAndFetch = (field) => {
  return (dispatch) => {
    dispatch(setTypeaheadField(field));
    dispatch(fetchTypeaheadResults());
  }
}