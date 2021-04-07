const initialState = {};

const cacheReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'STORE_IN_CACHE':
      const kvPair = {};
      kvPair[action.key] = action.value;
      console.log('Cache storing', kvPair);

      return Object.assign({}, state, kvPair);
    default:
      return state;
  }
};

export default cacheReducer;
