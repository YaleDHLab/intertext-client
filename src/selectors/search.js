/**
* Similarity
**/

export const selectSimilarity = (state) => state.search.similarity;

/**
 * Sort
 **/

export const selectSortByIndex = (state) => {
  return state.search.sortByIndex;
};

export const selectSortBy = state => {
  return state.search.sortBy;
}

export const selectSortAttribute = (state) => {
  const f = selectSortBy(state);
  if (f === 'author') return 'source_author';
  if (f === 'year') return 'source_year';
  if (f === 'similarity') return 'similarity';
  console.warn('Invalid sort property string: ' + f);
  return 'similarity';
};

/**
 * Use Types
 **/

export const useTypes = {
  Earlier: 'EARLIER',
  Later: 'LATER',
  Both: 'BOTH'
};

export const selectUseType = (state) => {
  const earlier = state.search.earlier;
  const later = state.search.later;
  if (earlier && later) return useTypes.Both;
  if (earlier) return useTypes.Earlier;
  if (later) return useTypes.Later;
  throw new Error('Invalid useTypes state');
};
