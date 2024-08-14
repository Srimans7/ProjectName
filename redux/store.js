import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
const thunk = require('redux-thunk').thunk
import { createPromise } from 'redux-promise-middleware'
import userReducer from './reducers';

const rootReducer = combineReducers({ userReducer });

export const Store = createStore(rootReducer,  applyMiddleware(createPromise(), thunk, createLogger()));