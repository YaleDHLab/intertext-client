const initialState = {
  similarity: [60, 100],
  displayed: [60, 100]
};

const similarityReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SIMILARITY':
      return Object.assign({}, state, {
        similarity: action.val
      });

    case 'SET_DISPLAYED':
      return Object.assign({}, state, {
        displayed: action.val
      });

    default:
      return state;
  }
};

export default similarityReducer;
