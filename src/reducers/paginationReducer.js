const initialState = {
  page: 0,
  matchesPerPage: 20
};

const paginationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_PAGINATION':
      return Object.assign({}, state, {
        page: 0
      });
    case 'INCREMENT_PAGE_NUMBER':
      return Object.assign({}, state, {
        page: state.page + 1
      });

    default:
      return state;
  }
};

export default paginationReducer;
