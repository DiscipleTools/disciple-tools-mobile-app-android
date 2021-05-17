import * as actions from '../actions/groups.actions';
import * as userActions from '../actions/user.actions';
import { Html5Entities } from 'html-entities';
import { REHYDRATE } from 'redux-persist/lib/constants';
import utils from 'utils';

const initialState = {
  loading: false,
  error: null,
  groups: [],
  group: null,
  comments: {},
  newComment: false,
  activities: {},
  loadingComments: false,
  loadingActivities: false,
  saved: false,
  settings: null,
  offset: 0,
  peopleGroups: null,
  geonames: [],
  foundGeonames: [],
  geonamesLastModifiedDate: null,
  geonamesLength: 0,
  previousGroups: [],
  loadingShare: false,
  shareSettings: {},
  savedShare: false,
  total: 0,
  filteredGroups: [],
};

export default function groupsReducer(state = initialState, action) {
  let newState = {
    ...state,
    newComment: false,
    error: null,
    saved: false,
    peopleGroups: null,
    foundGeonames: null,
    savedShare: false,
  };
  const entities = new Html5Entities();
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...newState,
        loading: false,
        filteredGroups: [],
      };
    }
    case actions.GROUPS_GET_LOCATIONS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GET_LOCATIONS_SUCCESS:
      return {
        ...newState,
        geonames: Object.keys(action.geonames).map((key) => ({
          value: key,
          name: action.geonames[key],
        })),
        loading: false,
        geonamesLength: Object.keys(action.geonames).length,
      };
    case actions.GROUPS_GET_LOCATIONS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
      return {
        ...newState,
        peopleGroups: action.peopleGroups.map((peopleGroup) => ({
          value: peopleGroup.ID.toString(),
          name: peopleGroup.name,
        })),
        loading: false,
      };
    case actions.GROUPS_GET_PEOPLE_GROUPS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.GROUPS_GETALL_SUCCESS: {
      let { groups, filter, total, offline } = action;
      // Add previously persisted groups
      let currentGroups = newState.groups ? [...newState.groups] : [];
      let filteredGroups = newState.filteredGroups ? [...newState.filteredGroups] : [];
      let newTotal = total ? total : newState.total;
      let newPersistedGroups = [];
      if (offline) {
        // Offline
        // Filter
        if (filter.filtered) {
          let newFilter = { ...filter };
          delete newFilter.filtered;
          delete newFilter.offset;
          delete newFilter.limit;
          if (newFilter.filterOption) {
            delete newFilter.filterOption;
            if (Object.keys(newFilter).length > 0) {
              filteredGroups = utils.groupsByFilter([...currentGroups], newFilter);
            } else {
              filteredGroups = [...currentGroups];
            }
          } else if (newFilter.filterText) {
            delete newFilter.filterText;
            filteredGroups = currentGroups.filter(function (group) {
              const textData = newFilter.name
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              const itemDataTitle = group.title
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              return itemDataTitle.includes(textData);
            });
          }
        } else {
          filteredGroups = [];
        }
        newPersistedGroups = [...currentGroups];
      } else {
        // Online
        let mappedGroups = utils.mapGroups(groups, entities);
        let persistedGroups = currentGroups.filter((currentGroup) =>
          utils.isNumeric(currentGroup.ID),
        );
        // Filter
        if (filter.filtered) {
          // Pagination
          if (filter.offset > 0) {
            let merge = utils.mergeGroupList(mappedGroups, persistedGroups);
            newPersistedGroups = [...merge.persistedGroups, ...merge.newGroups];
            filteredGroups = [...filteredGroups, ...merge.newGroups];
          } else {
            filteredGroups = [...mappedGroups];
          }
        } else {
          // Pagination
          if (filter.offset > 0) {
            let merge = utils.mergeGroupList(mappedGroups, persistedGroups);
            newPersistedGroups = [...merge.persistedGroups, ...merge.newGroups];
          } else {
            newPersistedGroups = [...mappedGroups];
          }
          filteredGroups = [];
        }
      }

      return {
        ...newState,
        groups: newPersistedGroups,
        total: newTotal,
        filteredGroups,
        loading: false,
      };
    }
    case actions.GROUPS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_SAVE_SUCCESS: {
      const { group, offline } = action;
      let mappedGroup = {};
      if (offline) {
        mappedGroup = {
          ...group,
        };
      } else {
        mappedGroup = utils.mapGroup(group, entities);
      }
      const oldId = mappedGroup.oldID ? mappedGroup.oldID : null;
      newState = {
        ...newState,
        group: mappedGroup,
        saved: true,
      };
      const groupIndex = newState.groups.findIndex(
        (groupItem) => groupItem.ID.toString() === group.ID.toString(),
      );
      // Search entity in list (groups) if exists: updated it, otherwise: added it to group list
      if (groupIndex > -1) {
        let newGroupData;
        if (offline) {
          // Editing D.B. entity in OFFLINE mode
          let oldGroupData = {
            ...newState.groups[groupIndex],
          };
          newGroupData = {
            ...newState.groups[groupIndex],
          };
          // Apply modifications from request (mappedGroup) in newGroupData
          Object.keys(mappedGroup).forEach((key) => {
            const value = mappedGroup[key];
            const valueType = Object.prototype.toString.call(value);
            if (
              valueType === '[object Array]' ||
              Object.prototype.hasOwnProperty.call(value, 'values')
            ) {
              let collection;
              let oldCollection;
              if (valueType === '[object Array]') {
                collection = value;
                oldCollection = newGroupData[key] ? [...newGroupData[key]] : [];
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                collection = value.values;
                oldCollection = newGroupData[key] ? [...newGroupData[key].values] : [];
              }
              // compare newCollection with old and merge differences.
              collection.forEach((object) => {
                // search object in newGroupData
                let findObjectInOldRequestIndex;
                if (valueType === '[object Array]') {
                  findObjectInOldRequestIndex = oldCollection.findIndex(
                    (oldObject) => oldObject.key === object.key,
                  );
                } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                  findObjectInOldRequestIndex = oldCollection.findIndex(
                    (oldObject) => oldObject.value === object.value,
                  );
                }
                if (findObjectInOldRequestIndex > -1) {
                  // if exist
                  if (
                    Object.prototype.hasOwnProperty.call(object, 'delete') &&
                    object.delete === true
                  ) {
                    oldCollection.splice(findObjectInOldRequestIndex, 1);
                  } else {
                    // update the object
                    oldCollection[findObjectInOldRequestIndex] = {
                      ...object,
                    };
                  }
                } else {
                  // add the object
                  oldCollection.push({
                    ...object,
                  });
                }
              });
              if (valueType === '[object Array]') {
                newGroupData = {
                  ...newGroupData,
                  [key]: oldCollection,
                };
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                newGroupData = {
                  ...newGroupData,
                  [key]: {
                    values: oldCollection,
                  },
                };
              }
            } else {
              newGroupData = {
                ...newGroupData,
                [key]: value,
              };
            }
          });
          // Update member_count according to current members list.
          let oldMembersListLength = oldGroupData.members ? oldGroupData.members.values.length : 0;
          if (newGroupData.members && newGroupData.members.values.length !== oldMembersListLength) {
            let newMemberCount;
            // If member list length > oldMembersListLength -> set newMemberCount as member list length
            if (newGroupData.members.values.length > oldMembersListLength) {
              newMemberCount = newGroupData.members.values.length.toString();
            }
            // If member list length < oldMembersListLength -> set newMemberCount as current member count minus removed members
            if (newGroupData.members.values.length < oldMembersListLength) {
              let difference = oldMembersListLength - newGroupData.members.values.length;
              newMemberCount = newGroupData.member_count
                ? parseInt(newGroupData.member_count) - difference
                : newGroupData.members.values.length;
            }
            newGroupData = {
              ...newGroupData,
              member_count: newMemberCount,
            };
          }
        } else {
          newGroupData = {
            ...newState.groups[groupIndex],
            ...newState.group,
          };
        }
        newState.groups[groupIndex] = {
          ...newGroupData,
        };
        if (offline) {
          // Return all group data in response
          newState = {
            ...newState,
            group: {
              ...newGroupData,
            },
          };
        }
      } else if (oldId) {
        // Search entity with oldID, remove it and add updated entity
        const oldGroupIndex = newState.groups.findIndex(
          (groupItem) => groupItem.ID.toString() === oldId,
        );
        const previousGroupData = {
          ...newState.groups[oldGroupIndex],
        };
        const newGroupData = {
          ...previousGroupData,
          ...newState.group,
        };
        newState.groups.splice(oldGroupIndex, 1).unshift(newGroupData);
        if (offline) {
          // Return all group data in response
          newState = {
            ...newState,
            group: {
              ...newGroupData,
            },
          };
        }
      } else {
        // Create
        newState.groups.unshift({
          ...newState.group,
        });
      }
      return {
        ...newState,
        loading: false,
      };
    }
    case actions.GROUPS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GETBYID_START:
      return {
        ...newState,
        group: null,
        loading: true,
      };
    case actions.GROUPS_GETBYID_SUCCESS: {
      let group = { ...action.group };
      if (isNaN(group.ID) || group.isOffline) {
        // Search local group
        const foundGroup = newState.groups.find(
          (groupItem) => groupItem.ID.toString() === group.ID,
        );
        // Fix to error when App try to get detail of non existing group (browsing between several groups) in OFFLINE mode
        if (foundGroup) {
          group = {
            ...foundGroup,
          };
        }
      } else {
        group = utils.mapGroup(group, entities);
        // Update localGroup with dbGroup
        const groupIndex = newState.groups.findIndex(
          (groupItem) => groupItem.ID.toString() === group.ID,
        );
        if (groupIndex > -1) {
          newState.groups[groupIndex] = {
            ...group,
          };
        } else {
          // Add retrieved group to groups array (persist to OFFLINE mode)
          newState.groups.unshift(group);
        }
      }
      newState = {
        ...newState,
        group,
        loading: false,
      };
      return newState;
    }
    case actions.GROUPS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_GETBYID_END:
      return {
        ...newState,
        group: null,
      };
    case actions.GROUPS_GET_COMMENTS_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.GROUPS_GET_COMMENTS_SUCCESS: {
      const { comments, groupId, pagination } = action;

      let mappedComments = comments.map((comment) => ({
        ID: comment.comment_ID,
        date: `${comment.comment_date_gmt.replace(' ', 'T')}Z`,
        author: comment.comment_author,
        // Decode HTML strings
        content: entities.decode(comment.comment_content),
        gravatar: comment.gravatar,
      }));
      // Check previous records existence; Only retrieve previous data if pagination its active (offset > 0)
      let previousComments = [];
      if (pagination.offset > 0 && newState.comments[groupId]) {
        previousComments = newState.comments[groupId].data;
      }

      let newCommentState = {
        ...newState.comments,
        [groupId]: {
          data: [...previousComments, ...mappedComments],
          pagination: {
            ...pagination,
            offset: pagination.offset + pagination.limit, // UPDATE OFFSET
          },
        },
      };

      return {
        ...newState,
        comments: newCommentState,
        loadingComments: false,
      };
    }
    case actions.GROUPS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.GROUPS_SAVE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.GROUPS_SAVE_COMMENT_SUCCESS: {
      const { comment, groupId, offline } = action;
      let newComment;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[groupId]) {
        previousComments = newState.comments[groupId].data;
        pagination = newState.comments[groupId].pagination;
      }
      // Search existent comment with ID (update comment)
      let foundCommentIndex = previousComments.findIndex(
        (previousComment) => previousComment.ID === (comment.ID ? comment.ID : comment.comment_ID),
      );

      if (offline) {
        if (foundCommentIndex > -1) {
          newComment = {
            ...comment,
          };
        } else {
          const date = new Date();
          const year = date.getUTCFullYear();
          let day = date.getUTCDate();
          let month = date.getUTCMonth() + 1;
          if (day < 10) day = `0${day}`;
          if (month < 10) month = `0${month}`;
          const curDay = `${year}-${month}-${day}`;
          let hours = date.getUTCHours();
          let minutes = date.getUTCMinutes();
          let seconds = date.getUTCSeconds();
          if (hours < 10) hours = `0${hours}`;
          if (minutes < 10) minutes = `0${minutes}`;
          if (seconds < 10) seconds = `0${seconds}`;
          const currentDate = `${curDay}T${hours}:${minutes}:${seconds}Z`;
          newComment = {
            ID: comment.ID,
            author: comment.author,
            date: currentDate,
            content: comment.comment,
            gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
          };
        }
      } else {
        if (foundCommentIndex > -1) {
          newComment = {
            ...comment,
          };
        } else {
          newComment = {
            ID: comment.comment_ID,
            author: comment.comment_author,
            date: `${comment.comment_date_gmt.replace(' ', 'T')}Z`,
            // Decode HTML strings
            content: entities.decode(comment.comment_content),
            gravatar: 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g',
          };
        }
      }

      let newCommentState;
      if (foundCommentIndex > -1) {
        previousComments[foundCommentIndex] = newComment;

        newCommentState = {
          ...newState.comments,
          [groupId]: {
            data: [...previousComments],
            pagination,
          },
        };
      } else {
        // Add new comment
        newCommentState = {
          ...newState.comments,
          [groupId]: {
            data: [...previousComments, newComment],
            pagination,
          },
        };
      }

      return {
        ...newState,
        comments: newCommentState,
        newComment: true,
        loadingComments: false,
      };
    }
    case actions.GROUPS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.GROUPS_GET_ACTIVITIES_START:
      return {
        ...newState,
        loadingActivities: true,
      };
    case actions.GROUPS_GET_ACTIVITIES_SUCCESS: {
      const { activities, groupId, pagination } = action;

      let mappedActivities = activities.map((activity) => ({
        ID: activity.histid,
        date: new Date(parseInt(activity.hist_time, 10) * 1000).toISOString(),
        // Decode HTML strings
        object_note: entities.decode(activity.object_note),
        gravatar:
          activity.gravatar === ''
            ? 'https://secure.gravatar.com/avatar/?s=16&d=mm&r=g'
            : activity.gravatar,
        meta_id: activity.meta_id,
        meta_key: activity.meta_key,
        name: activity.name,
      }));
      // Check previous records existence; Only retrieve previous data if pagination its active (offset > 0)
      let previousActivities = [];
      if (pagination.offset > 0 && newState.activities[groupId]) {
        previousActivities = newState.activities[groupId].data;
      }

      let newActivityState = {
        ...newState.activities,
        [groupId]: {
          data: [...previousActivities, ...mappedActivities],
          pagination: {
            ...pagination,
            offset: pagination.offset + pagination.limit, // UPDATE OFFSET
          },
        },
      };

      return {
        ...newState,
        activities: newActivityState,
        loadingActivities: false,
      };
    }
    case actions.GROUPS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingActivities: false,
      };
    case userActions.USER_LOGOUT:
      return {
        ...newState,
        groups: [],
        geonames: null,
        settings: null,
        geonamesLastModifiedDate: null,
        geonamesLength: 0,
      };
    case actions.GROUPS_GET_SETTINGS_SUCCESS: {
      const { settings } = action;
      let fieldList = {};
      // Get fieldlist
      Object.keys(settings.fields).forEach((fieldName) => {
        const fieldData = settings.fields[fieldName];
        // omit fields with { "hidden": true }
        if (
          !Object.prototype.hasOwnProperty.call(fieldData, 'hidden') ||
          (Object.prototype.hasOwnProperty.call(fieldData, 'hidden') && fieldData.hidden === false)
        ) {
          if (fieldData.type === 'key_select' || fieldData.type === 'multi_select') {
            let newFieldData = {
              name: fieldData.name,
              description: fieldData.name,
              values: fieldData.default,
            };
            if (Object.prototype.hasOwnProperty.call(fieldData, 'description')) {
              newFieldData = {
                ...newFieldData,
                description: fieldData.description,
              };
            }
            fieldList = {
              ...fieldList,
              [fieldName]: newFieldData,
            };
          } else {
            fieldList = {
              ...fieldList,
              [fieldName]: {
                name: fieldData.name,
              },
            };
          }
        }
      });
      // Get channels
      let channels = {};
      Object.keys(settings.channels).forEach((channelName) => {
        const channelData = settings.channels[channelName];
        channels = {
          ...channels,
          [channelName]: {
            label: channelData.label,
            value: channelName,
          },
        };
      });

      let tileList = [];
      if (Object.prototype.hasOwnProperty.call(settings, 'tiles')) {
        Object.keys(settings.tiles).forEach((tileName) => {
          let tileFields = [];
          Object.keys(settings.fields).forEach((fieldName) => {
            let fieldValue = settings.fields[fieldName];
            if (fieldName === 'members') {
              // <-- added this last condition as workaround to missing 'tile' prop in the 'members' field
              fieldValue = {
                ...fieldValue,
                tile: 'relationships',
              };
            }
            if (
              Object.prototype.hasOwnProperty.call(fieldValue, 'tile') &&
              fieldValue.tile === tileName
            ) {
              // Get only fields with hidden: false
              if (
                !Object.prototype.hasOwnProperty.call(fieldValue, 'hidden') ||
                (Object.prototype.hasOwnProperty.call(fieldValue, 'hidden') &&
                  fieldValue.hidden === false)
              ) {
                let newField = {
                  name: fieldName,
                  label: fieldValue.name,
                  type: fieldValue.type,
                };
                if (Object.prototype.hasOwnProperty.call(fieldValue, 'post_type')) {
                  newField = {
                    ...newField,
                    post_type: fieldValue.post_type,
                  };
                }
                if (Object.prototype.hasOwnProperty.call(fieldValue, 'default')) {
                  newField = {
                    ...newField,
                    default: fieldValue.default,
                  };
                }
                if (Object.prototype.hasOwnProperty.call(fieldValue, 'in_create_form')) {
                  newField = {
                    ...newField,
                    in_create_form: fieldValue.in_create_form,
                  };
                }
                if (Object.prototype.hasOwnProperty.call(fieldValue, 'required')) {
                  newField = {
                    ...newField,
                    required: fieldValue.required,
                  };
                }
                /*if (Object.prototype.hasOwnProperty.call(fieldValue, 'icon')) {
                  newField = {
                    ...newField,
                    icon: fieldValue.icon,
                  };
                }*/
                tileFields.push(newField);
              }
            }
          });
          let tileFieldsOrdered = [];
          if (settings.tiles[tileName].hasOwnProperty('order')) {
            const orderList = settings.tiles[tileName].order;
            let existingFields = [...orderList];
            let missingFields = [];
            tileFields.map((tileField, idx) => {
              const orderIdx = orderList.indexOf(tileField.name);
              if (orderIdx !== -1) {
                existingFields[orderIdx] = tileField;
              } else {
                missingFields.push(tileField);
              }
            });
            tileFieldsOrdered = [...existingFields, ...missingFields];
          } else {
            tileFieldsOrdered = [...tileFields];
          }
          // TODO: investigate why "location_grid_meta" was being added as string type
          tileFieldsOrdered = tileFieldsOrdered.filter((item) => typeof item === 'object');
          if (!settings.tiles[tileName].hidden) {
            tileList.push({
              name: tileName,
              label: settings.tiles[tileName].label,
              tile_priority: settings.tiles[tileName].tile_priority,
              fields: tileFieldsOrdered,
            });
          }
          tileList.sort((a, b) => a.tile_priority - b.tile_priority);
        });
      }
      return {
        ...newState,
        settings: {
          fields: fieldList,
          channels,
          labelPlural: settings.label_plural,
          tiles: tileList,
        },
        loading: false,
      };
    }
    case actions.GROUPS_GET_SETTINGS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_LOCATIONS_SEARCH_SUCCESS: {
      const { offline, filteredGeonames, queryText } = action;
      let foundGeonames = [],
        oldGeonames = [];
      if (offline) {
        // Get geonames by queryText
        oldGeonames = filteredGeonames;
        foundGeonames = oldGeonames.filter((oldGeoname) =>
          oldGeoname.name.toLowerCase().includes(queryText.toLowerCase()),
        );
      } else {
        // Get geonames by queryText
        /* eslint-disable */
        oldGeonames = newState.geonames;
        geonamesToAdd = [];
        /* eslint-enable */
        foundGeonames = filteredGeonames.map((geoname) => ({
          value: geoname.ID,
          name: geoname.name,
        }));
        // Add non persisted geonames to state
        geonamesToAdd = foundGeonames.filter(
          (foundGeoname) =>
            oldGeonames.find((oldGeoname) => oldGeoname.value == foundGeoname.value) === undefined,
        );
      }
      return {
        ...newState,
        foundGeonames,
        geonames: (geonamesToAdd
          ? [...oldGeonames, ...geonamesToAdd]
          : [...oldGeonames]
        ).sort((a, b) => a.value.localeCompare(b.value)),
        loading: false,
      };
    }
    case actions.GROUPS_LOCATIONS_SEARCH_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.GROUPS_LOCATIONS_MODIFIED_DATE_SUCCESS: {
      const { geonamesLastModifiedDate } = action;
      return {
        ...newState,
        geonamesLastModifiedDate,
      };
    }
    case actions.GROUPS_LOCATIONS_MODIFIED_DATE_FAILURE: {
      return {
        ...newState,
        error: action.error,
      };
    }
    case actions.GROUPS_DELETE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.GROUPS_DELETE_COMMENT_SUCCESS: {
      const { groupId, commentId } = action;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[groupId]) {
        previousComments = newState.comments[groupId].data;
        pagination = newState.comments[groupId].pagination;
      }
      // Search existent comment with ID (update comment)
      let foundCommentIndex = previousComments.findIndex(
        (previousComment) => previousComment.ID === commentId,
      );

      // Delete comment
      if (foundCommentIndex > -1) {
        previousComments.splice(foundCommentIndex, 1);
      }

      let newCommentState = {
        ...newState.comments,
        [groupId]: {
          data: [...previousComments],
          pagination,
        },
      };
      return {
        ...newState,
        comments: newCommentState,
        loadingComments: false,
      };
    }
    case actions.GROUPS_DELETE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.GROUPS_LOADING_FALSE:
      return {
        ...newState,
        loading: false,
      };
    case actions.GROUPS_UPDATE_PREVIOUS: {
      let { previousGroups } = action;
      return {
        ...newState,
        previousGroups,
      };
    }
    case actions.GROUPS_GET_SHARE_SETTINGS_START: {
      return {
        ...newState,
        loadingShare: true,
      };
    }
    case actions.GROUPS_GET_SHARE_SETTINGS_SUCCESS: {
      const { shareSettings, groupId, isConnected } = action;

      let mappedUsers = [];

      if (isConnected) {
        mappedUsers = shareSettings.map((user) => {
          return {
            name: user.display_name,
            value: parseInt(user.user_id),
          };
        });
      } else {
        mappedUsers = [...shareSettings];
      }

      let newShareSettings = {
        ...newState.shareSettings,
        [groupId]: mappedUsers,
      };

      return {
        ...newState,
        shareSettings: newShareSettings,
        loadingShare: false,
      };
    }
    case actions.GROUPS_GET_SHARE_SETTINGS_FAILURE: {
      return {
        ...newState,
        error: action.error,
        loadingShare: false,
      };
    }
    case actions.GROUPS_ADD_USER_SHARE_START: {
      return {
        ...newState,
        loadingShare: true,
      };
    }
    case actions.GROUPS_ADD_USER_SHARE_SUCCESS: {
      const { userData, groupId } = action;

      // Check previous records existence;
      let newSharedUsers = [];
      if (newState.shareSettings[groupId]) {
        newSharedUsers = newState.shareSettings[groupId];
      }

      // Only add new values
      if (!newSharedUsers.find((user) => user.value === userData.value)) {
        newSharedUsers.push(userData);
      }

      let newShareSettings = {
        ...newState.shareSettings,
        [groupId]: newSharedUsers,
      };

      return {
        ...newState,
        shareSettings: newShareSettings,
        savedShare: true,
        loadingShare: false,
      };
    }
    case actions.GROUPS_ADD_USER_SHARE_FAILURE: {
      return {
        ...newState,
        error: action.error,
        loadingShare: false,
      };
    }
    case actions.GROUPS_REMOVE_SHARED_USER_START: {
      return {
        ...newState,
        loadingShare: true,
      };
    }
    case actions.GROUPS_REMOVE_SHARED_USER_SUCCESS: {
      const { userData, groupId } = action;

      let newSharedUsers = [...newState.shareSettings[groupId]];

      let index = newSharedUsers.findIndex((user) => user.value === userData.value);

      // Only remove value if its found
      if (index > 0) {
        newSharedUsers.splice(index, 1);
      }

      let newShareSettings = {
        ...newState.shareSettings,
        [groupId]: newSharedUsers,
      };

      return {
        ...newState,
        shareSettings: newShareSettings,
        savedShare: true,
        loadingShare: false,
      };
    }
    case actions.GROUPS_REMOVE_SHARED_USER_FAILURE: {
      return {
        ...newState,
        error: action.error,
        loadingShare: false,
      };
    }
    default:
      return newState;
  }
}
