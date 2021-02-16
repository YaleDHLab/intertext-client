import fetch from 'isomorphic-fetch';
import {
  selectTypeaheadField,
  typeaheadFieldTypes
} from '../selectors/typeahead';

/**
 * Get a JSON file, throw an exception if response status is not 200
 *
 * Returns: Promise
 * @param {string} url
 */
const fetchJSONFile = (url) => {
  return fetch(url).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        'Fetch failed (Status = ' + response.status + '): ' + url
      );
    }
    return response.json();
  });
};

export const fetchAuthorsFile = () => {
  return fetchJSONFile('/api/authors.json');
};

export const fetchTitlesFile = () => {
  return fetchJSONFile('/api/titles.json');
};

export const fetchFieldFile = (state) => {
  const field = selectTypeaheadField(state);

  if (field === typeaheadFieldTypes.Author) {
    return fetchAuthorsFile();
  } else if (field === typeaheadFieldTypes.Title) {
    return fetchTitlesFile();
  }
  return Promise((resolve, reject) => {
    reject();
  });
};

export const fetchMatchFile = (textID) => {
  return fetchJSONFile('/api/matches/' + String(textID) + '.json');
};
