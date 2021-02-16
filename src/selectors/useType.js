export const useTypes = {
  Previous: 'PREVIOUS',
  Later: 'LATER',
  Both: 'BOTH'
};

export const selectUseType = (state) => {
  const { previous, later } = state.useTypes;
  if (previous && later) {
    return useTypes.Both;
  }
  if (previous) {
    return useTypes.Previous;
  }
  if (later) {
    return useTypes.Later;
  }
  throw new Error('Invalid useTypes state');
};
