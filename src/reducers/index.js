import { combineReducers } from 'redux';
import waffleReducer from './waffleReducer';
import searchReducer from './searchReducer';
import compareReducer from './compareReducer';
import favoriteReducer from './favoriteReducer';
import typeaheadReducer from './typeaheadReducer';
import scatterplotReducer from './scatterplotReducer';
import cacheReducer from './cacheReducer';
import filtersReducer from './filtersReducer';

export const rootReducer = combineReducers({
  search: searchReducer,
  filters: filtersReducer,
  favorites: favoriteReducer,
  typeahead: typeaheadReducer,
  scatterplot: scatterplotReducer,
  waffle: waffleReducer,
  compare: compareReducer,
  cache: cacheReducer,
});
