import { put, take, all, takeLatest, takeEvery, select } from 'redux-saga/effects';

import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';

import * as SecureStore from 'expo-secure-store';

import * as actions from '../actions/groups.actions';

import utils from 'utils';

export function* getAll({ filter }) {
  yield put({ type: actions.GROUPS_GETALL_START });
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
      url: `https://${domain}/wp-json/dt-posts/v2/groups${utils.recursivelyMapFilterOnQueryParams(
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
      action: actions.GROUPS_GETALL_RESPONSE,
    },
  });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  try {
    let response = yield take(actions.GROUPS_GETALL_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      if (isConnected) {
        yield put({
          type: actions.GROUPS_GETALL_SUCCESS,
          groups: jsonData.posts,
          filter,
          total: parseInt(jsonData.total),
        });
      } else {
        yield put({
          type: actions.GROUPS_GETALL_SUCCESS,
          groups: jsonData.posts,
          filter,
          offline: true,
        });
      }
    } else {
      yield put({
        type: actions.GROUPS_GETALL_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETALL_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* saveGroup({ groupData }) {
  yield put({ type: actions.GROUPS_SAVE_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  const group = groupData;
  let groupId = '';
  // Add ID to URL only on D.B. IDs
  if (group.ID && !isNaN(group.ID)) {
    groupId = group.ID;
  }

  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}`,
      data: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(group),
      },
      isConnected,
      action: actions.GROUPS_SAVE_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_SAVE_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_SAVE_SUCCESS,
          group: jsonData,
        });
      } else {
        yield put({
          type: actions.GROUPS_SAVE_FAILURE,
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
      if (groupId.length > 0) {
        jsonData = {
          ...jsonData,
          ID: groupId,
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
        type: actions.GROUPS_SAVE_SUCCESS,
        group: jsonData,
        offline: true,
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getById({ groupId }) {
  yield put({ type: actions.GROUPS_GETBYID_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GETBYID_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GETBYID_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GETBYID_SUCCESS,
        group: jsonData,
      });
    } else {
      yield put({
        type: actions.GROUPS_GETBYID_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GETBYID_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getCommentsByGroup({ groupId, pagination }) {
  yield put({ type: actions.GROUPS_GET_COMMENTS_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  try {
    yield put({
      type: 'REQUEST',
      payload: {
        url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/comments?number=${pagination.limit}&offset=${pagination.offset}`,
        data: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
        action: actions.GROUPS_GET_COMMENTS_RESPONSE,
      },
    });
    let response = yield take(actions.GROUPS_GET_COMMENTS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_COMMENTS_SUCCESS,
        comments: jsonData.comments,
        groupId: groupId,
        pagination: {
          ...pagination,
          total: jsonData.total,
        },
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_COMMENTS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_COMMENTS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* saveComment({ groupId, commentData }) {
  yield put({ type: actions.GROUPS_SAVE_COMMENT_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/comments/${
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
      action: actions.GROUPS_SAVE_COMMENT_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_SAVE_COMMENT_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_SAVE_COMMENT_SUCCESS,
          comment: commentData.ID ? commentData : jsonData,
          groupId,
        });
      } else {
        yield put({
          type: actions.GROUPS_SAVE_COMMENT_FAILURE,
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
        type: actions.GROUPS_SAVE_COMMENT_SUCCESS,
        comment: commentData.ID ? commentData : jsonData,
        groupId,
        offline: true,
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_SAVE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getLocations() {
  yield put({ type: actions.GROUPS_GET_LOCATIONS_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-mobile-app/v1/locations`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_LOCATIONS_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.GROUPS_GET_LOCATIONS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      // TODO: safeguards around this
      yield ExpoFileSystemStorage.setItem('locationsList', JSON.stringify(jsonData.location_grid));
      /* NOTE: we do not want to reduce this (thus storing to AsyncStorage) AND perform getItem/setItem
      yield put({
        type: actions.GROUPS_GET_LOCATIONS_SUCCESS,
        geonames: jsonData.location_grid,
      });
      */
    } else {
      yield put({
        type: actions.GROUPS_GET_LOCATIONS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_LOCATIONS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getPeopleGroups() {
  yield put({ type: actions.GROUPS_GET_PEOPLE_GROUPS_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/people-groups/compact`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_PEOPLE_GROUPS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_PEOPLE_GROUPS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      // TODO: safeguards around this
      yield ExpoFileSystemStorage.setItem('peopleGroups', JSON.stringify(jsonData.posts));
      /*
      yield put({
        type: actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS,
        peopleGroups: jsonData.posts,
      });
      */
    } else {
      yield put({
        type: actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getActivitiesByGroup({ groupId, pagination }) {
  yield put({ type: actions.GROUPS_GET_ACTIVITIES_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/activity?number=${pagination.limit}&offset=${pagination.offset}`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_ACTIVITIES_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_ACTIVITIES_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_ACTIVITIES_SUCCESS,
        activities: jsonData.activity,
        groupId: groupId,
        pagination: {
          ...pagination,
          total: jsonData.total,
        },
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_ACTIVITIES_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_ACTIVITIES_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getSettings() {
  yield put({ type: actions.GROUPS_GET_SETTINGS_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/settings`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_SETTINGS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_SETTINGS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_SETTINGS_SUCCESS,
        settings: jsonData,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_SETTINGS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_SETTINGS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* searchLocations({ queryText }) {
  yield put({ type: actions.GROUPS_GET_LOCATIONS_START });
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt/v1/mapping_module/search_location_grid_by_name?s=${queryText}&filter=focus`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_LOCATIONS_RESPONSE,
    },
  });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  try {
    let response = yield take(actions.GROUPS_GET_LOCATIONS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_LOCATIONS_SEARCH_SUCCESS,
        filteredGeonames: jsonData.location_grid,
        offline: !isConnected,
        queryText,
      });
    } else {
      yield put({
        type: actions.GROUPS_LOCATIONS_SEARCH_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_LOCATIONS_SEARCH_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getLocationListLastModifiedDate() {
  // TODO: add START?
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-mobile-app/v1/location-data`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_LOCATIONS_MODIFIED_DATE_RESPONSE,
    },
  });
  try {
    let response = yield take(actions.GROUPS_LOCATIONS_MODIFIED_DATE_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_LOCATIONS_MODIFIED_DATE_SUCCESS,
        geonamesLastModifiedDate: jsonData.last_modified_date,
      });
    } else {
      yield put({
        type: actions.GROUPS_LOCATIONS_MODIFIED_DATE_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_LOCATIONS_MODIFIED_DATE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* deleteComment({ groupId, commentId }) {
  yield put({ type: actions.GROUPS_DELETE_COMMENT_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/comments/${commentId}`,
      data: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      isConnected,
      action: actions.GROUPS_DELETE_COMMENT_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_DELETE_COMMENT_RESPONSE);
    response = response.payload;
    let jsonData = response.data;
    if (isConnected) {
      if (response.status === 200) {
        yield put({
          type: actions.GROUPS_DELETE_COMMENT_SUCCESS,
          groupId,
          commentId,
        });
      } else {
        yield put({
          type: actions.GROUPS_DELETE_COMMENT_FAILURE,
          error: {
            code: jsonData.code,
            message: jsonData.message,
          },
        });
      }
    } else {
      yield put({
        type: actions.GROUPS_DELETE_COMMENT_SUCCESS,
        groupId,
        commentId,
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_DELETE_COMMENT_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* getShareSettings({ groupId }) {
  yield put({ type: actions.GROUPS_GET_SHARE_SETTINGS_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/shares`,
      data: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      action: actions.GROUPS_GET_SHARE_SETTINGS_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_GET_SHARE_SETTINGS_RESPONSE);
    response = response.payload;
    const jsonData = response.data;
    if (response.status === 200) {
      yield put({
        type: actions.GROUPS_GET_SHARE_SETTINGS_SUCCESS,
        shareSettings: jsonData,
        groupId,
        isConnected,
      });
    } else {
      yield put({
        type: actions.GROUPS_GET_SHARE_SETTINGS_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_GET_SHARE_SETTINGS_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* addUserToShare({ groupId, userId }) {
  yield put({ type: actions.GROUPS_ADD_USER_SHARE_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/shares`,
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
      action: actions.GROUPS_ADD_USER_SHARE_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_ADD_USER_SHARE_RESPONSE);
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
        type: actions.GROUPS_ADD_USER_SHARE_SUCCESS,
        userData,
        groupId,
      });
    } else {
      yield put({
        type: actions.GROUPS_ADD_USER_SHARE_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_ADD_USER_SHARE_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export function* removeSharedUser({ groupId, userId }) {
  yield put({ type: actions.GROUPS_REMOVE_SHARED_USER_START });
  const isConnected = yield select((state) => state.networkConnectivityReducer.isConnected);
  const token = yield SecureStore.getItemAsync('authToken');
  const domain = yield SecureStore.getItemAsync('domain');
  yield put({
    type: 'REQUEST',
    payload: {
      url: `https://${domain}/wp-json/dt-posts/v2/groups/${groupId}/shares`,
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
      action: actions.GROUPS_REMOVE_SHARED_USER_RESPONSE,
    },
  });

  try {
    let response = yield take(actions.GROUPS_REMOVE_SHARED_USER_RESPONSE);
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
        type: actions.GROUPS_REMOVE_SHARED_USER_SUCCESS,
        userData,
        groupId,
      });
    } else {
      yield put({
        type: actions.GROUPS_REMOVE_SHARED_USER_FAILURE,
        error: {
          code: jsonData.code,
          message: jsonData.message,
        },
      });
    }
  } catch (error) {
    yield put({
      type: actions.GROUPS_REMOVE_SHARED_USER_FAILURE,
      error: {
        code: '400',
        message: 'Unable to process the request. Please try again later.',
      },
    });
  }
}

export default function* groupsSaga() {
  yield all([
    takeEvery(actions.GROUPS_SAVE, saveGroup),
    takeLatest(actions.GROUPS_GETALL, getAll),
    takeEvery(actions.GROUPS_GETBYID, getById),
    takeEvery(actions.GROUPS_GET_COMMENTS, getCommentsByGroup),
    takeEvery(actions.GROUPS_SAVE_COMMENT, saveComment),
    takeEvery(actions.GROUPS_GET_LOCATIONS, getLocations),
    takeEvery(actions.GROUPS_GET_PEOPLE_GROUPS, getPeopleGroups),
    takeEvery(actions.GROUPS_GET_ACTIVITIES, getActivitiesByGroup),
    takeEvery(actions.GROUPS_GET_SETTINGS, getSettings),
    takeEvery(actions.GROUPS_LOCATIONS_SEARCH, searchLocations),
    takeEvery(actions.GROUPS_LOCATIONS_MODIFIED_DATE, getLocationListLastModifiedDate),
    takeEvery(actions.GROUPS_DELETE_COMMENT, deleteComment),
    takeEvery(actions.GROUPS_GET_SHARE_SETTINGS, getShareSettings),
    takeEvery(actions.GROUPS_ADD_USER_SHARE, addUserToShare),
    takeEvery(actions.GROUPS_REMOVE_SHARED_USER, removeSharedUser),
  ]);
}
