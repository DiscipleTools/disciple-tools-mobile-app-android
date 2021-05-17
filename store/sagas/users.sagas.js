import { put, take, all, takeEvery, select } from 'redux-saga/effects';

import * as SecureStore from 'expo-secure-store';

import * as actions from '../actions/users.actions';

export function* getUsers() {
  yield put({ type: actions.GET_USERS_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/users/get_users?get_all=1`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GET_USERS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GET_USERS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GET_USERS_SUCCESS,
        users: jsonData,
      });
    } else {
      yield put({
        type: actions.GET_USERS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GET_USERS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getContactFilters() {
  yield put({ type: actions.GET_CONTACT_FILTERS_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const contactList = yield select((state) => state.contactsReducer.contacts);
  const userData = yield select((state) => state.userReducer.userData);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/users/get_filters?post_type=contacts&force_refresh=1`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GET_CONTACT_FILTERS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GET_CONTACT_FILTERS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (jsonData) {
        yield put({
          type: actions.GET_CONTACT_FILTERS_SUCCESS,
          contactFilters: jsonData,
          isConnected,
          contactList,
          userData,
        });
      }
    } else {
      yield put({
        type: actions.GET_CONTACT_FILTERS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GET_CONTACT_FILTERS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getGroupFilters() {
  yield put({ type: actions.GET_GROUP_FILTERS_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const groupList = yield select((state) => state.groupsReducer.groups);
  const userData = yield select((state) => state.userReducer.userData);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/users/get_filters?post_type=groups&force_refresh=1`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GET_GROUP_FILTERS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GET_GROUP_FILTERS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (jsonData) {
        yield put({
          type: actions.GET_GROUP_FILTERS_SUCCESS,
          groupFilters: jsonData,
          isConnected,
          groupList,
          userData,
        });
      }
    } else {
      yield put({
        type: actions.GET_GROUP_FILTERS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GET_GROUP_FILTERS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* usersSaga() {
  yield all([takeEvery(actions.GET_USERS, getUsers)]);
  yield all([takeEvery(actions.GET_CONTACT_FILTERS, getContactFilters)]);
  yield all([takeEvery(actions.GET_GROUP_FILTERS, getGroupFilters)]);
}
