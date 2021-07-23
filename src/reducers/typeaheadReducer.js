const initialState = {
  query: '',
  results: [],
  index: 0,
  err: null,
  field: 'Title',
  fieldFiles: {},
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

    case 'RECEIVE_TYPEAHEAD_RESULTS':
      return Object.assign({}, state, {
        fieldFiles: Object.assign({}, state.fieldFiles, {
          [state.field]: action.file,
        }),
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
