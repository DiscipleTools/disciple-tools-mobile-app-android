import { all, take, select, put, call, takeEvery, fork } from 'redux-saga/effects';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { getContactFilters, getGroupFilters } from '../sagas/users.sagas';

export function* phoneIsOnline() {
  let queue = yield select((state) => state.requestReducer.queue);

  for (let action of queue) {
    let mappedRequest = {
      ...action,
    };
    // Only process POST and SAVE requests
    if (action.data.method === 'POST' || action.data.method === 'DELETE') {
      if (action.action.includes('SAVE') || action.action.includes('DELETE')) {
        mappedRequest = {
          ...mappedRequest,
          isConnected: true,
        };

        yield put({
          type: 'REQUEST',
          payload: mappedRequest,
        });

        let response = yield take(mappedRequest.action);
        response = response.payload;

        if (Object.prototype.hasOwnProperty.call(response, 'status')) {
          let jsonData = response.data;

          if (response.oldID) {
            jsonData = {
              ...jsonData,
              oldID: response.oldID,
            };
          }

          if (response.status === 200) {
            if (jsonData.oldID) {
              const entityListName = action.action
                .substr(0, action.action.indexOf('_'))
                .toLowerCase();
              // Map comments requests of entity
              queue.forEach(function (requestTwo, index) {
                let mappedRequestTwo = {
                  ...requestTwo,
                };
                // update oldID to ID in URL
                if (requestTwo.url.includes(`${entityListName}/${jsonData.oldID}/comments`)) {
                  mappedRequestTwo = {
                    ...mappedRequestTwo,
                    url: requestTwo.url.replace(jsonData.oldID, jsonData.ID),
                  };
                }
                // search only in POST requests
                if (requestTwo.data.method === 'POST') {
                  let requestBody = { ...JSON.parse(requestTwo.data.body) };

                  Object.keys(requestBody).forEach((key) => {
                    const value = requestBody[key];
                    // Update temporal ID in multi-value fields with back-end ID
                    if (
                      Object.prototype.hasOwnProperty.call(value, 'values') &&
                      value.values.length > 0
                    ) {
                      let mappedValue = value.values;

                      mappedValue = mappedValue.map((object) => {
                        let copyObject = { ...object };

                        if (copyObject.value === jsonData.oldID) {
                          copyObject = {
                            value: jsonData.ID.toString(),
                          };
                        }

                        return copyObject;
                      });

                      requestBody = {
                        ...requestBody,
                        [key]: {
                          values: mappedValue,
                        },
                      };
                    }
                  });

                  mappedRequestTwo = {
                    ...mappedRequestTwo,
                    data: {
                      ...mappedRequestTwo.data,
                      body: JSON.stringify(requestBody),
                    },
                  };
                }

                queue[index] = {
                  ...mappedRequestTwo,
                };
              });
            }

            if (!mappedRequest.url.includes('/comments')) {
              const entityName = action.action
                .substr(0, action.action.indexOf('_') - 1)
                .toLowerCase();

              yield put({
                type: mappedRequest.action.replace('RESPONSE', 'SUCCESS'),
                [entityName]: jsonData,
              });
            }
          } else {
            yield put({
              type: mappedRequest.action.replace('RESPONSE', 'FAILURE'),
              error: {
                code: jsonData.code,
                message: jsonData.message,
              },
            });
          }
        }
      } else if (action.action.includes('UPDATE_USER_INFO')) {
        yield put({
          type: 'REQUEST',
          payload: mappedRequest,
        });

        let response = yield take(mappedRequest.action);
        response = response.payload;

        if (response.status === 200) {
          yield put({
            type: mappedRequest.action.replace('RESPONSE', 'SUCCESS'),
            ...JSON.parse(mappedRequest.data.body),
          });
        } else {
          let jsonData = response.data;

          yield put({
            type: mappedRequest.action.replace('RESPONSE', 'FAILURE'),
            error: {
              code: jsonData.code,
              message: jsonData.message,
            },
          });
        }
      } else if (
        action.action.includes('ADD_USER_SHARE') ||
        action.action.includes('REMOVE_SHARED_USER')
      ) {
        yield put({
          type: 'REQUEST',
          payload: mappedRequest,
        });

        let response = yield take(mappedRequest.action);
        response = response.payload;

        if (response.status === 200) {
          let parsedBody = JSON.parse(mappedRequest.data.body);

          let usersList = yield ExpoFileSystemStorage.getItem('usersList');
          (usersList = JSON.parse(usersList).map((user) => ({
            value: parseInt(user.ID),
            name: user.name,
          }))),
            (userData = usersList.find((user) => user.value === parseInt(parsedBody.user_id)));

          let urlSplit = mappedRequest.url.split('/');

          let contactId = urlSplit[urlSplit.length - 2];

          yield put({
            type: mappedRequest.action.replace('RESPONSE', 'SUCCESS'),
            userData,
            contactId,
          });
        } else {
          let jsonData = response.data;

          yield put({
            type: mappedRequest.action.replace('RESPONSE', 'FAILURE'),
            error: {
              code: jsonData.code,
              message: jsonData.message,
            },
          });
        }
      }
    }
  }
  yield fork(getFiltersConfig);
}

export function* phoneIsOffline() {
  yield fork(getFiltersConfig);
}

function* getFiltersConfig() {
  const userData = yield select((state) => state.userReducer.userData);
  // TODO: revisit
  //if (userData.domain && userData.token) {
  yield call(getContactFilters);
  yield call(getGroupFilters);
  //}
}

export default function* networkConnectivity() {
  yield all([takeEvery('ONLINE', phoneIsOnline)]);
  yield all([takeEvery('OFFLINE', phoneIsOffline)]);
}
