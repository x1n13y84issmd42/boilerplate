import * as redux from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { TheReducer } from './Reducer';
import promiseMiddleware from 'redux-promise-middleware';

let middleware;
if (process.env.NODE_ENV !== 'production') {
	middleware = redux.applyMiddleware(promiseMiddleware(), logger, thunk);
} else {
	middleware = redux.applyMiddleware(promiseMiddleware(), logger, thunk);
}

export const Store:redux.Store<any> = redux.createStore(
	TheReducer,
	middleware,
);
