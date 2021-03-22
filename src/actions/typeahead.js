import { selectTypeaheadQuery } from '../selectors/typeahead';
import { fetchFieldFile } from '../utils/fetchJSONFile';

export const setTypeaheadField = (field) => ({
  type: 'SET_TYPEAHEAD_FIELD',
  field
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

    return fetchFieldFile(getState())
      .then((dataIndex) => {
        const fullList = Object.keys(dataIndex);
        const json = fullList.filter((v) =>
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
