const maxDisplayedStep = 10;

export const defaultAdvanced = {
  title: '',
  author: '',
  fileId: '',
  changed: 0,
}

export const initialState = {
  results: [],
  allResults: [],
  maxDisplayed: maxDisplayedStep,

  // sort
  sortField: 'similarity',
  sortIndex: null,

  // advanced filters
  advanced: {
    similarity: [1, 100],
    displayedSimilarity: [1, 100],
    length: [1, 25],
    displayedLength: [1, 25],
    changed: 0,
    earlier: defaultAdvanced,
    later: defaultAdvanced,
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

    case 'SET_ADVANCED_FILTER':
      const t = action.earlierLater;
      const field = action.field;
      // convert types here
      const val = action.field === 'fileId'
        ? action.value
          ? parseInt(action.value)
          : ''
        : action.value;
      // set the new earlier/later field values
      let col = Object.assign({}, state.advanced[t], {
        [field]: val,
      });
      // identify the number of fields that have changed
      let count = 0;
      Object.keys(defaultAdvanced).forEach(function(key) {
        if (key !== 'changed') {
          if (defaultAdvanced[key] !== col[key]) count++;
        }
      })
      col.changed = count;
      // update the advanced column state
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          [t]: col
        })
      });

    case 'SET_ADVANCED_FILTER_LENGTH': {
      // identify the number of shared filter fields that have changed
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          length: action.val,
        })
      })
    }

    case 'SET_ADVANCED_FILTER_DISPLAYED_LENGTH': {
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          displayedLength: action.val,
        })
      })
    }

    case 'SET_ADVANCED_FILTER_SIMILARITY': {
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          similarity: action.val,
        })
      })
    }

    case 'SET_ADVANCED_FILTER_DISPLAYED_SIMILARITY': {
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          displayedSimilarity: action.val,
        })
      })
    }

    case 'SET_ADVANCED_FILTER_CHANGE_COUNT': {
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          changed: getSharedChangeCount(state),
        })
      })
    }

    case 'CLEAR_ADVANCED_FILTER_TYPE':
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          [action.earlierLater]: defaultAdvanced,
        }),
      });

    case 'CLEAR_ADVANCED_FILTERS':
      return Object.assign({}, state, {
        advanced: Object.assign({}, initialState.advanced)
      })

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
        resultsMeta: Object.assign({}, state.resultsMeta, {
          loading: action.bool,
        }),
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

const getSharedChangeCount = state => {
  let count = 0;
  ['similarity', 'length'].forEach(function(f) {
    if (state.advanced[f].toString() !== initialState.advanced[f].toString()) count++;
  })
  return count;
}

export default searchReducer;
