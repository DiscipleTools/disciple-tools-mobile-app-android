import { put, take, takeLatest, all, takeEvery } from 'redux-saga/effects';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Random from 'expo-random';
import * as SecureStore from 'expo-secure-store';

import * as actions from 'store/actions/user.actions';
import * as i18nActions from 'store/actions/i18n.actions';
import i18n from 'languages';

export function* login({ domain, username, password }) {
  console.log('*** USER_LOGIN_START ***');
  console.log(`DOMAIN: ${domain}`);
  console.log(`USERNAME: ${username}`);
  console.log(`PASSWORD: ${password}`);
  yield put({ type: actions.USER_LOGIN_START });
  // fetch JWT token
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/jwt-auth/v1/token`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      },
      action: actions.USER_LOGIN_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.USER_LOGIN_RESPONSE);
    response = response.payload;
    const userData = response.data;
    console.log('*** USER_LOGIN_RESPONSE ***');
    if (response.status === 200) {
      console.log(JSON.stringify(userData));
      // NOTE: Random and SecureStore will break when 'Remote Debugging JS' is enabled
      const cnonceLogin = Random.getRandomBytes(256).toString();
      // TODO: use keys from Constants
      // TODO: check for undefined?
      yield SecureStore.setItemAsync('cnonceLoginDT', new Date().toString());
      yield SecureStore.setItemAsync('cnonceLogin', cnonceLogin);
      yield SecureStore.setItemAsync('domain', domain);
      if (userData.token) yield SecureStore.setItemAsync('authToken', userData.token);
      if (userData.user_nicename)
        yield SecureStore.setItemAsync('username', userData.user_nicename);
      if (userData.user_email) yield SecureStore.setItemAsync('userEmail', userData.user_email);
      // NOTE: we do NOT want to reduce the token to global state to be stored in plain-text in AsyncStorage, so we store it in SecureStore above and delete it below
      // TODO: should D.T *not* return actual username (for security sake)?
      if (userData.token) delete userData.token;
      if (userData.user_nicename) delete userData.user_nicename;
      if (userData.user_email) delete userData.user_email;
      yield put({
        type: actions.USER_LOGIN_SUCCESS,
        user: { ...userData },
        cnonceLogin,
      });
      if (userData.locale) {
        yield put({
          type: i18nActions.I18N_SET_LOCALE,
          locale: userData.locale,
        });
      }
    } else {
      yield put({
        type: actions.USER_LOGIN_FAILURE,
        error: {
          code: userData.code,
          message: userData.message,
        },
      });
    }
  } catch (error) {
    console.log('!!!!!!!! LOGIN EXCEPTION !!!!!!!!!!');
    console.log(error);
    yield put({
      type: actions.USER_LOGIN_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* toggleRememberLoginDetails({ rememberLoginDetails }) {
  let domain = '';
  let username = '';
  try {
    // TODO: use keys from Constants
    if (rememberLoginDetails) {
      domain = yield SecureStore.getItemAsync('domain');
      username = yield SecureStore.getItemAsync('username');
    }
  } catch (e) {
    console.warn(e);
    yield put({
      type: actions.TOGGLE_REMEMBER_LOGIN_DETAILS_FAILURE,
      error: e.toString(),
    });
  } finally {
    yield put({
      type: actions.TOGGLE_REMEMBER_LOGIN_DETAILS_SUCCESS,
      userData: {
        domain,
        username,
      },
      rememberLoginDetails,
    });
  }
}

export function* setPIN({ code }) {
  try {
    // TODO: use keys from Constants
    yield SecureStore.setItemAsync('pinCode', code);
  } catch (e) {
    console.warn(e);
    yield put({
      type: actions.SET_PIN_FAILURE,
      error: e.toString(),
    });
  } finally {
    yield put({
      type: actions.SET_PIN_SUCCESS,
      hasPIN: true,
    });
  }
}

export function* deletePIN() {
  try {
    // TODO: use keys from Constants
    yield SecureStore.deleteItemAsync('pinCode');
  } catch (e) {
    console.warn(e);
    yield put({
      type: actions.DELETE_PIN_FAILURE,
      error: e.toString(),
    });
  } finally {
    yield put({
      type: actions.DELETE_PIN_SUCCESS,
      hasPIN: false,
    });
  }
}

export function* generatePINCNonce() {
  let cnoncePIN = null;
  try {
    cnoncePIN = Random.getRandomBytes(256).toString();
    // TODO: use keys from Constants
    yield SecureStore.setItemAsync('cnoncePINDT', new Date().toString());
    yield SecureStore.setItemAsync('cnoncePIN', cnoncePIN);
  } catch (e) {
    console.warn(e);
    yield put({
      type: actions.GENERATE_PIN_CNONCE_FAILURE,
      error: e.toString(),
    });
  } finally {
    yield put({
      type: actions.GENERATE_PIN_CNONCE_SUCCESS,
      cnoncePIN,
    });
  }
}

export function* logout({ zz }) {
  console.log('*** MADE IT TO SAGA LOGOUT ***');
  console.log(`zz? ${zz}`);
  let isSignout = null;
  try {
    // Force 'Login Screen' re-render by using unique value
    isSignout = Random.getRandomBytes(8).toString();
    // TODO: use keys from Constants
    yield SecureStore.deleteItemAsync('authToken');
    yield SecureStore.deleteItemAsync('domain');
    yield SecureStore.deleteItemAsync('username');
    yield SecureStore.deleteItemAsync('userEmail');
    yield SecureStore.deleteItemAsync('cnonceLoginDT');
    yield SecureStore.deleteItemAsync('cnonceLogin');
    yield SecureStore.deleteItemAsync('cnoncePINDT');
    yield SecureStore.deleteItemAsync('cnoncePIN');
  } catch (e) {
    console.warn(e);
    yield put({
      type: actions.USER_LOGOUT_FAILURE,
      error: e.toString(),
    });
  } finally {
    yield put({
      type: actions.USER_LOGOUT_SUCCESS,
      isSignout,
    });
  }
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

export function* getExpoPushToken() {
  let expoPushToken = {};
  // Get push token from expo
  expoPushToken = yield registerForPushNotificationsAsync();
  // Construct a (somewhat) unique identifier for this particular device
  let uniqueId =
    (Device.manufacturer || '') +
    ':' +
    (Device.modelName || '') +
    ':' +
    (Device.deviceYearClass || '') +
    ':' +
    (Device.osName || '');
  yield put({ type: actions.USER_ADD_PUSH_TOKEN, expoPushToken, uniqueId });
}

export function* addPushToken({ expoPushToken, uniqueId }) {
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/user/update`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          add_push_token: {
            token: expoPushToken,
            device_id: uniqueId,
          },
        }),
      },
      action: actions.USER_ADD_PUSH_TOKEN_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.USER_ADD_PUSH_TOKEN_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({ type: actions.USER_ADD_PUSH_TOKEN_SUCCESS, domain, user: jsonData });
    } else {
      yield put({
        type: actions.USER_ADD_PUSH_TOKEN_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.USER_ADD_PUSH_TOKEN_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getUserInfo() {
  yield put({ type: actions.GET_MY_USER_INFO_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/user/my`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GET_MY_USER_INFO_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GET_MY_USER_INFO_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GET_MY_USER_INFO_SUCCESS,
        userInfo: jsonData,
      });
    } else {
      yield put({
        type: actions.GET_MY_USER_INFO_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GET_MY_USER_INFO_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* updateUserInfo({ userInfo }) {
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/user/update`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userInfo),
      },
      action: actions.UPDATE_USER_INFO_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.UPDATE_USER_INFO_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.UPDATE_USER_INFO_SUCCESS,
        ...userInfo,
      });
    } else {
      yield put({
        type: actions.UPDATE_USER_INFO_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.UPDATE_USER_INFO_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* userSaga() {
  yield all([
    takeLatest(actions.USER_LOGIN, login),
    takeEvery(actions.GET_MY_USER_INFO, getUserInfo),
    takeLatest(actions.USER_GET_PUSH_TOKEN, getExpoPushToken),
    takeLatest(actions.USER_ADD_PUSH_TOKEN, addPushToken),
    takeLatest(actions.UPDATE_USER_INFO, updateUserInfo),
    takeLatest(actions.TOGGLE_REMEMBER_LOGIN_DETAILS, toggleRememberLoginDetails),
    takeLatest(actions.SET_PIN, setPIN),
    takeLatest(actions.DELETE_PIN, deletePIN),
    takeLatest(actions.GENERATE_PIN_CNONCE, generatePINCNonce),
    takeLatest(actions.USER_LOGOUT, logout),
  ]);
}
