import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';

import rootReducer from './rootReducer';

const middleware = [];

/*const transformState = createTransform(
  state => ({ ...state }),
  (state) => {
    if (state.loading) {
      return {
        ...state,
        loading: false,
      };
    }
    return {
      ...state,
    };
  },
);*/

// Redux-Persist config
const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
  // whitelist: [],
  //blacklist: [
  //  "requestReducer"
  //],
  stateReconciler: hardSet,
  //transforms: [
  //  transformState,
  //],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middleware)));

const persistor = persistStore(store);

export { store, persistor };
