import { put, take, takeEvery, takeLatest, all, select } from 'redux-saga/effects';

import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import * as SecureStore from 'expo-secure-store';

import * as actions from '../actions/contacts.actions';

import utils from 'utils';

export function* getAll({ filter }) {
  yield put({ type: actions.CONTACTS_GETALL_START });
  const userData = yield select((state) => state.userReducer.userData);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  let newFilter = {
    ...filter,
  };
  delete newFilter.filtered;
  delete newFilter.filterOption;
  delete newFilter.filterText;
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts${utils.recursivelyMapFilterOnQueryParams(
        newFilter,
        '',
        '',
        userData,
      )}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GETALL_RESPONSE,
    },
  });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  try {
    let response = yield take(actions.CONTACTS_GETALL_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (jsonData.posts) {
        if (isConnected) {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: jsonData.posts,
            filter,
            total: parseInt(jsonData.total),
          });
        } else {
          yield put({
            type: actions.CONTACTS_GETALL_SUCCESS,
            contacts: jsonData.posts,
            filter,
            offline: true,
          });
        }
      } else {
        yield put({
          type: actions.CONTACTS_GETALL_SUCCESS,
          contacts: [],
          filter,
        });
      }
    } else if (isConnected) {
      yield put({
        type: actions.CONTACTS_GETALL_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GETALL_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* save({ contactData }) {
  yield put({ type: actions.CONTACTS_SAVE_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  const contact = contactData;
  if (contact.initial_comment) {
    delete contact.initial_comment;
  }
  let contactId = '';
  // Add ID to URL only on D.B. IDs
  if (contact.ID && !isNaN(contact.ID)) {
    contactId = contact.ID;
  }
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contact),
      },
      isConnected,
      action: actions.CONTACTS_SAVE_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.CONTACTS_SAVE_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_SAVE_SUCCESS,
          contact: jsonData,
        });
      } else {
        yield put({
          type: actions.CONTACTS_SAVE_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } else {
      jsonData = {
        ...response,
      };
      if (contactId.length > 0) {
        jsonData = {
          ...jsonData,
          ID: contactId,
        };
      }
      if (jsonData.assigned_to) {
        let assignedToId = parseInt(jsonData.assigned_to.replace('user-', ''));
        let usersList = yield ExpoFileSystemStorage.getItem('usersList');
        usersList = JSON.parse(usersList).map((user) => ({
          key: user.ID,
          label: user.name,
        }));

        jsonData = {
          ...jsonData,
          assigned_to: {
            key: assignedToId,
            label: usersList.find((user) => user.key === assignedToId).label,
          },
        };
      }
      yield put({
        type: actions.CONTACTS_SAVE_SUCCESS,
        contact: jsonData,
        offline: true,
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_SAVE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getById({ contactId }) {
  yield put({ type: actions.CONTACTS_GETBYID_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GETBYID_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.CONTACTS_GETBYID_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_GETBYID_SUCCESS,
        contact: jsonData,
      });
    } else {
      yield put({
        type: actions.CONTACTS_GETBYID_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GETBYID_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* saveComment({ contactId, commentData }) {
  yield put({ type: actions.CONTACTS_SAVE_COMMENT_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/comments/${
        commentData.ID ? commentData.ID : ''
      }`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: commentData.ID ? commentData.content : commentData.comment,
          comment_type: 'comment',
          ID: commentData.ID ? commentData.ID : undefined,
        }),
      },
      isConnected,
      action: actions.CONTACTS_SAVE_COMMENT_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_SAVE_COMMENT_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_SAVE_COMMENT_SUCCESS,
          comment: commentData.ID ? commentData : jsonData,
          contactId,
        });
      } else {
        yield put({
          type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } else {
      const authorName = yield select((state) => state.userReducer.userData.username);
      jsonData = {
        ...response,
        author: authorName,
      };
      yield put({
        type: actions.CONTACTS_SAVE_COMMENT_SUCCESS,
        comment: commentData.ID ? commentData : jsonData,
        contactId,
        offline: true,
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_SAVE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getCommentsByContact({ contactId, pagination }) {
  yield put({ type: actions.CONTACTS_GET_COMMENTS_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  try {
    yield put({
      type: 'REQUEST',
      payload: {
        url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/comments?number=${pagination.limit}&offset=${pagination.offset}`,
        data: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        action: actions.CONTACTS_GET_COMMENTS_RESPONSE,
      },
    });
    let response = yield take(actions.CONTACTS_GET_COMMENTS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_GET_COMMENTS_SUCCESS,
        comments: jsonData.comments,
        contactId: contactId,
        pagination: {
          ...pagination,
          total: jsonData.total,
        },
      });
    } else {
      yield put({
        type: actions.CONTACTS_GET_COMMENTS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_COMMENTS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getActivitiesByContact({ contactId, pagination }) {
  yield put({ type: actions.CONTACTS_GET_ACTIVITIES_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  if (isNaN(contactId)) {
    yield put({
      type: actions.CONTACTS_GET_ACTIVITIES_SUCCESS,
      activities: [],
      total: 0,
    });
  } else {
    yield put({
      type: 'REQUEST',
      payload: {
        url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/activity?number=${pagination.limit}&offset=${pagination.offset}`,
        data: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        action: actions.CONTACTS_GET_ACTIVITIES_RESPONSE,
      },
    });
    try {
      let response = yield take(actions.CONTACTS_GET_ACTIVITIES_RESPONSE);
      response = response.payload;
      const jsonData = response.data;
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_GET_ACTIVITIES_SUCCESS,
          activities: jsonData.activity,
          contactId: contactId,
          pagination: {
            ...pagination,
            total: jsonData.total,
          },
        });
      } else {
        yield put({
          type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } catch (error) {
      yield put({
        type: actions.CONTACTS_GET_ACTIVITIES_FAILURE,
        error: {
          code: '400',
          message: 'Unable to process the request. Please try again later.',
        },
      });
    }
  }
}

export function* getSettings() {
  yield put({ type: actions.CONTACTS_GET_SETTINGS_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/settings`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GET_SETTINGS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_GET_SETTINGS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_GET_SETTINGS_SUCCESS,
        settings: jsonData,
      });
    } else {
      yield put({
        type: actions.CONTACTS_GET_SETTINGS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_SETTINGS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* deleteComment({ contactId, commentId }) {
  yield put({ type: actions.CONTACTS_DELETE_COMMENT_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/comments/${commentId}`,
      data: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      isConnected,
      action: actions.CONTACTS_DELETE_COMMENT_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_DELETE_COMMENT_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.CONTACTS_DELETE_COMMENT_SUCCESS,
          contactId,
          commentId,
        });
      } else {
        yield put({
          type: actions.CONTACTS_DELETE_COMMENT_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } else {
      yield put({
        type: actions.CONTACTS_DELETE_COMMENT_SUCCESS,
        contactId,
        commentId,
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_DELETE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getShareSettings({ contactId }) {
  yield put({ type: actions.CONTACTS_GET_SHARE_SETTINGS_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/shares`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GET_SHARE_SETTINGS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_GET_SHARE_SETTINGS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_GET_SHARE_SETTINGS_SUCCESS,
        shareSettings: jsonData,
        contactId,
        isConnected,
      });
    } else {
      yield put({
        type: actions.CONTACTS_GET_SHARE_SETTINGS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_SHARE_SETTINGS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* addUserToShare({ contactId, userId }) {
  yield put({ type: actions.CONTACTS_ADD_USER_SHARE_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/shares`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      },
      isConnected,
      action: actions.CONTACTS_ADD_USER_SHARE_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_ADD_USER_SHARE_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      let usersList = yield ExpoFileSystemStorage.getItem('usersList');
      (usersList = JSON.parse(usersList).map((user) => ({
        value: parseInt(user.ID),
        name: user.name,
      }))),
        (userData = usersList.find((user) => user.value === parseInt(userId)));

      yield put({
        type: actions.CONTACTS_ADD_USER_SHARE_SUCCESS,
        userData,
        contactId,
      });
    } else {
      yield put({
        type: actions.CONTACTS_ADD_USER_SHARE_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_ADD_USER_SHARE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* removeSharedUser({ contactId, userId }) {
  yield put({ type: actions.CONTACTS_REMOVE_SHARED_USER_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/shares`,
      data: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      },
      isConnected,
      action: actions.CONTACTS_REMOVE_SHARED_USER_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_REMOVE_SHARED_USER_RESPONSE);
    response = response.payload;
    const jsonData = response.data;

    if (response.status === 200) {
      let usersList = yield ExpoFileSystemStorage.getItem('usersList');
      (usersList = JSON.parse(usersList).map((user) => ({
        value: parseInt(user.ID),
        name: user.name,
      }))),
        (userData = usersList.find((user) => user.value === parseInt(userId)));

      yield put({
        type: actions.CONTACTS_REMOVE_SHARED_USER_SUCCESS,
        userData,
        contactId,
      });
    } else {
      yield put({
        type: actions.CONTACTS_REMOVE_SHARED_USER_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_REMOVE_SHARED_USER_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getTags() {
  yield put({ type: actions.CONTACTS_GET_TAGS_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/contacts/multi-select-values?field=tags`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.CONTACTS_GET_TAGS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.CONTACTS_GET_TAGS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.CONTACTS_GET_TAGS_SUCCESS,
        tags: jsonData,
      });
    } else {
      yield put({
        type: actions.CONTACTS_GET_TAGS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.CONTACTS_GET_TAGS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* contactsSaga() {
  yield all([
    takeLatest(actions.CONTACTS_GETALL, getAll),
    takeEvery(actions.CONTACTS_SAVE, save),
    takeEvery(actions.CONTACTS_GETBYID, getById),
    takeEvery(actions.CONTACTS_GET_COMMENTS, getCommentsByContact),
    takeEvery(actions.CONTACTS_SAVE_COMMENT, saveComment),
    takeEvery(actions.CONTACTS_GET_ACTIVITIES, getActivitiesByContact),
    takeEvery(actions.CONTACTS_GET_SETTINGS, getSettings),
    takeEvery(actions.CONTACTS_DELETE_COMMENT, deleteComment),
    takeEvery(actions.CONTACTS_GET_SHARE_SETTINGS, getShareSettings),
    takeEvery(actions.CONTACTS_ADD_USER_SHARE, addUserToShare),
    takeEvery(actions.CONTACTS_REMOVE_SHARED_USER, removeSharedUser),
    takeEvery(actions.CONTACTS_GET_TAGS, getTags),
  ]);
}
