const maxDisplayedStep = 10;

const initialState = {
  loading: true,
  results: [],
  allResults: [],
  err: false,
  maxDisplayed: maxDisplayedStep,

  // similarity range
  similarity: [50, 100],
  displayed: [50, 100],

  // use types
  earlier: true,
  later: true,

  // sort
  sortBy: 'similarity',
  sortByIndex: null,

  resultsMeta: {
    totalResults: 0
  }
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_SEARCH':
      return Object.assign({}, state, {
        loading: true,
        maxDisplayed: maxDisplayedStep
      });

    case 'SET_ALL_SEARCH_RESULTS':
      return Object.assign({}, state, {
        results: action.docs,
        allResults: action.docs,
        err: action.err,
        resultsMeta: Object.assign({}, state.resultsMeta, {
          totalResults: action.total
        }),
        loading: false
      });

    case 'SET_SEARCH_RESULTS':
      return Object.assign({}, state, {
        results: action.results
      });

    case 'LOAD_SEARCH_FROM_URL':
      return Object.assign({}, state, {
        sortBy: action.obj.sort,
        similarity: action.obj.similarity,
        displayed: action.obj.similarity,
        earlier: action.obj.earlier,
        later: action.obj.later
      });

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

    case 'SET_SIMILARITY':
      return Object.assign({}, state, {
        similarity: action.val
      });

    case 'SET_DISPLAYED':
      return Object.assign({}, state, {
        displayed: action.val
      });

    case 'SET_USE_TYPES':
      return Object.assign({}, state, action.obj);

    case 'TOGGLE_USE_TYPES':
      const otherUse = action.use === 'earlier' ? 'later' : 'earlier';
      // ensure at least one use is active
      return state[action.use] && !state[otherUse]
        ? Object.assign({}, state, {
            [otherUse]: true,
            [action.use]: false
          })
        : Object.assign({}, state, {
            [action.use]: !state[action.use]
          });

    case 'SET_SORT':
      return Object.assign({}, state, {
        sortBy: action.sortBy
      });

    case 'SET_SORT_ORDER_INDEX':
      return Object.assign({}, state, {
        sortByIndex: action.orderIndex
      });

    default:
      return state;
  }
};

export default searchReducer;
