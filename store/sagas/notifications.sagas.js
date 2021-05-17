import { put, take, takeLatest, all, select } from 'redux-saga/effects';

import * as SecureStore from 'expo-secure-store';

import * as actions from '../actions/notifications.actions';

export function* getNotificationsByUser({ allNotifications, offset, limit }) {
  yield put({ type: actions.NOTIFICATIONS_BY_USER_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/notifications/get_notifications`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          all: allNotifications,
          page: offset,
          limit,
        }),
      },
      action: actions.NOTIFICATIONS_BY_USER_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.NOTIFICATIONS_BY_USER_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.NOTIFICATIONS_BY_USER_SUCCESS,
          notifications: jsonData,
        });
      } else if (response.status === 204) {
        yield put({
          type: actions.NOTIFICATIONS_BY_USER_SUCCESS,
          notifications: [],
        });
      } else {
        yield put({
          type: actions.NOTIFICATIONS_BY_USER_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.NOTIFICATIONS_BY_USER_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getNotificationsCount() {
  yield put({ type: actions.NOTIFICATIONS_COUNT_BY_USER_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/notifications/get_new_notifications_count`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
      action: actions.NOTIFICATIONS_COUNT_BY_USER_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.NOTIFICATIONS_COUNT_BY_USER_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.NOTIFICATIONS_COUNT_BY_USER_SUCCESS,
          notificationsCount: jsonData,
        });
      } else {
        yield put({
          type: actions.NOTIFICATIONS_COUNT_BY_USER_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.NOTIFICATIONS_COUNT_BY_USER_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* markViewed({ notificationId }) {
  yield put({ type: actions.NOTIFICATIONS_MARK_AS_VIEWED_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/notifications/mark_viewed/${notificationId}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
      action: actions.NOTIFICATIONS_MARK_AS_VIEWED_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.NOTIFICATIONS_MARK_AS_VIEWED_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.NOTIFICATIONS_MARK_AS_VIEWED_SUCCESS,
          notificationsCount: jsonData,
        });
      } else {
        yield put({
          type: actions.NOTIFICATIONS_MARK_AS_VIEWED_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.NOTIFICATIONS_MARK_AS_VIEWED_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* markUnread({ notificationId }) {
  yield put({ type: actions.NOTIFICATIONS_MARK_AS_UNREAD_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/notifications/mark_unread/${notificationId}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
      action: actions.NOTIFICATIONS_MARK_AS_UNREAD_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.NOTIFICATIONS_MARK_AS_UNREAD_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.NOTIFICATIONS_MARK_AS_UNREAD_SUCCESS,
          notificationsCount: jsonData,
        });
      } else {
        yield put({
          type: actions.NOTIFICATIONS_MARK_AS_UNREAD_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.NOTIFICATIONS_MARK_AS_UNREAD_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* markAllAsRead({ userID }) {
  yield put({ type: actions.NOTIFICATIONS_MARK_ALL_AS_READ_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/notifications/mark_all_viewed/${userID}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
      action: actions.NOTIFICATIONS_MARK_ALL_AS_READ_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.NOTIFICATIONS_MARK_ALL_AS_READ_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.NOTIFICATIONS_MARK_ALL_AS_READ_SUCCESS,
          notificationsCount: jsonData,
        });
      } else {
        yield put({
          type: actions.NOTIFICATIONS_MARK_ALL_AS_READ_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    }
  } catch (error) {
    yield put({
      type: actions.NOTIFICATIONS_MARK_ALL_AS_READ_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* notificationsSaga() {
  yield all([
    takeLatest(actions.NOTIFICATIONS_BY_USER, getNotificationsByUser),
    takeLatest(actions.NOTIFICATIONS_COUNT_BY_USER, getNotificationsCount),
    takeLatest(actions.NOTIFICATIONS_MARK_AS_VIEWED, markViewed),
    takeLatest(actions.NOTIFICATIONS_MARK_AS_UNREAD, markUnread),
    takeLatest(actions.NOTIFICATIONS_MARK_ALL_AS_READ, markAllAsRead),
  ]);
}
