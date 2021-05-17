import * as actions from '../actions/contacts.actions';
import * as userActions from '../actions/user.actions';
import { Html5Entities } from 'html-entities';
import { REHYDRATE } from 'redux-persist/lib/constants';
import utils from 'utils';

const initialState = {
  loading: false,
  error: null,
  contacts: [],
  contact: null,
  comments: {},
  newComment: false,
  activities: {},
  loadingComments: false,
  loadingActivities: false,
  saved: false,
  settings: null,
  offset: 0,
  previousContacts: [],
  loadingShare: false,
  shareSettings: {},
  savedShare: false,
  tags: [],
  total: 0,
  filteredContacts: [],
};

export default function contactsReducer(state = initialState, action) {
  let newState = {
    ...state,
    newComment: false,
    error: null,
    saved: false,
    savedShare: false,
  };

  const entities = new Html5Entities();
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...newState,
        loading: false,
        filteredContacts: [],
      };
    }
    case actions.CONTACTS_GETALL_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GETALL_SUCCESS: {
      let { contacts, filter, total, offline } = action;
      // Add previously persisted contacts
      let currentContacts = newState.contacts ? [...newState.contacts] : [];
      let filteredContacts = newState.filteredContacts ? [...newState.filteredContacts] : [];
      let newTotal = total ? total : newState.total;
      let newPersistedContacts = [];
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
              filteredContacts = utils.contactsByFilter([...currentContacts], newFilter);
            } else {
              filteredContacts = [...currentContacts];
            }
          } else if (newFilter.filterText) {
            delete newFilter.filterText;
            filteredContacts = currentContacts.filter((item) => {
              let filterByPhone = false;
              let filterByEmail = false;
              const textData = newFilter.name
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              const itemDataTitle = item.title
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              const filterByTitle = itemDataTitle.includes(textData);

              if (item.contact_phone !== undefined) {
                item.contact_phone.forEach((elements) => {
                  const itemDataPhone = elements.value.toUpperCase();
                  if (filterByPhone === false) {
                    filterByPhone = itemDataPhone.includes(textData);
                  }
                });
              }

              if (item.contact_email !== undefined) {
                item.contact_email.forEach((elements) => {
                  const itemDataEmail = elements.value.toUpperCase();
                  if (filterByEmail === false) {
                    filterByEmail = itemDataEmail.includes(textData);
                  }
                });
              }
              return filterByTitle || filterByPhone || filterByEmail;
            });
          }
        } else {
          filteredContacts = [];
        }
        newPersistedContacts = [...currentContacts];
      } else {
        // Online
        let mappedContacts = utils.mapContacts(contacts, entities);
        let persistedContacts = currentContacts.filter((currentContact) =>
          utils.isNumeric(currentContact.ID),
        );
        // Filter
        if (filter.filtered) {
          // Pagination
          if (filter.offset > 0) {
            let merge = utils.mergeContactList(mappedContacts, persistedContacts);
            newPersistedContacts = [...merge.persistedContacts, ...merge.newContacts];
            filteredContacts = [...filteredContacts, ...merge.newContacts];
          } else {
            filteredContacts = [...mappedContacts];
          }
        } else {
          // Pagination
          if (filter.offset > 0) {
            let merge = utils.mergeContactList(mappedContacts, persistedContacts);
            newPersistedContacts = [...merge.persistedContacts, ...merge.newContacts];
          } else {
            newPersistedContacts = [...mappedContacts];
          }
          filteredContacts = [];
        }
      }

      return {
        ...newState,
        contacts: newPersistedContacts,
        total: newTotal,
        filteredContacts,
        loading: false,
      };
    }
    case actions.CONTACTS_GETALL_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_SAVE_SUCCESS: {
      const { contact, offline } = action;
      let mappedContact = {};
      if (offline) {
        mappedContact = {
          ...contact,
        };
      } else {
        mappedContact = utils.mapContact(contact, entities);
      }
      const oldId = mappedContact.oldID ? mappedContact.oldID : null;
      newState = {
        ...newState,
        contact: mappedContact,
        saved: true,
      };
      const contactIndex = newState.contacts.findIndex(
        (contactItem) => contactItem.ID.toString() === contact.ID.toString(),
      );
      // Search entity in list (contacts) if exists: updated it, otherwise: added it to contacts list
      if (contactIndex > -1) {
        // Merge all data of request with found entity
        let newContactData;
        if (offline) {
          // Editing D.B. entity in OFFLINE mode
          newContactData = {
            ...newState.contacts[contactIndex],
          };
          // Apply modifications from request (mappedContact) in newContactData
          Object.keys(mappedContact).forEach((key) => {
            const value = mappedContact[key];
            const valueType = Object.prototype.toString.call(value);
            if (
              valueType === '[object Array]' ||
              Object.prototype.hasOwnProperty.call(value, 'values')
            ) {
              let collection;
              let oldCollection;
              if (valueType === '[object Array]') {
                collection = value;
                oldCollection = newContactData[key] ? [...newContactData[key]] : [];
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                collection = value.values;
                oldCollection = newContactData[key] ? [...newContactData[key].values] : [];
              }
              // compare newCollection with old and merge differences.
              collection.forEach((object) => {
                // search object in newContactData
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
                newContactData = {
                  ...newContactData,
                  [key]: oldCollection,
                };
              } else if (Object.prototype.hasOwnProperty.call(value, 'values')) {
                newContactData = {
                  ...newContactData,
                  [key]: {
                    values: oldCollection,
                  },
                };
              }
            } else {
              newContactData = {
                ...newContactData,
                [key]: value,
              };
            }
          });
        } else {
          newContactData = {
            ...newState.contacts[contactIndex],
            ...newState.contact,
          };
        }
        newState.contacts[contactIndex] = {
          ...newContactData,
        };
        if (offline) {
          // Return all contact data in response
          newState = {
            ...newState,
            contact: {
              ...newContactData,
            },
          };
        }
      } else if (oldId) {
        // Search entity with oldID, remove it and add updated entity
        const oldContactIndex = newState.contacts.findIndex(
          (contactItem) => contactItem.ID.toString() === oldId,
        );
        const previousContactData = {
          ...newState.contacts[oldContactIndex],
        };
        const newContactData = {
          ...previousContactData,
          ...newState.contact,
        };
        newState.contacts.splice(oldContactIndex, 1).unshift(newContactData);
        if (offline) {
          // Return all contact data in response
          newState = {
            ...newState,
            contact: {
              ...newContactData,
            },
          };
        }
      } else {
        // Create
        newState.contacts.unshift({
          ...newState.contact,
        });
      }
      return {
        ...newState,
        loading: false,
      };
    }
    case actions.CONTACTS_SAVE_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_GETBYID_START:
      return {
        ...newState,
        contact: null,
        loading: true,
      };
    case actions.CONTACTS_GETBYID_SUCCESS: {
      let contact = { ...action.contact };
      if (isNaN(contact.ID) || contact.isOffline) {
        // Search local contact
        const foundContact = newState.contacts.find(
          (contactItem) => contactItem.ID.toString() === contact.ID,
        );
        // Fix to error when App try to get detail of non existing contact (browsing between several contacts) in OFFLINE mode
        if (foundContact) {
          contact = {
            ...foundContact,
          };
        }
      } else {
        contact = utils.mapContact(contact, entities);
        // Update localContact with dbContact
        const contactIndex = newState.contacts.findIndex(
          (contactItem) => contactItem.ID.toString() === contact.ID,
        );
        if (contactIndex > -1) {
          newState.contacts[contactIndex] = {
            ...contact,
          };
        } else {
          // Add retrieved contact to contacts array (persist to OFFLINE mode)
          newState.contacts.unshift(contact);
        }
      }
      newState = {
        ...newState,
        contact,
        loading: false,
      };
      return newState;
    }
    case actions.CONTACTS_GETBYID_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.CONTACTS_GETBYID_END:
      return {
        ...newState,
        contact: null,
      };
    case actions.CONTACTS_GET_COMMENTS_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.CONTACTS_GET_COMMENTS_SUCCESS: {
      const { comments, contactId, pagination } = action;

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
      if (pagination.offset > 0 && newState.comments[contactId]) {
        previousComments = newState.comments[contactId].data;
      }

      let newCommentState = {
        ...newState.comments,
        [contactId]: {
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
    case actions.CONTACTS_GET_COMMENTS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.CONTACTS_SAVE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.CONTACTS_SAVE_COMMENT_SUCCESS: {
      const { comment, contactId, offline } = action;
      let newComment;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[contactId]) {
        previousComments = newState.comments[contactId].data;
        pagination = newState.comments[contactId].pagination;
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
          [contactId]: {
            data: [...previousComments],
            pagination,
          },
        };
      } else {
        // Add new comment
        newCommentState = {
          ...newState.comments,
          [contactId]: {
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
    case actions.CONTACTS_SAVE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.CONTACTS_GET_ACTIVITIES_START:
      return {
        ...newState,
        loadingActivities: true,
      };
    case actions.CONTACTS_GET_ACTIVITIES_SUCCESS: {
      const { activities, contactId, pagination } = action;

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
      if (pagination.offset > 0 && newState.activities[contactId]) {
        previousActivities = newState.activities[contactId].data;
      }

      let newActivityState = {
        ...newState.activities,
        [contactId]: {
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
    case actions.CONTACTS_GET_ACTIVITIES_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingActivities: false,
      };
    case actions.CONTACTS_GET_SETTINGS_SUCCESS: {
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
    case actions.CONTACTS_GET_SETTINGS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case userActions.USER_LOGOUT:
      return {
        ...newState,
        settings: null,
        contacts: [],
      };
    case actions.CONTACTS_DELETE_COMMENT_START:
      return {
        ...newState,
        loadingComments: true,
      };
    case actions.CONTACTS_DELETE_COMMENT_SUCCESS: {
      const { contactId, commentId } = action;

      // Check previous records/pagination existence and return it
      let previousComments = [],
        pagination = {
          limit: 10,
          offset: 0,
          total: 0,
        };
      if (newState.comments[contactId]) {
        previousComments = newState.comments[contactId].data;
        pagination = newState.comments[contactId].pagination;
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
        [contactId]: {
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
    case actions.CONTACTS_DELETE_COMMENT_FAILURE:
      return {
        ...newState,
        error: action.error,
        loadingComments: false,
      };
    case actions.CONTACTS_LOADING_FALSE:
      return {
        ...newState,
        loading: false,
      };
    case actions.CONTACTS_UPDATE_PREVIOUS: {
      let { previousContacts } = action;
      return {
        ...newState,
        previousContacts,
      };
    }
    case actions.CONTACTS_GET_SHARE_SETTINGS_START: {
      return {
        ...newState,
        loadingShare: true,
      };
    }
    case actions.CONTACTS_GET_SHARE_SETTINGS_SUCCESS: {
      const { shareSettings, contactId, isConnected } = action;

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
        [contactId]: mappedUsers,
      };

      return {
        ...newState,
        shareSettings: newShareSettings,
        loadingShare: false,
      };
    }
    case actions.CONTACTS_GET_SHARE_SETTINGS_FAILURE: {
      return {
        ...newState,
        error: action.error,
        loadingShare: false,
      };
    }
    case actions.CONTACTS_ADD_USER_SHARE_START: {
      return {
        ...newState,
        loadingShare: true,
      };
    }
    case actions.CONTACTS_ADD_USER_SHARE_SUCCESS: {
      const { userData, contactId } = action;

      // Check previous records existence;
      let newSharedUsers = [];
      if (newState.shareSettings[contactId]) {
        newSharedUsers = newState.shareSettings[contactId];
      }

      // Only add new values
      if (!newSharedUsers.find((user) => user.value === userData.value)) {
        newSharedUsers.push(userData);
      }

      let newShareSettings = {
        ...newState.shareSettings,
        [contactId]: newSharedUsers,
      };

      return {
        ...newState,
        shareSettings: newShareSettings,
        savedShare: true,
        loadingShare: false,
      };
    }
    case actions.CONTACTS_ADD_USER_SHARE_FAILURE: {
      return {
        ...newState,
        error: action.error,
        loadingShare: false,
      };
    }
    case actions.CONTACTS_REMOVE_SHARED_USER_START: {
      return {
        ...newState,
        loadingShare: true,
      };
    }
    case actions.CONTACTS_REMOVE_SHARED_USER_SUCCESS: {
      const { userData, contactId } = action;

      let newSharedUsers = [...newState.shareSettings[contactId]];

      let index = newSharedUsers.findIndex((user) => user.value === userData.value);

      // Only remove value if its found
      if (index > 0) {
        newSharedUsers.splice(index, 1);
      }

      let newShareSettings = {
        ...newState.shareSettings,
        [contactId]: newSharedUsers,
      };

      return {
        ...newState,
        shareSettings: newShareSettings,
        savedShare: true,
        loadingShare: false,
      };
    }
    case actions.CONTACTS_REMOVE_SHARED_USER_FAILURE: {
      return {
        ...newState,
        error: action.error,
        loadingShare: false,
      };
    }
    case actions.CONTACTS_GET_TAGS_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.CONTACTS_GET_TAGS_SUCCESS:
      return {
        ...newState,
        tags: action.tags,
        loading: false,
      };
    case actions.CONTACTS_GET_TAGS_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    default:
      return newState;
  }
}
