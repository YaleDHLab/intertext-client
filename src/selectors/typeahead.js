export const typeaheadFieldTypes = {
  Author: 'Author',
  Title: 'Title'
};

export const selectTypeaheadField = (state) => {
  const { field } = state.typeahead;
  if (field === 'Author') {
    return typeaheadFieldTypes.Author;
  }
  if (field === 'Title') {
    return typeaheadFieldTypes.Title;
  }

  throw new Error('Invalid typeahead field: ' + field);
};

export const selectFieldFile = (state) =>
  state.typeahead.fieldFiles[state.typeahead.field];

export const selectTypeaheadQuery = (state) => state.typeahead.query;
