import { fetchJSONFile } from './ajax';

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

export function fetchTypeaheadMetadata() {
  return function (dispatch, getState) {
    return fetchJSONFile('/api/metadata.json').then((metadata) => {
      // create a map from author/title to file ids that have that string in their metadata
      let fileIds = {
        'author': {},
        'title': {},
      }
      metadata.forEach((m, fileIdx) => {
        fileIds['author'][m.author] = m.author in fileIds['author']
          ? fileIds['author'][m.author].concat(fileIdx)
          : [fileIdx];
        fileIds['title'][m.title] = m.title in fileIds['title']
          ? fileIds['aitle'][m.title].concat(fileIdx)
          : [fileIdx];
      })
      dispatch({
        type: 'RECEIVE_TYPEAHEAD_FILE_IDS',
        fileIds: fileIds,
        metadata: metadata,
      });
    });
  };
}
