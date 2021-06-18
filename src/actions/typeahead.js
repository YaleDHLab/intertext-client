import { selectTypeaheadQuery } from '../selectors/typeahead';
import { fetchFieldFile } from '../utils/fetchJSONFile';

export const setTypeaheadField = (field) => ({
  type: 'SET_TYPEAHEAD_FIELD',
  field
});

export const receiveFieldFile = (file) => ({
  type: 'RECEIVE_FIELD_FILE',
  fieldFile: file
});

export const setTypeaheadQuery = (query) => ({
  type: 'SET_TYPEAHEAD_QUERY',
  query
});

export const setTypeaheadIndex = (index) => ({
  type: 'SET_TYPEAHEAD_INDEX',
  index
});

export const receiveTypeaheadResults = (results) => ({
  type: 'RECEIVE_TYPEAHEAD_RESULTS',
  results
});

export const typeaheadRequestFailed = () => ({
  type: 'TYPEAHEAD_REQUEST_FAILED'
});

export function fetchTypeaheadResults() {
  return function (dispatch, getState) {
    // Construct the data URL
    const term = selectTypeaheadQuery(getState());
    return dispatch(fetchFieldFile())
      .then((dataMap) => {
        dispatch(receiveFieldFile(dataMap));
        const json = Object.keys(dataMap).filter((v) =>
          String(v).toLowerCase().includes(term.toLowerCase())
        );
        return { json };
      })
      .then(
        ({ json }) => {
          dispatch(receiveTypeaheadResults(json));
        },
        (err) => {
          dispatch(typeaheadRequestFailed());
        }
      );
  };
}
