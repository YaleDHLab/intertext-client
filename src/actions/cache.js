export const addCacheRecord = (key, value) => ({
  type: 'ADD_RECORD_TO_CACHE',
  key: key,
  value: value,
});
