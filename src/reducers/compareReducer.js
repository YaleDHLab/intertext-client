const initialState = {};

const compareReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COMPARE':
      return Object.assign({}, action.compare);
    default:
      return state;
  }
};

export default compareReducer;
