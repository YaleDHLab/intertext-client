const initialState = {
  // file ids
  earlier: null,
  later: null,

  // similarity range
  similarity: [0, 100],
  displayed: [0, 100],

  // advanced filters
  advanced: {
    earlier: {},
    later: {},
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SIMILARITY':
      return Object.assign({}, state, {
        similarity: action.val,
      });

    case 'SET_DISPLAYED':
      return Object.assign({}, state, {
        displayed: action.val,
      });

    case 'SET_ADVANCED_FILTER':
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          [action.earlierLater]: Object.assign({}, state.advanced[action.type], {
            [action.field]: action.value,
          })
        })
      })

    case 'CLEAR_ADVANCED_FILTER_TYPE':
      return Object.assign({}, state, {
        advanced: Object.assign({}, state.advanced, {
          [action.earlierLater]: {},
        })
      })

    default:
      return state
  }
}

export default reducer