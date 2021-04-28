import { history } from '../store';
import { fetchSearchResults } from './search';

export const setWaffleVisualized = (obj) => ({
  type: 'SET_WAFFLE_VISUALIZED',
  obj: obj
});

export const setWaffleData = (obj) => ({
  type: 'SET_WAFFLE_DATA',
  obj: obj
});

export const setActiveWaffle = (obj) => ({
  type: 'SET_WAFFLE_ACTIVE',
  obj: obj
});

export const waffleImageRequestFailed = () => ({
  type: 'WAFFLE_IMAGE_REQUEST_FAILED'
});

export const receiveWaffleImage = (url) => ({
  type: 'RECEIVE_WAFFLE_IMAGE',
  url: url
});

export const hideWaffle = () => {
  return (dispatch) => {
    dispatch(fetchSearchResults());
  };
};

export const setWaffleFeature = (feature) => {
  return (dispatch) => {
    dispatch({ type: 'SET_WAFFLE_FEATURE', feature: feature });
    dispatch(plotWaffle());
  };
};

export const getWaffleActive = (d, i) => {
  return (dispatch) => {
    dispatch(requestWaffleActiveData(d, i));
  };
};

export const visualize = (obj) => {
  return (dispatch, getState) => {
    dispatch(setWaffleVisualized(obj));
    dispatch(plotWaffle());
    dispatch(saveWaffleInUrl());
  };
};

export const saveWaffleInUrl = () => {
  // TODO: Store waffle state in url params
  return (dispatch) => {
    history.push('waffle');
  };
};

export const requestWaffleActiveData = (d) => {
  return (dispatch, getState) => {
    const result = getState().search.allResults.filter(
      (r) => r._id === d._id
    )[0];
    dispatch(setActiveWaffle(Object.assign({}, result)));
  };
};

export const plotWaffle = () => {
  return (dispatch, getState) => {
    const state = getState();
    const size = 10; // h, w of each waffle cell
    const levelMargin = 10; // margin between levels
    const margin = { top: 0, right: 80, bottom: 90, left: 0 };
    const data = getCellData(state);
    const cols = data.cols;
    // find the level with the max column count
    const maxCol = keys(cols).reduce((a, b) => (cols[a] > cols[b] ? a : b));
    // find all unique levels for an ordinal x domain
    const xDomain = keys(cols);
    // find the chart width
    let width = xDomain.length * (cols[maxCol] * size + levelMargin);
    width += margin.right + margin.left;
    dispatch(
      setWaffleData({
        data: data.cells,
        xDomain: xDomain,
        feature: state.waffle.feature,
        width: width,
        columnCounts: cols,
        maxColumn: cols[maxCol],
        levelMargin: levelMargin
      })
    );
  };
};

const getCellData = (state) => {
  const rows = 10; // waffles per col
  const key = getKey(state.waffle.feature, state.waffle.type);
  let counts = {},
    cols = {},
    data = [];
  // filter to just the results that match the requested plot
  state.search.allResults
    .filter((i) => {
      return i[state.waffle.type + '_file_id'] === state.waffle.file_id;
    })
    .map((d, i) => {
      // level of passage in `feature` factor
      let level = getLevel(d, key, state.waffle.feature);
      // set the 0-based count of the times each level occurs
      counts[level] = counts[level] > -1 ? counts[level] + 1 : 0;
      // set the 0-based column index where this cell belongs
      let col = Math.floor(counts[level] / rows);
      // set the 0-based row index where this cell belongs
      let row = counts[level] % rows;
      // set the 1-based count of columns for this level
      cols[level] = cols[level] ? Math.max(cols[level], col + 1) : 1;
      // add this observation to the outgoing data
      data.push({
        row: row,
        column: col,
        xLevel: level.toString(),
        similarity: d.similarity,
        _id: d._id
      });
      return null;
    });
  return { cells: data, cols: cols };
};

const keys = (obj) => Object.keys(obj);

const getKey = (feature, type) => {
  const otherType = type === 'source' ? 'target' : 'source';
  return feature === 'segment_ids'
    ? type + '_segment_ids'
    : otherType + '_' + feature;
};

const getLevel = (d, key, feature) => {
  if (!d[key]) {
    console.warn('level data is unreachable');
    return;
  }
  return feature === 'segment_ids' ? d[key][0] : d[key];
};
