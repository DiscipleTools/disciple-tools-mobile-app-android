/*
 * Action Types
 */
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_START = 'USER_LOGIN_START';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_RESPONSE = 'USER_LOGIN_RESPONSE';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';
export const USER_LOGOUT_FAILURE = 'USER_LOGOUT_FAILURE';

export const USER_GET_PUSH_TOKEN = 'USER_GET_PUSH_TOKEN';

export const USER_ADD_PUSH_TOKEN = 'USER_ADD_PUSH_TOKEN';
export const USER_ADD_PUSH_TOKEN_RESPONSE = 'USER_ADD_PUSH_TOKEN_RESPONSE';
export const USER_ADD_PUSH_TOKEN_SUCCESS = 'USER_ADD_PUSH_TOKEN_SUCCESS';
export const USER_ADD_PUSH_TOKEN_FAILURE = 'USER_ADD_PUSH_TOKEN_FAILURE';

export const GET_MY_USER_INFO = 'GET_MY_USER_INFO';
export const GET_MY_USER_INFO_START = 'GET_MY_USER_INFO_START';
export const GET_MY_USER_INFO_RESPONSE = 'GET_MY_USER_INFO_RESPONSE';
export const GET_MY_USER_INFO_SUCCESS = 'GET_MY_USER_INFO_SUCCESS';
export const GET_MY_USER_INFO_FAILURE = 'GET_MY_USER_INFO_FAILURE';

export const TOGGLE_AUTO_LOGIN = 'TOGGLE_AUTO_LOGIN';

export const TOGGLE_REMEMBER_LOGIN_DETAILS = 'TOGGLE_REMEMBER_LOGIN_DETAILS';
export const TOGGLE_REMEMBER_LOGIN_DETAILS_SUCCESS = 'TOGGLE_REMEMBER_LOGIN_DETAILS_SUCCESS';
export const TOGGLE_REMEMBER_LOGIN_DETAILS_FAILURE = 'TOGGLE_REMEMBER_LOGIN_DETAILS_FAILURE';

export const SET_PIN = 'SET_PIN';
export const SET_PIN_SUCCESS = 'SET_PIN_SUCCESS';
export const SET_PIN_FAILURE = 'SET_PIN_FAILURE';

export const DELETE_PIN = 'DELETE_PIN';
export const DELETE_PIN_SUCCESS = 'DELETE_PIN_SUCCESS';
export const DELETE_PIN_FAILURE = 'DELETE_PIN_FAILURE';

export const SET_CNONCE_LOGIN = 'SET_CNONCE_LOGIN';

export const GENERATE_PIN_CNONCE = 'GENERATE_PIN_CNONCE';
export const GENERATE_PIN_CNONCE_SUCCESS = 'GENERATE_PIN_CNONCE_SUCCESS';
export const GENERATE_PIN_CNONCE_FAILURE = 'GENERATE_PIN_CNONCE_FAILURE';

export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const UPDATE_USER_INFO_RESPONSE = 'UPDATE_USER_INFO_RESPONSE';
export const UPDATE_USER_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS';
export const UPDATE_USER_INFO_FAILURE = 'UPDATE_USER_INFO_FAILURE';

/*
 * Action Creators
 */
export function login(domain, username, password) {
  return {
    type: USER_LOGIN,
    domain,
    username,
    password,
  };
}

export function getPushToken() {
  return { type: USER_GET_PUSH_TOKEN };
}

export function getUserInfo() {
  return { type: GET_MY_USER_INFO };
}

export function logout() {
  return { type: USER_LOGOUT };
}

export function toggleAutoLogin() {
  return { type: TOGGLE_AUTO_LOGIN };
}

export function toggleRememberLoginDetails(rememberLoginDetails) {
  return { type: TOGGLE_REMEMBER_LOGIN_DETAILS, rememberLoginDetails };
}

export function setPIN(code) {
  return { type: SET_PIN, code };
}

export function deletePIN() {
  return { type: DELETE_PIN };
}

export function generatePINCNonce() {
  return { type: GENERATE_PIN_CNONCE };
}

export function setCNonceLogin(cnonceLogin) {
  return {
    type: SET_CNONCE_LOGIN,
    cnonceLogin,
  };
}

export function updateUserInfo(userInfo) {
  return { type: UPDATE_USER_INFO, userInfo };
}
