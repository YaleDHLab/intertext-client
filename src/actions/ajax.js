import fetch from 'isomorphic-fetch';

/**
 * Get a JSON file, throw an exception if response status is not 200
 *
 * Returns: Promise
 * @param {string} url
 */

export const fetchJSONFile = (url) => {
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
