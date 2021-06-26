import * as actions from 'store/actions/auth.actions';
import { REHYDRATE } from 'redux-persist/lib/constants';

const initialState = {
  cnoncePIN: null,
  cnonceLogin: null,
  hasPIN: null,
  isAutoLogin: null,
  rememberLoginDetails: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        cnoncePIN: null,
        cnonceLogin: null,
      };
    case actions.AUTH_TOGGLE_AUTO_LOGIN:
      return {
        ...state,
        isAutoLogin: !state.isAutoLogin,
      };
    case actions.AUTH_TOGGLE_REMEMBER_LOGIN_DETAILS:
      return {
        ...state,
        rememberLoginDetails: !state.rememberLoginDetails,
      };
    case actions.AUTH_SET_HAS_PIN:
      return {
        ...state,
        hasPIN: action.hasPIN,
      };
    case actions.AUTH_SET_CNONCE_PIN:
      return {
        ...state,
        cnoncePIN: action.cnonce,
      };
    case actions.AUTH_SET_CNONCE_LOGIN:
      return {
        ...state,
        cnonceLogin: action.cnonce,
      };
    default:
      return state;
  }
}
