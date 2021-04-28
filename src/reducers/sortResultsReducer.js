const initialState = {
  field: 'similarity',
  orderIndex: null /* {arr} */
};

const sortResultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SORT':
      return Object.assign({}, state, {
        field: action.field
      });
    case 'SET_SORT_ORDER_INDEX':
      return Object.assign({}, state, {
        orderIndex: action.orderIndex
      });
    default:
      return state;
  }
};

export default sortResultsReducer;
