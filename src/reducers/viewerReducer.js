const initialState = {
  fileId: null,
  matches: null,
  words: null,
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case 'SET_VIEWER_DATA':
      return Object.assign({}, state, {
        fileId: action.fileId,
        matches: action.matches,
        words: action.words,
      })

    default:
      return state;
  }
}

export default reducer;