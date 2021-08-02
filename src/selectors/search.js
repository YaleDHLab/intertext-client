/**
 * Sort
 **/

export const selectSortByIndex = (state) => {
  return state.search.sortByIndex;
};

export const selectSortBy = (state) => {
  return state.search.sortBy;
};

export const selectSortAttribute = (state) => {
  const f = selectSortBy(state);
  if (f === 'author') return 'source_author';
  if (f === 'year') return 'source_year';
  if (f === 'similarity') return 'similarity';
  console.warn('Invalid sort property string: ' + f);
  return 'similarity';
};
