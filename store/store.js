// Imports: Dependencies
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';

// Imports: Redux
import rootReducer from './reducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

// Middleware
const middleware = [sagaMiddleware];

// Transform (reset loading property from states to false)
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

// Middleware: Redux Persist Config
const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
  // whitelist (save specific reducers)
  // whitelist: [
  //  'authReducer',
  //],
  // blacklist (don't save specific reducers)
  blacklist: ['requestReducer'],
  stateReconciler: hardSet,
  //transforms: [
  //  transformState,
  //],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux: Store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middleware)));

sagaMiddleware.run(rootSaga);

// Middleware: Redux Persist Persister
const persistor = persistStore(store);

// Exports
export { store, persistor };
