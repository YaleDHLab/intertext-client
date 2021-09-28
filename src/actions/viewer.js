import { getWordsFile, getMatchFile } from './search'

export const getViewerData = fileId => {
  return (dispatch) => {
    Promise.all([
      dispatch(getWordsFile(fileId)),
      dispatch(getMatchFile(fileId)),
    ]).then(r => {
      const [words, matches] = r;
      dispatch({
        type: 'SET_VIEWER_DATA',
        fileId: fileId,
        matches: matches,
        words: words,
      })
    })
  }
}