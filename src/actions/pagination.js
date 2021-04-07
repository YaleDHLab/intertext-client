export const nextPage = () => ({
  type: 'INCREMENT_PAGE_NUMBER'
});

// export const nextPage = () => {
//   dispatch(fetchSearchResults());
//   dispatch(_nextPa());
// };

export const resetPagination = () => {
  return {
    type: 'RESET_PAGINATION'
  };
};
