const initialState = {
  query: '',
  index: 0,
  err: null,
  field: 'Title',
  fileIds: null,
  results: [],
};

const typeaheadReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TYPEAHEAD_FIELD':
      return Object.assign({}, state, {
        field: action.field,
      });

    case 'SET_TYPEAHEAD_QUERY':
      return Object.assign({}, state, {
        query: action.query,
      });

    case 'SET_TYPEAHEAD_INDEX':
      return Object.assign({}, state, {
        index: action.index,
      });

    case 'RECEIVE_TYPEAHEAD_FILE_IDS':
      return Object.assign({}, state, {
        fileIds: action.fileIds,
        results: action.results,
        err: null,
      });

    case 'TYPEAHEAD_REQUEST_FAILED':
      return Object.assign({}, state, {
        err: true,
      });

    default:
      return state;
  }
};

export default typeaheadReducer;
