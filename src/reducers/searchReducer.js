const maxDisplayedStep = 10;

const initialState = {
  results: [],
  allResults: [],
  maxDisplayed: maxDisplayedStep,

  // sort
  sortBy: 'similarity',
  sortByIndex: null,

  resultsMeta: {
    err: false,
    loading: true,
    totalResults: 0,
  },
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_SEARCH':
      return Object.assign({}, state, {
        maxDisplayed: maxDisplayedStep,
        resultsMeta: {
          err: false,
          loading: true,
        },
      });

    case 'SET_ALL_SEARCH_RESULTS':
      return Object.assign({}, state, {
        results: action.docs,
        allResults: action.docs,
        resultsMeta: Object.assign({}, state.resultsMeta, {
          totalResults: action.total,
          err: action.err,
          loading: false,
        }),
      });

    case 'SET_SEARCH_RESULTS':
      return Object.assign({}, state, {
        results: action.results,
      });

    case 'LOAD_SEARCH_FROM_URL':
      return Object.assign({}, state, action.obj);

    case 'DISPLAY_MORE_SEARCH_RESULTS':
      const newMax = state.maxDisplayed + maxDisplayedStep;
      return Object.assign({}, state, {
        maxDisplayed: newMax,
        results: state.allResults.slice(0, newMax),
      });

    case 'RESET_MAX_DISPLAYED_SEARCH_RESULTS':
      return Object.assign({}, state, {
        maxDisplayed: maxDisplayedStep,
      });

    case 'SET_SEARCH_LOADING':
      return Object.assign({}, state, {
        loading: action.bool,
      });

    case 'SET_SORT':
      return Object.assign({}, state, {
        sortBy: action.sortBy,
      });

    case 'SET_SORT_ORDER_INDEX':
      return Object.assign({}, state, {
        sortByIndex: action.orderIndex,
      });

    default:
      return state;
  }
};

export default searchReducer;
