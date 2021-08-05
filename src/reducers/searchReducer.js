const maxDisplayedStep = 10;

const initialState = {
  results: [],
  allResults: [],
  maxDisplayed: maxDisplayedStep,

  // sort
  sortField: 'similarity',
  sortIndex: null,

  // similarity range
  similarity: [0, 100],
  displayedSimilarity: [0, 100],

  // advanced filters
  advanced: {
    earlier: {
      title: false,
      author: false,
      fileId: false,
    },
    later: {
      title: false,
      author: false,
      fileId: false,
    },
  },

  // metadata associated with search results
  resultsMeta: {
    err: false,
    loading: true,
    totalResults: 0,
  },
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_SEARCH':
      return Object.assign({}, state, initialState);

    case 'SET_SORT_FIELD':
      return Object.assign({}, state, {
        sortField: action.sortField,
      });

    case 'SET_SORT_ORDER_INDEX':
      return Object.assign({}, state, {
        sortIndex: action.sortIndex,
      });

    case 'SET_SIMILARITY':
      return Object.assign({}, state, {
        similarity: action.val,
      });

    case 'SET_DISPLAYED_SIMILARITY':
      return Object.assign({}, state, {
        displayedSimilarity: action.val,
      });

    case 'SET_ADVANCED_FILTER':
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          [action.earlierLater]: Object.assign(
            {},
            state.advanced[action.earlierLater.toLowerCase()],
            {
              [action.field]: action.field === 'fileId' ? parseInt(action.value) : action.value,
            }
          ),
        }),
      });

    case 'CLEAR_ADVANCED_FILTER_TYPE':
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          [action.earlierLater.toLowerCase()]: {},
        }),
      });

    case 'LOAD_SEARCH_FROM_URL':
      let update = Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          earlier: action.obj.earlier ? action.obj.earlier : state.advanced.earlier,
          later: action.obj.later ? action.obj.later : state.advanced.later,
        }),
      });
      return Object.assign({}, state, update);

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

    default:
      return state;
  }
};

export default searchReducer;
