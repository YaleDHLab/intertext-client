/**
* Similarity
**/

export const selectSimilarity = (state) => state.search.similarity;

/**
 * Sort
 **/

export const sortProperties = {
  Author: 'source_author',
  Year: 'source_year',
  Similarity: 'similarity'
};

export const selectSortOrder = (state) => {
  return state.search.orderIndex;
};

export const selectSortProperty = (state) => {
  const sortString = state.search.field;
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

/**
 * Use Types
 **/

export const useTypes = {
  Previous: 'PREVIOUS',
  Later: 'LATER',
  Both: 'BOTH'
};

export const selectUseType = (state) => {
  const previous = state.search.earlier;
  const later = state.search.later;
  if (previous && later) return useTypes.Both;
  if (previous) return useTypes.Previous;
  if (later) return useTypes.Later;
  throw new Error('Invalid useTypes state');
};
