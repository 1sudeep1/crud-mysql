import {configureStore, Tuple, combineReducers} from '@reduxjs/toolkit'
import logger from 'redux-logger'
import userReducer from './reducerSlices/userSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
  }

  const reducer=combineReducers({
    user:userReducer,
  })

  const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: () => new Tuple( logger),
})

export const persistor = persistStore(store)