import { combineReducers } from 'redux';
import waffleReducer from './waffleReducer';
import searchReducer from './searchReducer';
import compareReducer from './compareReducer';
import naviconReducer from './naviconReducer';
import favoriteReducer from './favoriteReducer';
import typeaheadReducer from './typeaheadReducer';
import scatterplotReducer from './scatterplotReducer';
import cacheReducer from './cacheReducer';

export const rootReducer = combineReducers({
  waffle: waffleReducer,
  search: searchReducer,
  compare: compareReducer,
  navicon: naviconReducer,
  favorites: favoriteReducer,
  typeahead: typeaheadReducer,
  scatterplot: scatterplotReducer,
  cache: cacheReducer,
});
