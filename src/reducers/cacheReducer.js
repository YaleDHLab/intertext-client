const initialState = {};

const cacheReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RECORD_TO_CACHE':
      const keyValuePair = {};
      keyValuePair[action.key] = action.value;

      return Object.assign({}, state, keyValuePair);

    default:
      return state;
  }
};

export default cacheReducer;
