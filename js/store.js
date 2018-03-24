import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducers';


const persistedReducer = persistReducer({ key: 'root', storage }, reducer);
const middlewares = [thunk];

const configureStore = async () => {
  const store = createStore(persistedReducer, {}, applyMiddleware(...middlewares));
  const persistor = persistStore(store);
  await persistor.purge();
  return { store, persistor }
};

export default configureStore;
