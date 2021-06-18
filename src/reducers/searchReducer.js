const maxDisplayedStep = 10;

const initialState = {
  loading: true,
  results: [],
  allResults: [],
  err: false,
  maxDisplayed: maxDisplayedStep,
  resultsMeta: {
    totalResults: 0,
    startIndex: 0,
    matchesPerPage: 20
  }
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ALL_SEARCH_RESULTS':
      return Object.assign({}, state, {
        results: action.docs,
        allResults: action.docs,
        err: action.err,
        resultsMeta: Object.assign({}, state.resultsMeta, {
          totalResults: action.total,
        }),
        loading: false,
      });

    case 'SET_SEARCH_RESULTS':
      return Object.assign({}, state, {
        results: action.results
      });

    case 'LOAD_SEARCH_FROM_OBJECT':
      return Object.assign({}, state, action.obj);

    case 'DISPLAY_MORE_SEARCH_RESULTS':
      const newMax = state.maxDisplayed + maxDisplayedStep;
      return Object.assign({}, state, {
        maxDisplayed: newMax,
        results: state.allResults.slice(0, newMax)
      });

    case 'RESET_MAX_DISPLAYED_SEARCH_RESULTS':
      return Object.assign({}, state, {
        maxDisplayed: maxDisplayedStep
      });

    case 'SET_SEARCH_LOADING':
      return Object.assign({}, state, {
        loading: action.bool
      });

    default:
      return state;
  }
};

export default searchReducer;
