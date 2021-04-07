export const cacheURL = (url, content) => {
  return {
    type: 'STORE_IN_CACHE',
    key: url,
    value: content
  };
};
