import fetch from 'isomorphic-fetch';

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

export const fetchSortOrderFile = (s) => {
  return fetchJSONFile(
    `/api/indices/match-ids-by-${s.toLowerCase().trim()}.json`
  );
};

export const fetchMatchFile = (textID) => {
  return fetchJSONFile('/api/matches/' + String(textID) + '.json');
};

export const fetchScatterplotFile = (props) => {
  const { use, unit, stat } = props;
  return fetchJSONFile(`/api/scatterplots/${use}-${unit}-${stat}.json`);
};

export const fetchTypeaheadFileIds = () => {
  return (dispatch, getState) => {
    const state = getState();
    // return cached field file if possible, else fetch the file
    return state.typeahead.fileIds
      ? new Promise((resolve, reject) => {
          return resolve(state.typeahead.fileIds).then((val) => val);
        })
      : fetchJSONFile('/api/file_ids.json');
  };
};
