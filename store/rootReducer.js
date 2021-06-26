import { combineReducers } from 'redux';

// themeReducer
import networkConnectivityReducer from './reducers/networkConnectivity.reducer';
import i18nReducer from './reducers/i18n.reducer';
import appReducer from './reducers/app.reducer';
import authReducer from './reducers/auth.reducer';
// TODO: remove?
import userReducer from './reducers/user.reducer';
import requestReducer from './reducers/request.reducer';

const rootReducer = combineReducers({
  networkConnectivityReducer,
  i18nReducer,
  appReducer,
  authReducer,
  userReducer, // TODO: merge with appReducer
  requestReducer,
});
export default rootReducer;
