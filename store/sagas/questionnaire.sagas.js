import { put, take, all, takeEvery } from 'redux-saga/effects';

import * as SecureStore from 'expo-secure-store';

import * as actions from '../actions/questionnaire.actions';

export function* getActiveQuestionnaires() {
  yield put({ type: actions.GET_QUESTIONNAIRES_ACTIVE_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-questionnaire/v1/questionnaires`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GET_QUESTIONNAIRES_ACTIVE_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GET_QUESTIONNAIRES_ACTIVE_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (jsonData) {
        yield put({
          type: actions.GET_QUESTIONNAIRES_ACTIVE_SUCCESS,
          payload: jsonData,
        });
      }
    } else {
      yield put({
        type: actions.GET_QUESTIONNAIRES_ACTIVE_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GET_QUESTIONNAIRES_ACTIVE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getQuestionnaireById({ id }) {
  yield put({ type: actions.GET_QUESTIONNAIRE_BY_ID_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-questionnaire/v1/questionnaires/${id}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GET_QUESTIONNAIRE_BY_ID_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GET_QUESTIONNAIRE_BY_ID_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (jsonData) {
        yield put({
          type: actions.GET_QUESTIONNAIRE_BY_ID_SUCCESS,
          payload: jsonData,
        });
      }
    } else {
      yield put({
        type: actions.GET_QUESTIONNAIRE_BY_ID_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GET_QUESTIONNAIRE_BY_ID_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* submitQuestionnaire({ questionnaire }) {
  yield put({ type: actions.SUBMIT_QUESTIONNAIRE_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-questionnaire/v1/submit`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(questionnaire),
      },
      action: actions.SUBMIT_QUESTIONNAIRE_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.SUBMIT_QUESTIONNAIRE_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (jsonData) {
        yield put({
          type: actions.SUBMIT_QUESTIONNAIRE_SUCCESS,
          payload: jsonData,
        });
      }
    } else {
      yield put({
        type: actions.SUBMIT_QUESTIONNAIRE_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.SUBMIT_QUESTIONNAIRE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* questionnairesSaga() {
  yield all([takeEvery(actions.GET_QUESTIONNAIRES_ACTIVE, getActiveQuestionnaires)]);
  yield all([takeEvery(actions.GET_QUESTIONNAIRE_BY_ID, getQuestionnaireById)]);
  yield all([takeEvery(actions.SUBMIT_QUESTIONNAIRE, submitQuestionnaire)]);
}
