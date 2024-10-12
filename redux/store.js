import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
const thunk = require('redux-thunk').thunk
import { createPromise } from 'redux-promise-middleware'
import userReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const rootReducer = combineReducers({ userReducer });

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };
  
  // Create a persisted reducer
  const persistedReducer = persistReducer(persistConfig, rootReducer);

 const Store = createStore(persistedReducer,  applyMiddleware(createPromise(), thunk, createLogger()));

 const persistor = persistStore(Store);

export { Store, persistor };