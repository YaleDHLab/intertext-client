import * as d3 from 'd3';
import { fetchScatterplotFile } from '../utils/getJSONFile';

export const toggleJitter = () => ({
  type: 'TOGGLE_JITTER'
});

export const removeZoom = () => ({
  type: 'REMOVE_ZOOM'
});

export const setY = (y) => ({
  type: 'SET_Y',
  y: y
});

export const scatterplotRequestFailed = () => ({
  type: 'SCATTERPLOT_REQUEST_FAILED'
});

export const receiveResults = (obj) => ({
  type: 'RECEIVE_SCATTERPLOT_RESULTS',
  obj: obj
});

export const setTooltip = (obj) => ({
  type: 'SET_TOOLTIP',
  obj: obj
});

export const setDomains = (domains) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_DOMAINS', domains: domains });
    dispatch(fetchScatterplotResults());
  };
};

export const resetZoom = () => {
  return (dispatch) => {
    dispatch(fetchScatterplotResults());
  };
};

export const setUnit = (unit) => {
  return (dispatch) => {
    dispatch({ type: 'SET_UNIT', unit: unit });
    dispatch(fetchScatterplotResults());
  };
};

export const setStatistic = (stat) => {
  return (dispatch) => {
    dispatch({ type: 'SET_STATISTIC', statistic: stat });
    dispatch(fetchScatterplotResults());
  };
};

export const setUse = (use) => {
  return (dispatch) => {
    dispatch({ type: 'SET_USE', use: use });
    dispatch(fetchScatterplotResults());
  };
};

export const fetchScatterplotResults = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'FETCH_SCATTERPLOT_RESULTS' });
    fetchScatterplotFile(getScatterplotProps(getState()))
      .then((json) => {
        const state = getState();
        const yDomain = state.scatterplot.yDomains;
        const xDomain = state.scatterplot.xDomain;

        const filteredResults = json.filter((item) => {
          // if there's an xdomain, filter on it
          if (yDomain && yDomain.length === 2) {
            const [minYear, maxYear] = d3.extent(yDomain);
            const itemYear = item.target_year;
            if (itemYear < minYear || itemYear > maxYear) {
              return false;
            }
          }

          // if theres a ydomain filter on it
          if (xDomain.length === 2) {
            const [minX, maxX] = d3.extent(xDomain);
            const itemSimiliarty = item.similarity;
            if (itemSimiliarty < minX || itemSimiliarty > maxX) {
              return false;
            }
          }

          return true;
        });

        console.log('filteredResults', filteredResults);
        dispatch(parseResults(filteredResults));
      })
      .catch((err) => {
        dispatch(scatterplotRequestFailed());
      });
  };
};

const getScatterplotProps = (state) => {
  return {
    use: getUse(state.scatterplot.use),
    unit: getUnit(state.scatterplot.unit),
    stat: state.scatterplot.statistic
  };
};

const getUse = (use) => (use === 'earlier' ? 'target' : 'source');

const getUnit = (unit) => {
  if (unit === 'passage') return 'segment_ids';
  if (unit === 'author') return 'author';
  if (unit === 'book') return 'file_id';
  return 'segment_ids';
};

// set the full and displayed domains
const getDomains = (data, _state) => {
  return {
    x: d3.extent(data, (d) => d.similarity),
    y: d3.extent(data, (d) => d[getUse(_state.use) + '_year'])
  };
};

const parseResults = (data, options) => {
  return (dispatch, getState) => {
    const state = getState();
    const domains = getDomains(data, state.scatterplot);
    for (let i = 0; i < 20; i++) {
      try {
        data[i].label = i + 1;
      } catch (e) {}
    }
    let args = {
      data: data,
      xDomain: domains.x,
      yDomain: domains.y,
      zoomed: false
    };
    dispatch(receiveResults(args));
  };
};

export const getUnitFromUrl = () => {
  return window.location.search.substring(1).split('=')[1];
};
