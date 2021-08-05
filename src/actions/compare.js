import { sort } from './favorite';
import { fetchSearchResults } from './search';

export const toggleCompare = obj => {
  return (dispatch, getState) => {
    const { type, result } = { ...obj };
    const state = getState();
    const compare = {
      type: type,
      file_id: result[type + '_file_id'],
      segment_ids: sort(result[type + '_segment_ids']).join('.'),
    };
    if (
      compare.type === state.compare.type &&
      compare.file_id === state.compare.file_id &&
      compare.segment_ids === state.compare.segment_ids
    ) {
      dispatch(setCompare({}));
    } else {
      dispatch(setCompare(compare));
    }
    dispatch(fetchSearchResults());
  };
};

export const setCompare = obj => ({
  type: 'SET_COMPARE',
  compare: obj,
});

export const filterResultsWithCompare = results => {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.compare || !state.compare.type) return results;
    const compareSegmentIds = new Set(state.compare.segment_ids.split('.').map(parseInt));
    return results.filter(r => {
      const resultSegmentIds = new Set(r[state.compare.type + '_segment_ids']);
      // take the intersection of the compare segment ids and result segment ids
      const intersection = new Set([...compareSegmentIds].filter(i => resultSegmentIds.has(i)));
      // does this result have the right file id on the source/target side
      return (
        r[state.compare.type + '_file_id'] === state.compare.file_id &&
        // does this result contain 1+ segment ids contained within the compare result
        intersection.size >= 1
      );
    });
  };
};
