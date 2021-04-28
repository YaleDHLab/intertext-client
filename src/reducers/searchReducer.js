const maxDisplayedStep = 10;

const initialState = {
  results: null, // {arr}
  allResults: null, // {arr}
  err: null, // {str}
  maxDisplayed: maxDisplayedStep, // {int}
  resultsMeta: {
    totalResults: 0, // {int}
    startIndex: 0, // {int}
    matchesPerPage: 20 // {int}
  }
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return Object.assign({}, state, {
        query: action.query
      });

    case 'SET_ALL_SEARCH_RESULTS':
      return Object.assign({}, state, {
        results: action.docs,
        allResults: action.docs,
        err: action.err
      });

    case 'SET_ALL_SEARCH_RESULTS_META':
      return Object.assign({}, state, {
        resultsMeta: {
          totalResults: action.totalResults
        }
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

    default:
      return state;
  }
};

export default searchReducer;
