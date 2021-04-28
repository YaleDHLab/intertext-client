import fetch from 'isomorphic-fetch';
import { sortProperties } from '../selectors/sort';
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
  return fetch(url)
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

export const fetchAuthorsFile = () => {
  return fetchJSONFile('/api/authors.json');
};

export const fetchTitlesFile = () => {
  return fetchJSONFile('/api/titles.json');
};

export const fetchFieldFile = (state) => {
  const field = selectTypeaheadField(state);
  return field === typeaheadFieldTypes.Author
    ? fetchAuthorsFile()
    : field === typeaheadFieldTypes.Title
    ? fetchTitlesFile()
    : Promise((resolve, reject) => {
        reject();
      });
};

export const fetchMatchFile = (textID) =>
  fetchJSONFile('/api/matches/' + String(textID) + '.json');

export const fetchScatterplotFile = (props) => {
  const { use, unit, stat } = props;
  return fetchJSONFile(`/api/scatterplots/${use}-${unit}-${stat}.json`);
};

export const fetchSortOrder = (field) => {
  let sortPropertyString;
  switch (field.toLowerCase().trim()) {
    case 'author':
    case sortProperties.Author:
      sortPropertyString = 'author';
      break;
    case 'year':
    case sortProperties.Year:
      sortPropertyString = 'year';
      break;
    case 'similarity':
    case sortProperties.Similarity:
      sortPropertyString = 'similarity';
      break;
    default:
      console.warn(
        `Unsupported sort order: ${field}. Defaulting to similarity`
      );
      // default to author
      sortPropertyString = 'similarity';
      break;
  }
  return fetchJSONFile(`/api/indices/match-ids-by-${sortPropertyString}.json`);
};
