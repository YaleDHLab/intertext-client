/**
 * Similarity
 **/

export const selectSimilarity = (state) => state.filters.similarity;

/**
 * File Ids
 **/

export const selectEarlierFileId = (state) => {
  return state.filters.earlier;
};

export const selectLaterFileId = (state) => {
  return state.filters.later;
};