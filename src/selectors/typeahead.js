export const typeaheadFieldTypes = {
  Author: 'Author',
  Title: 'Title'
};

export const selectTypeaheadField = (state) => {
  const { field } = state.typeahead;
  if (typeaheadFieldTypes[field]) return typeaheadFieldTypes[field];
  throw new Error('Invalid typeahead field: ' + field);
};

export const selectTypeaheadFieldFiles = state => state.typeahead.fieldFiles;

export const selectFieldFile = (state) =>
  selectTypeaheadFieldFiles(state)[state.typeahead.field];

export const selectTypeaheadQuery = (state) => state.typeahead.query;


