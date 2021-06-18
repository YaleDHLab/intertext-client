import fetch from 'isomorphic-fetch';
import {
  selectTypeaheadField,
  typeaheadFieldTypes,
  selectTypeaheadFieldFiles,
} from '../selectors/typeahead';

/**
 * Get a JSON file, throw an exception if response status is not 200
 *
 * Returns: Promise
 * @param {string} url
 */

const fetchJSONFile = (url) => {
  const base = window.location.href.split('#')[0].replace('index.html', '');
  url = url[0] === '/' ? url.substring(1) : url;
  return fetch(base + url)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(
          'Fetch failed (Status = ' + response.status + '): ' + url
        );
      }
      return response.json();
    })
    .then((obj) => {
      return obj;
    });
};

export const fetchFieldFile = () => {
  return (dispatch, getState) => {
    const state = getState();
    const field = selectTypeaheadField(state);
    const fieldFiles = selectTypeaheadFieldFiles(state);
    // return cached field file if possible, else fetch the file
    return field in fieldFiles
      ? new Promise((resolve, reject) => {
          return resolve(fieldFiles[field]).then(val => val)
        })
      : field === typeaheadFieldTypes.Author
      ? fetchAuthorsFile()
      : field === typeaheadFieldTypes.Title
      ? fetchTitlesFile()
      : new Promise((resolve, reject) => {
          reject();
        });
  };
};

export const fetchAuthorsFile = () => {
  return fetchJSONFile('/api/authors.json');
};

export const fetchTitlesFile = () => {
  return fetchJSONFile('/api/titles.json');
};

export const fetchMatchFile = (textID) =>
  fetchJSONFile('/api/matches/' + String(textID) + '.json');

export const fetchScatterplotFile = (props) => {
  const { use, unit, stat } = props;
  return fetchJSONFile(`/api/scatterplots/${use}-${unit}-${stat}.json`);
};

export const fetchSortOrder = (field) => {
  return fetchJSONFile(`/api/indices/match-ids-by-${field.toLowerCase().trim()}.json`);
};
