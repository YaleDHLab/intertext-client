export const sortProperties = {
  Author: 'source_author',
  Year: 'source_year',
  Similarity: 'similarity'
};

export const selectSortOrder = (state) => {
  return state.sort.orderIndex;
};

export const selectSortProperty = (state) => {
  const sortString = state.sort.field;
  switch (sortString) {
    case 'author':
      return sortProperties.Author;
    case 'year':
      return sortProperties.Year;
    case 'similarity':
      return sortProperties.Similarity;
    default:
      console.warn('Invalid sort property string: ' + sortString);
      return sortProperties.Similarity;
  }
};
