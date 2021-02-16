import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers/index';
import { loadFavorites } from './actions/favorite';
import freeze from 'redux-freeze';

const history = createBrowserHistory();
const loggerMiddleware = createLogger();

let middlewares = [thunkMiddleware, routerMiddleware(history)];

// add the freeze dev middleware
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(freeze);
  middlewares.push(loggerMiddleware);
}

// apply the middleware
let middleware = applyMiddleware(...middlewares);

// create the store
const store = createStore(connectRouter(history)(rootReducer), middleware);

store.dispatch(loadFavorites());

export { store, history };
