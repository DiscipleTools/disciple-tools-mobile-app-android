import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  Keyboard,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
  Platform,
  TouchableHighlight,
  Linking,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import PropTypes from 'prop-types';

// Redux
import { useSelector } from 'react-redux';

// Component Library (Native Base)
import { Label, Input, Icon, Picker, DatePicker, Textarea, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// Expo
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';

// 3rd-party Components
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Chip, Selectize } from 'react-native-material-selectize';
import { TabView, TabBar } from 'react-native-tab-view';
import MentionsTextInput from 'react-native-mentions';
import ParsedText from 'react-native-parsed-text';
// TODO
//import * as Sentry from 'sentry-expo';
import { CheckBox } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// Custom Hooks
import useNetworkStatus from 'hooks/useNetworkStatus';
import usePostType from 'hooks/usePostType.js';
import useId from 'hooks/useId.js';
import useDetails from 'hooks/useDetails.js';
import useSettings from 'hooks/useSettings.js';
import useMyUser from 'hooks/useMyUser.js';

// Custom Components
import FAB from 'components/FAB';
import Tile from 'components/Tile';
import ActionModal from 'components/ActionModal';
import OfflineBar from 'components/OfflineBar';
import HeaderLeft from 'components/HeaderLeft';
import HeaderRight from 'components/HeaderRight';
import KebabMenu from 'components/KebabMenu';

import i18n from 'languages';
import { isIOS, renderCreationFields, showToast } from 'helpers';
import utils from 'utils';

import Colors from 'constants/Colors';
import { dtIcon } from 'constants/Icons';

import { styles } from './DetailsScreen.styles';

const initialState = {
  record: {},
  unmodifiedContact: {},
  users: [],
  usersContacts: [],
  groups: [],
  peopleGroups: [],
  geonames: [],
  loadedLocal: false,
  comments: {
    data: [],
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
    },
  },
  loadComments: false,
  loadingMoreComments: false,
  activities: {
    data: [],
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
    },
  },
  loadActivities: false,
  loadingMoreActivities: false,
  comment: '',
  overallStatusBackgroundColor: '#ffffff',
  loading: false,
  foundGeonames: [],
  footerLocation: 0,
  footerHeight: 0,
  nameRequired: false,
  executingBack: false,
  keyword: '',
  suggestedUsers: [],
  height: utils.commentFieldMinHeight,
  sources: [],
  nonExistingSources: [],
  unmodifiedSources: [],
  subAssignedContacts: [],
  unmodifiedSubAssignedContacts: [],
  relationContacts: [],
  unmodifiedRelationContacts: [],
  baptizedByContacts: [],
  unmodifiedBaptizedByContacts: [],
  baptizedContacts: [],
  unmodifiedBaptizedContacts: [],
  coachedByContacts: [],
  unmodifiedCoachedByContacts: [],
  coachedContacts: [],
  unmodifiedCoachedContacts: [],
  connectionGroups: [],
  unmodifiedConnectionGroups: [],
  assignedToContacts: [],
  unmodifedAssignedToContacts: [],
  commentDialog: {
    toggle: false,
    data: {},
    delete: false,
  },
  showFilterView: false,
  filtersSettings: {
    showComments: true,
    showActivities: true,
  },
  showShareView: false,
  sharedUsers: [],
  showReasonStatusView: false,
  selectedReasonStatus: {
    key: null,
    value: null,
  },
};

const DetailsScreen = ({ navigation, route }) => {
  console.log('*** DETAILS ***');

  console.log(JSON.stringify(route));

  const layout = useWindowDimensions();
  const windowWidth = layout.width;
  const milestonesGridSize = windowWidth + 5;
  const windowHeight = layout.height;

  const kebabMenuRef = useRef();

  const isConnected = useNetworkStatus();

  const { isContact, isGroup, postType } = usePostType();

  const id = useId();
  const { post, error: postError, mutate } = useDetails(id);
  const { settings, error: settingsError } = useSettings();
  const { userData, error: userError } = useMyUser();

  const mapTabRoutes = () => {
    if (!settings?.tiles) return [];
    return [
      ...settings.tiles.map((tile) => {
        return {
          key: tile.name,
          title: tile.label,
        };
      }),
      {
        key: 'comments',
        title: i18n.t('global.commentsActivity'),
      },
    ];
  };

  const routes = mapTabRoutes(settings);
  // TODO: default to 0
  const [index, setIndex] = React.useState(1);
  /*
  const [tabRoutes, setTabRoutes] = useState({
    index: 0,
    routes,
  });
  */
  /*
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);
  */

  const editing = useSelector((state) => state.appReducer.editing);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  // TODO: replace with hooks
  //const userData = useSelector((state) => state.userReducer.userData);
  const comments = {};
  //const comments = useSelector((state) => state.contactsReducer.comments);
  const totalComments = 0;
  //const totalComments = useSelector((state) => state.contactsReducer.totalComments);
  const loadingComments = false;
  //const loadingComments = useSelector((state) => state.contactsReducer.loadingComments);
  const activities = {};
  //const activities = useSelector((state) => state.contactsReducer.activities);
  const totalActivities = 0;
  //const totalActivities = useSelector((state) => state.contactsReducer.totalActivities);
  const loadingActivities = false;
  //const loadingActivities = useSelector((state) => state.contactsReducer.loadingActivities);
  const newComment = false;
  //const newComment = useSelector((state) => state.contactsReducer.newComment);
  const saved = false;
  //const saved = useSelector((state) => state.contactsReducer.saved);
  //const contactSettings = useSelector((state) => state.contactsReducer.settings);
  const contactSettings = { ...settings };
  const foundGeonames = [];
  //const foundGeonames = useSelector((state) => state.groupsReducer.foundGeonames);
  const groupsList = [];
  //const groupsList = useSelector((state) => state.groupsReducer.groups);
  const contactsList = [];
  //const contactsList = useSelector((state) => state.contactsReducer.contacts);
  const questionnaires = [];
  //const questionnaires = useSelector((state) => state.questionnaireReducer.questionnaires);
  const previousContacts = [];
  //const previousContacts = useSelector((state) => state.contactsReducer.previousContacts);
  const previousGroups = [];
  //const previousGroups = useSelector((state) => state.groupsReducer.previousGroups);
  const loadingShare = false;
  //const loadingShare = useSelector((state) => state.contactsReducer.loadingShare);
  const shareSettings = {};
  //const shareSettings = useSelector((state) => state.contactsReducer.shareSettings);
  const savedShare = false;
  //const savedShare = useSelector((state) => state.contactsReducer.savedShare);
  const tags = [];
  //const tags = useSelector((state) => state.contactsReducer.tags);

  let keyboardDidShowListener, keyboardDidHideListener, focusListener, hardwareBackPressListener;

  const [state, setState] = useState(initialState);

  const filters = {};
  //let filters = useSelector((state) => state.usersReducer.contactFilters);
  // TODO:
  let totalRecords = 20;
  let filteredRecords = null;

  /*
  // focus effect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // something onFocus
    });
    return unsubscribe;
  }, [navigation]);
  */

  const kebabMenuItems = [
    {
      label: i18n.t('global.share'),
      callback: () => toggleShareView(),
    },
    {
      label: i18n.t('global.viewOnMobileWeb'),
      callback: () => {
        const domain = userData?.domain;
        const id = post?.ID;
        if (domain && id) {
          Linking.openURL(`https://${domain}/${postType}/${id}/`);
        } else {
          showToast(i18n.t('global.error.recordData'), true);
        }
      },
    },
  ];

  useLayoutEffect(() => {
    // TODO: helper to get either Group or Contact Name
    const title = route.params?.name ?? i18n.t('contactDetailScreen.addNewContact');
    navigation.setOptions({
      title,
      headerLeft: (props) => <HeaderLeft {...props} onPress={() => navigation.goBack()} />,
      headerRight: (props) => (
        <HeaderRight
          menu=<KebabMenu menuRef={kebabMenuRef} menuItems={kebabMenuItems} />
          menuRef={kebabMenuRef}
          {...props}
          onPress={() => {
            console.log('*** HEADER RIGHT WAS PRESSED ***');
            //onEnableEdit();
            //saveContact();
          }}
        />
      ),
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: Colors.headerTintColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        width: Platform.select({
          android: 180,
          ios: 140,
        }),
        marginLeft: editing ? null : 25,
      },
    });
  }, [navigation]);

  // componentDidMount
  useEffect(() => {
    /* TODO:
    onLoad();
    // Add afterBack param to execute 'parents' functions (ContactsView, NotificationsView)
    if (!navigation.state.params.afterBack) {
      params = {
        ...params,
        afterBack: afterBack.bind(this),
      };
    }
    navigation.setParams(params);
    */
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    navigation.addListener('didFocus', () => {
      //Focus on 'detail mode' (going back or open detail view)
      console.log('*** DID FOCUS ***');
      /* TODO
      if (contactIsCreated()) {
        dispatch(loadingFalse());
        onRefresh(navigation.state.params.contactId, true);
      }
      */
    });
    // Android hardware back press listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('*** ANDROID HARDWARE BACK PRESS ***');
      // TODO
      //navigation.state.params.backButtonTap();
      //return true;
    });
    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
      navigation.removeListener('didFocus');
      backHandler.remove();
    };
  }, []);

  /*
  // componentDidUpdate
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      // TODO
      console.log('*** COMPONENT DID UPDATE ***');
    } else didMountRef.current = true;
  });
  */

  /*
  return(
    <ScrollView>
      <Text style={{ fontWeight: 'bold', color: 'blue' }}>{ JSON.stringify(post) }</Text>
      <Text>{ JSON.stringify(settings) }</Text>
    </ScrollView>
  );
  */

  // TODO: ?? delete or merge with Group
  const contactIsCreated = () => {
    return Object.prototype.hasOwnProperty.call(navigation.state.params, 'contactId');
  };

  // TODO: ?? delete or merge with Group
  const onLoad = () => {
    // TODO: id, name, route.params
    const { onlyView, contactId, contactName, importContact } = navigation.state.params;
    let newState = {};
    if (importContact) {
      newState = {
        contact: {
          name: importContact.title,
          sources: {
            values: [
              {
                value: 'personal',
              },
            ],
          },
          seeker_path: 'none',
          contact_phone: importContact.contact_phone,
          contact_email: importContact.contact_email,
        },
      };
      navigation.setParams({
        hideTabBar: true,
      });
    } else if (contactIsCreated()) {
      newState = {
        contact: {
          ID: contactId,
          name: contactName,
          sources: {
            values: [
              {
                value: 'personal',
              },
            ],
          },
          seeker_path: 'none',
        },
      };
      navigation.setParams({
        contactName,
      });
    } else {
      newState = {
        contact: {
          name: null,
          sources: {
            values: [
              {
                value: 'personal',
              },
            ],
          },
          seeker_path: 'none',
        },
      };
      navigation.setParams({
        hideTabBar: true,
      });
    }
    if (onlyView) {
      newState = {
        ...newState,
        onlyView,
      };
    }
    setState(newState, () => {
      getLists();
    });
  };

  // OK, move to helpers?
  const keyboardDidShow = (event) => {
    setState({
      ...state,
      footerLocation: isIOS ? event.endCoordinates.height : 0,
    });
  };

  // OK, move to helpers?
  const keyboardDidHide = (event) => {
    setState({
      ...state,
      footerLocation: 0,
    });
  };

  // TODO: merge with Group and move to helpers
  const backButtonTap = () => {
    let { params } = navigation.state;
    if (params.hideTabBar) {
      setState(
        {
          ...state,
          executingBack: true,
        },
        () => {
          navigation.setParams({
            hideTabBar: false,
          });
        },
      );
    } else {
      //Fix to returning using Android back button! -> goBack(null)
      navigation.goBack(null);
      navigation.state.params.afterBack();
    }
  };

  // TODO: specific to Contact or merge with Group and move to helpers?
  const afterBack = () => {
    let newPreviousContacts = [...previousContacts];
    newPreviousContacts.pop();
    //dispatch(updatePrevious(newPreviousContacts));
    if (newPreviousContacts.length > 0) {
      //dispatch(loadingFalse());
      let currentParams = {
        ...newPreviousContacts[newPreviousContacts.length - 1],
      };
      setState({
        ...state,
        contact: {
          ID: currentParams.contactId,
          name: currentParams.contactName,
          sources: {
            values: [
              {
                value: 'personal',
              },
            ],
          },
          seeker_path: 'none',
        },
        overallStatusBackgroundColor: '#ffffff',
      });
      navigation.setParams({
        ...currentParams,
      });
      onRefresh(currentParams.contactId, true);
    } else if (navigation.state.params.fromNotificationView) {
      /* TODO:
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'ContactList' })],
      });
      */
      //navigation.dispatch(resetAction);
      navigation.navigate('NotificationList');
    } else {
      // Prevent error when view loaded from GroupDetailScreen.js
      if (typeof navigation.state.params.onGoBack === 'function') {
        navigation.state.params.onGoBack();
      }
    }
  };

  // TODO: leave this specific to each Module?
  const onRefresh = (zzcontactId, forceRefresh = false) => {
    //const onRefresh = (contactId, forceRefresh = false) => {
    if (!state.loading || forceRefresh) {
      const contactId = route?.params?.contactId ?? null;
      console.log(`**** CONTACT ID: ${contactId} ****`);
      //dispatch(getById(contactId));
      onRefreshCommentsActivities(contactId, true);
      //dispatch(getShareSettings(contactId));
      if (state.showShareView) {
        toggleShareView();
      }
    }
  };

  // TODO: move to helpers (GroupDetails needs it also)
  const getLists = async () => {
    let newState = {};
    const users = await ExpoFileSystemStorage.getItem('usersList');
    if (users !== null) {
      newState = {
        ...newState,
        users: JSON.parse(users).map((user) => {
          let newUser = {
            key: user.ID,
            label: user.name,
          };
          // Prevent 'null' values
          if (
            Object.prototype.hasOwnProperty.call(user, 'contact_id') &&
            utils.isNumeric(user.contact_id)
          ) {
            newUser = {
              ...newUser,
              contactID: parseInt(user.contact_id),
            };
          }
          return newUser;
        }),
      };
    }

    const peopleGroups = await ExpoFileSystemStorage.getItem('peopleGroupsList');
    if (peopleGroups !== null) {
      newState = {
        ...newState,
        peopleGroups: JSON.parse(peopleGroups),
      };
    }

    const geonames = await ExpoFileSystemStorage.getItem('locationsList');
    if (geonames !== null) {
      newState = {
        ...newState,
        geonames: JSON.parse(geonames),
      };
    }

    let sourcesList = Object.keys(contactSettings.fields.sources.values).map((key) => ({
      name: contactSettings.fields.sources.values[key].label,
      value: key,
    }));

    const mappedContacts = contactsList.map((contact) => {
      return {
        name: contact.title,
        value: contact.ID,
        avatarUri: null,
      };
    });
    const mappedUsers = JSON.parse(users).map((user) => {
      return {
        name: user.name,
        value: String(user.contact_id),
        avatarUri: user.avatar,
      };
    });
    newState = {
      ...newState,
      usersContacts: [...mappedContacts, ...mappedUsers],
      groups: groupsList.map((group) => ({
        name: group.title,
        value: group.ID,
      })),
      loadedLocal: true,
      sources: [...sourcesList],
      unmodifiedSources: [...sourcesList],
    };

    setState(newState, () => {
      // Only execute in detail mode
      if (contactIsCreated()) {
        onRefresh(state.record.ID);
      }
    });
  };

  // TODO: move to helpers?
  const onRefreshCommentsActivities = (contactId, resetPagination = false) => {
    getContactComments(contactId, resetPagination);
    getContactActivities(contactId, resetPagination);
  };

  // TODO: move to helpers?
  const getContactComments = (contactId, resetPagination = false) => {
    if (isConnected) {
      if (resetPagination) {
        /*
        dispatch(
          getCommentsByContact(contactId, {
            offset: 0,
            limit: 10,
          }),
        );
        */
      } else {
        //ONLY GET DATA IF THERE IS MORE DATA TO GET
        if (
          !state.loadComments &&
          state.comments.pagination.offset < state.comments.pagination.total
        ) {
          //dispatch(getCommentsByContact(contactId, state.comments.pagination));
        }
      }
    }
  };

  // TODO: move to helpers?
  const getContactActivities = (contactId, resetPagination = false) => {
    if (isConnected) {
      if (resetPagination) {
        /*
        dispatch(
          getActivitiesByContact(contactId, {
            offset: 0,
            limit: 10,
          }),
        );
        */
      } else {
        //ONLY GET DATA IF THERE IS MORE DATA TO GET
        if (
          !state.loadActivities &&
          state.activities.pagination.offset < state.activities.pagination.total
        ) {
          //dispatch(getActivitiesByContact(contactId, state.activities.pagination));
        }
      }
    }
  };

  // TODO: move to helpers
  const onEnableEdit = () => {
    setState((prevState) => {
      let indexFix = prevState.tabRoutes.index;
      // Last tab (comments/activities)
      if (prevState.tabRoutes.index === prevState.tabRoutes.routes.length - 1) {
        indexFix = indexFix - 1; // -1 for commentsTab
      }
      return {
        ...state,
        onlyView: false,
        tabRoutes: {
          ...prevState.tabRoutes,
          index: indexFix,
          routes: mapTabRoutes(settings).filter(
            (route) => route.key !== 'comments', // && route.key !== 'other',
          ),
        },
      };
    });
    navigation.setParams({
      hideTabBar: true,
      onlyView: false,
      contactName: state.record.name,
    });
  };

  // TODO: move to helpers
  const onDisableEdit = () => {
    const {
      unmodifiedContact,
      unmodifiedSources,
      unmodifiedSubAssignedContacts,
      unmodifiedRelationContacts,
      unmodifiedBaptizedByContacts,
      unmodifiedBaptizedContacts,
      unmodifiedCoachedByContacts,
      unmodifiedCoachedContacts,
      unmodifiedConnectionGroups,
      unmodifedAssignedToContacts,
      unmodifiedSelectedReasonStatus,
    } = state;
    setState((prevState) => {
      // Set correct index in Tab position according to view mode and current tab position
      let indexFix = prevState.tabRoutes.index;
      let newState = {
        onlyView: true,
        contact: {
          ...unmodifiedContact,
        },
        overallStatusBackgroundColor: utils.getSelectorColor(unmodifiedContact.overall_status),
        tabRoutes: {
          ...prevState.tabRoutes,
          index: indexFix,
          routes: mapTabRoutes(settings),
        },
        sources: [...unmodifiedSources],
        subAssignedContacts: [...unmodifiedSubAssignedContacts],
        relationContacts: [...unmodifiedRelationContacts],
        baptizedByContacts: [...unmodifiedBaptizedByContacts],
        baptizedContacts: [...unmodifiedBaptizedContacts],
        coachedByContacts: [...unmodifiedCoachedByContacts],
        coachedContacts: [...unmodifiedCoachedContacts],
        connectionGroups: [...unmodifiedConnectionGroups],
        assignedToContacts: [...unmodifedAssignedToContacts],
      };

      let contactReasonStatusKey = `reason_${unmodifiedContact.overall_status}`;
      let contactHasStatusReason = Object.prototype.hasOwnProperty.call(
        unmodifiedContact,
        contactReasonStatusKey,
      );
      // CONTACT HAS STATUS WITH REASON
      if (contactHasStatusReason) {
        newState = {
          ...newState,
          selectedReasonStatus: unmodifiedSelectedReasonStatus,
        };
      } else {
        newState = {
          ...newState,
          selectedReasonStatus: {
            key: null,
            value: null,
          },
        };
      }
      return {
        ...state,
        newState,
      };
    });
    navigation.setParams({ hideTabBar: false, onlyView: true });
  };

  // TODO: merge with 'setGroupStatus'? and move to helpers? bc Field and FieldValue
  const setContactStatus = (value) => {
    let contactHaveReason = Object.prototype.hasOwnProperty.call(
      contactSettings.fields,
      `reason_${value}`,
    );
    setState((prevState) => {
      let newState = {
        ...state,
        contact: {
          ...prevState.record,
          overall_status: value,
        },
        overallStatusBackgroundColor: utils.getSelectorColor(value),
        showReasonStatusView: contactHaveReason,
      };

      if (contactHaveReason) {
        // SET FIRST REASON STATUS AS DEFAULT SELECTED OPTION
        let reasonValues = Object.keys(contactSettings.fields[`reason_${value}`].values);
        newState = {
          ...newState,
          selectedReasonStatus: {
            key: `reason_${value}`,
            value: reasonValues[0],
          },
        };
      }

      return newState;
    });
  };

  // TODO: move or leave bc it is pretty specific to Contact?
  const onSaveContact = (quickAction = {}) => {
    setState(
      {
        ...state,
        nameRequired: false,
      },
      () => {
        Keyboard.dismiss();
        if (state.record.name && state.record.name.length > 0) {
          const { unmodifiedContact } = state;
          let contactToSave = {
            ...state.record,
          };
          if (
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_no_answer') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_contact_established') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_scheduled') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_complete') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_no_show')
          ) {
            contactToSave = {
              ...contactToSave,
              ...quickAction,
            };
          }
          contactToSave = {
            ...utils.diff(unmodifiedContact, contactToSave),
            name: state.record.name,
          };
          // Do not save fields with empty values
          Object.keys(contactToSave)
            .filter(
              (key) =>
                key.includes('contact_') &&
                Object.prototype.toString.call(contactToSave[key]) === '[object Array]' &&
                contactToSave[key].length > 0,
            )
            .forEach((key) => {
              contactToSave = {
                ...contactToSave,
                [key]: contactToSave[key].filter(
                  (socialMedia) =>
                    socialMedia.delete || (!socialMedia.delete && socialMedia.value.length > 0),
                ),
              };
            });
          // Remove empty arrays
          Object.keys(contactToSave).forEach((key) => {
            const value = contactToSave[key];
            if (
              Object.prototype.hasOwnProperty.call(value, 'values') &&
              value.values.length === 0
            ) {
              delete contactToSave[key];
            }
          });
          //After 'utils.diff()' method, ID is removed, then we add it again
          if (Object.prototype.hasOwnProperty.call(state.record, 'ID')) {
            contactToSave = {
              ...contactToSave,
              ID: state.record.ID,
            };
          }
          if (contactToSave.assigned_to) {
            // TODO: is a (hopefully temprorary workaround)
            // ref: 'setContactCustomFieldValue' method AND "case 'user_select':" Ln#4273
            const assignedTo = contactToSave.assigned_to;
            const assignedToID = assignedTo.hasOwnProperty('key') ? assignedTo.key : assignedTo;
            contactToSave = {
              ...contactToSave,
              assigned_to: `user-${assignedToID}`,
            };
          }
          //dispatch(save(contactToSave));
        } else {
          //Empty contact name
          setState({
            ...state,
            nameRequired: true,
          });
        }
      },
    );
  };

  // TODO: move to utils (replace utils with utils)
  const formatActivityDate = (comment) => {
    let baptismDateRegex = /\{(\d+)\}+/;
    if (baptismDateRegex.test(comment)) {
      comment = comment.replace(baptismDateRegex, (match, timestamp) =>
        utils.formatDateToView(timestamp * 1000),
      );
    }
    return comment;
  };

  // TODO: move to helpers
  const setComment = (value) => {
    setState({
      ...state,
      comment: value,
    });
  };

  // TODO: move to helpers?
  const onSaveComment = () => {
    const { comment } = state;
    if (!state.loadComments) {
      if (comment.length > 0) {
        Keyboard.dismiss();
        //dispatch(saveComment(state.record.ID, { comment }));
      }
    }
  };

  // TODO: move to utils (or helpers bc of above)?
  const getCommentsAndActivities = () => {
    const { comments, activities, filtersSettings } = state;
    let list = [];
    if (filtersSettings.showComments) {
      list = list.concat(comments.data);
    }
    if (filtersSettings.showActivities) {
      list = list.concat(activities.data);
    }
    return utils.groupCommentsActivities(list);
  };

  // TODO: move to helper bc used by: ContactDetails, GroupDetails, Field, FieldValue
  const getSelectizeItems = (contactList, localList) => {
    const items = [];
    if (contactList) {
      contactList.values.forEach((listItem) => {
        const foundItem = localList.find((localItem) => localItem.value === listItem.value);
        if (foundItem) {
          items.push({
            name: foundItem.name,
            value: listItem.value,
          });
        }
      });
    }
    return items;
  };

  // TODO: move to helpers? currently only in Contacts, but some other future Module?
  const linkingPhoneDialer = (phoneNumber) => {
    let number = '';
    if (isIOS) {
      number = 'telprompt:${' + phoneNumber + '}';
    } else {
      number = 'tel:${' + phoneNumber + '}';
    }
    Linking.openURL(number);
  };

  // TODO: move to helpers?
  const goToDetailsScreen = (id, name) => {
    if (isContact) {
      goToContactDetailScreen(id, name);
      return;
    }
    if (isGroup) {
      goToGroupDetailScreen(id, name);
      return;
    }
    return null;
  };

  // TODO: merge with Groups?
  const goToContactDetailScreen = (id, name) => {
    navigation.push('ContactDetail', {
      id,
      name,
      onlyView: true,
      //afterBack: () => afterBack(),
    });
  };

  // TODO: merge with Contacts?
  const goToGroupDetailScreen = (id, name) => {
    navigation.navigate('GroupDetail', {
      id,
      name,
      onlyView: true,
    });
  };

  // TODO:
  const toggleShareView = () => {
    setState({
      ...state,
      showShareView: !state.showShareView,
    });
  };

  // TODO: filter
  // move to helpers?
  const toggleFilterView = () => {
    setState({
      ...state,
      showFilterView: !state.showFilterView,
    });
  };

  // TODO: filter
  const resetFilters = () => {
    setState(
      {
        ...state,
        filtersSettings: {
          showComments: true,
          showActivities: true,
        },
      },
      () => {
        toggleFilterView();
      },
    );
  };

  // TODO: filter
  const toggleFilter = (value, filterName) => {
    setState((prevState) => ({
      ...state,
      filtersSettings: {
        ...prevState.filtersSettings,
        [filterName]: !value,
      },
    }));
  };

  // TODO: ??
  const onSuggestionTap = (username, hidePanel) => {
    hidePanel();
    let comment = state.comment.slice(0, -state.keyword.length);
    let mentionFormat = `@[${username.label}](${username.key})`;
    setState({
      ...state,
      suggestedUsers: [],
      comment: `${comment}${mentionFormat}`,
    });
  };

  // TODO: ??
  const filterUsers = (keyword) => {
    let newKeyword = keyword.replace('@', '');
    setState((state) => {
      return {
        ...state,
        suggestedUsers: state.users.filter((user) =>
          user.label.toLowerCase().includes(newKeyword.toLowerCase()),
        ),
        keyword,
      };
    });
  };

  // TODO: comments
  const renderSuggestionsRow = ({ item }, hidePanel) => {
    return (
      <TouchableOpacity onPress={() => onSuggestionTap(item, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Text style={styles.usernameInitials}>
              {!!item.label && item.label.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.label}</Text>
            <Text style={styles.usernameText}>@{item.label}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // TODO: comments
  const renderFilterCommentsView = () => (
    <View style={{ flex: 1 }}>
      <Text
        style={[
          {
            color: Colors.tintColor,
            fontSize: 18,
            textAlign: 'left',
            fontWeight: 'bold',
            marginBottom: 20,
            marginTop: 20,
            marginLeft: 10,
          },
        ]}>
        {i18n.t('global.showing')}:
      </Text>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => toggleFilter(state.filtersSettings.showComments, 'showComments')}>
        <View
          style={{
            flexDirection: 'row',
            height: 50,
          }}>
          <Text
            style={{
              marginRight: 'auto',
              marginLeft: 10,
            }}>
            {i18n.t('global.comments')} ({state.comments.data.length})
          </Text>
          <CheckBox
            Component={TouchableWithoutFeedback}
            checked={state.filtersSettings.showComments}
            containerStyle={{
              padding: 0,
              margin: 0,
            }}
            checkedColor={Colors.tintColor}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => toggleFilter(state.filtersSettings.showActivities, 'showActivities')}>
        <View
          style={{
            flexDirection: 'row',
            height: 50,
          }}>
          <Text
            style={{
              marginRight: 'auto',
              marginLeft: 10,
            }}>
            {i18n.t('global.activity')} ({state.activities.data.length})
          </Text>
          <CheckBox
            Component={TouchableWithoutFeedback}
            checked={state.filtersSettings.showActivities}
            containerStyle={{
              padding: 0,
              margin: 0,
            }}
            checkedColor={Colors.tintColor}
          />
        </View>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row' }}>
        <Button
          style={{
            height: 75,
            width: windowWidth / 2,
            backgroundColor: '#FFFFFF',
          }}
          onPress={() => resetFilters()}>
          <Text
            style={{
              color: Colors.primary,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            {i18n.t('global.reset')}
          </Text>
        </Button>
        <Button
          style={{
            height: 75,
            width: windowWidth / 2,
            backgroundColor: Colors.primary,
          }}
          onPress={() => toggleFilterView()}>
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
            {i18n.t('global.apply')}
          </Text>
        </Button>
      </View>
    </View>
  );

  // TODO: comments
  const renderAllCommentsView = () => (
    <View style={{ flex: 1, paddingBottom: state.footerHeight + state.footerLocation }}>
      {state.comments.data.length == 0 &&
      state.activities.data.length == 0 &&
      !state.loadComments &&
      !state.loadActivities ? (
        noCommentsRender()
      ) : (
        <FlatList
          style={{
            backgroundColor: '#ffffff',
          }}
          ref={(flatList) => {
            commentsFlatListRef = flatList;
          }}
          data={getCommentsAndActivities()}
          extraData={!state.loadingMoreComments || !state.loadingMoreActivities}
          inverted
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: '#CCCCCC',
              }}
            />
          )}
          keyExtractor={(item, index) => String(index)}
          renderItem={(item) => {
            const commentOrActivity = item.item;
            return renderActivityOrCommentRow(commentOrActivity);
          }}
          refreshControl={
            <RefreshControl
              refreshing={state.loadComments || state.loadActivities}
              onRefresh={() => onRefreshCommentsActivities(state.record.ID, true)}
            />
          }
          onScroll={({ nativeEvent }) => {
            utils.onlyExecuteLastCall(
              {},
              () => {
                const flatList = nativeEvent;
                const contentOffsetY = flatList.contentOffset.y;
                const layoutMeasurementHeight = flatList.layoutMeasurement.height;
                const contentSizeHeight = flatList.contentSize.height;
                const heightOffsetSum = layoutMeasurementHeight + contentOffsetY;
                const distanceToStart = contentSizeHeight - heightOffsetSum;
                if (distanceToStart < 100) {
                  getContactComments(state.record.ID);
                  getContactActivities(state.record.ID);
                }
              },
              500,
            );
          }}
        />
      )}
      <View style={{ backgroundColor: Colors.mainBackgroundColor }}>
        <MentionsTextInput
          editable={!state.loadComments}
          placeholder={i18n.t('global.writeYourCommentNoteHere')}
          value={state.comment}
          onChangeText={setComment}
          style={isRTL ? { textAlign: 'right', flex: 1 } : {}}
          textInputStyle={{
            borderColor: '#B4B4B4',
            borderRadius: 5,
            borderWidth: 1,
            padding: 5,
            margin: 10,
            width: windowWidth - 120,
            backgroundColor: state.loadComments ? '#e6e6e6' : '#FFFFFF',
          }}
          loadingComponent={() => (
            <View
              style={{
                flex: 1,
                width: windowWidth,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator />
            </View>
          )}
          textInputMinHeight={40}
          textInputMaxHeight={80}
          trigger={'@'}
          triggerLocation={'new-word-only'}
          triggerCallback={filterUsers}
          renderSuggestionsRow={renderSuggestionsRow}
          suggestionsData={state.suggestedUsers}
          keyExtractor={(item, index) => item.key.toString()}
          suggestionRowHeight={45}
          horizontal={false}
          MaxVisibleRowCount={3}
        />
        <TouchableOpacity
          onPress={() => onSaveComment()}
          style={[
            styles.commentsActionButtons,
            {
              paddingTop: 7,
              marginRight: 60,
            },
            state.loadComments
              ? { backgroundColor: '#e6e6e6' }
              : { backgroundColor: Colors.tintColor },
            isRTL ? { paddingRight: 10 } : { paddingLeft: 10 },
          ]}>
          <Icon android="md-send" ios="ios-send" style={[{ color: 'white', fontSize: 25 }]} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFilterView()}
          style={[
            styles.commentsActionButtons,
            {
              marginRight: 10,
            },
          ]}>
          <Icon
            type="FontAwesome"
            name="filter"
            style={[
              {
                color: Colors.tintColor,
                fontSize: 35,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // TODO: comments
  const noCommentsRender = () => (
    <ScrollView
      style={styles.noCommentsContainer}
      refreshControl={
        <RefreshControl
          refreshing={state.loadComments || state.loadActivities}
          onRefresh={() => onRefreshCommentsActivities(state.record.ID, true)}
        />
      }>
      <Grid style={{ transform: [{ scaleY: -1 }] }}>
        <Col>
          <Row style={{ justifyContent: 'center' }}>
            <Image style={styles.noCommentsImage} source={dtIcon} />
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('contactDetailScreen.noContactCommentPlaceHolder')}
            </Text>
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('contactDetailScreen.noContactCommentPlaceHolder1')}
            </Text>
          </Row>
          {!isConnected && (
            <Row>
              <Text style={[styles.noCommentsText, { backgroundColor: '#fff2ac' }]}>
                {i18n.t('contactDetailScreen.noContactCommentPlaceHolderOffline')}
              </Text>
            </Row>
          )}
        </Col>
      </Grid>
    </ScrollView>
  );

  // TODO: comments
  //const renderCommentsView = () => {
  const commentsView = () => {
    return <>{state.showFilterView ? { renderFilterCommentsView } : { renderAllCommentsView }}</>;
  };

  // TODO: ??
  const renderActivityOrCommentRow = (commentOrActivity) => (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: commentOrActivity.data[0].gravatar }} />
      <View style={styles.content}>
        {
          // Comment
          commentOrActivity.data
            .sort((a, b) => {
              // Sort comments/activities group 'asc'
              return new Date(a.date) > new Date(b.date);
            })
            .map((item, index) => {
              return (
                <View key={index.toString()}>
                  {index === 0 && (
                    <View style={styles.contentHeader}>
                      <Grid>
                        <Row>
                          <Col>
                            <Text
                              style={[styles.name, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                              {Object.prototype.hasOwnProperty.call(item, 'content')
                                ? item.author
                                : item.name}
                            </Text>
                          </Col>
                          <Col style={{ width: 110 }}>
                            <Text
                              style={[
                                styles.time,
                                isRTL ? { textAlign: 'left', flex: 1 } : { textAlign: 'right' },
                              ]}>
                              {utils.formatDateToView(item.date)}
                            </Text>
                          </Col>
                        </Row>
                      </Grid>
                    </View>
                  )}
                  <ParsedText
                    selectable
                    style={[
                      {
                        paddingLeft: 10,
                        paddingRight: 10,
                      },
                      Object.prototype.hasOwnProperty.call(item, 'object_note')
                        ? { color: '#B4B4B4', fontStyle: 'italic' }
                        : {},
                      isRTL ? { textAlign: 'left', flex: 1 } : {},
                      index > 0 ? { marginTop: 20 } : {},
                    ]}
                    parse={[
                      {
                        pattern: utils.mentionPattern,
                        style: { color: Colors.primary },
                        renderText: utils.renderMention,
                      },
                    ]}>
                    {Object.prototype.hasOwnProperty.call(item, 'content')
                      ? item.content
                      : formatActivityDate(item.object_note)}
                  </ParsedText>
                  {Object.prototype.hasOwnProperty.call(item, 'content') &&
                    (item.author.toLowerCase() === userData.username.toLowerCase() ||
                      item.author.toLowerCase() === userData.displayName.toLowerCase()) && (
                      <Grid style={{ marginTop: 20 }}>
                        <Row
                          style={{
                            marginTop: 'auto',
                            marginBottom: 'auto',
                          }}>
                          <Row
                            style={{ marginLeft: 0, marginRight: 'auto' }}
                            onPress={() => {
                              openCommentDialog(item, true);
                            }}>
                            <Icon
                              type="MaterialCommunityIcons"
                              name="delete"
                              style={{
                                color: Colors.iconDelete,
                                fontSize: 20,
                              }}
                            />
                            <Text
                              style={{
                                color: Colors.primary,
                                fontSize: 14,
                              }}>
                              {i18n.t('global.delete')}
                            </Text>
                          </Row>
                          <Row
                            style={{
                              marginLeft: 'auto',
                              marginRight: 0,
                            }}
                            onPress={() => {
                              openCommentDialog(item);
                            }}>
                            <Icon
                              type="MaterialCommunityIcons"
                              name="pencil"
                              style={{
                                color: Colors.primary,
                                fontSize: 20,
                                marginLeft: 'auto',
                              }}
                            />
                            <Text
                              style={{
                                color: Colors.primary,
                                fontSize: 14,
                              }}>
                              {i18n.t('global.edit')}
                            </Text>
                          </Row>
                        </Row>
                      </Grid>
                    )}
                </View>
              );
            })
        }
      </View>
    </View>
  );

  // TODO: move with renderShowReasonStatusView = () => {
  const toggleReasonStatusView = (confirmReasonChange = false) => {
    setState((prevState) => {
      let newState = {
        showReasonStatusView: !prevState.showReasonStatusView,
      };
      if (confirmReasonChange) {
        // Save selected reason on contact detail
        newState = {
          ...newState,
          contact: {
            ...prevState.record,
            [prevState.selectedReasonStatus.key]: prevState.selectedReasonStatus.value,
          },
        };
      } else {
        // Revert selectedReasonStatus to current cotnact reasonStatus
        newState = {
          ...state,
          ...newState,
          selectedReasonStatus: {
            key: `reason_${state.record.overall_status}`,
            value: state.record[`reason_${state.record.overall_status}`],
          },
        };
      }
      return newState;
    });
  };

  // TODO: move with renderShowReasonStatusView = () => {
  const renderReasonStatusPickerItems = (collection) => {
    return Object.keys(collection).map((key) => {
      let value = collection[key];
      return <Picker.Item key={key} label={value.label} value={key} />;
    });
  };

  // TODO: componentize (w/ Modal?)
  const renderShowShareView = () => {
    return (
      <View style={[styles.dialogBox, { height: windowHeight * 0.65 }]}>
        <Grid>
          <Row>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>
                {i18n.t('global.shareSettings')}
              </Text>
              <Text>{i18n.t('contactDetailScreen.contactSharedWith')}:</Text>
              <Selectize
                itemId="value"
                items={state.users.map((user) => ({
                  name: user.label,
                  value: user.key,
                }))}
                selectedItems={getSelectizeItems(
                  { values: [...state.sharedUsers] },
                  state.users.map((user) => ({
                    name: user.label,
                    value: user.key,
                  })),
                )}
                textInputProps={{
                  placeholder: i18n.t('global.searchUsers'),
                }}
                renderChip={(id, onClose, item, style, iconStyle) => (
                  <Chip
                    key={id}
                    iconStyle={iconStyle}
                    onClose={(props) => {
                      // TODO: parseInt?
                      //dispatch(removeUserToShare(state.record.ID, item.value));
                      onClose(props);
                    }}
                    text={item.name}
                    style={style}
                  />
                )}
                renderRow={(id, onPress, item) => (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    key={id}
                    onPress={(props) => {
                      //dispatch(addUserToShare(state.record.ID, parseInt(item.value)));
                      onPress(props);
                    }}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          color: 'rgba(0, 0, 0, 0.87)',
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          color: 'rgba(0, 0, 0, 0.54)',
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        {' '}
                        (#
                        {id})
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                filterOnKey="name"
                inputContainerStyle={[styles.selectizeField]}
                showItems="onFocus"
              />
            </ScrollView>
          </Row>
          <Row style={{ height: 60, borderColor: '#B4B4B4', borderTopWidth: 1 }}>
            <Button block style={styles.dialogButton} onPress={toggleShareView}>
              <Text style={{ color: Colors.buttonText }}>{i18n.t('global.close')}</Text>
            </Button>
          </Row>
        </Grid>
      </View>
    );
  };

  // TODO: componentize (w/ Modal?)
  const renderShowReasonStatusView = () => {
    return (
      <View style={[styles.dialogBox, { height: windowHeight - windowHeight * 0.4 }]}>
        <Grid>
          <Row>
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>
                {contactSettings.fields[`reason_${state.record.overall_status}`].name}
              </Text>
              <Text style={{ marginBottom: 20 }}>
                {contactSettings.fields[`reason_${state.record.overall_status}`].description}
              </Text>
              <Text style={{ marginBottom: 20 }}>{i18n.t('global.chooseOption')}:</Text>
              <View style={styles.contactTextRoundField}>
                <Picker
                  selectedValue={state.selectedReasonStatus.value}
                  onValueChange={(value) => {
                    setState({
                      ...state,
                      selectedReasonStatus: {
                        key: `reason_${state.record.overall_status}`,
                        value,
                      },
                    });
                  }}>
                  {renderReasonStatusPickerItems(
                    contactSettings.fields[`reason_${state.record.overall_status}`].values,
                  )}
                </Picker>
              </View>
            </View>
          </Row>
          <Row style={{ height: 60, borderColor: '#B4B4B4', borderTopWidth: 1 }}>
            <Button
              block
              style={[styles.dialogButton, { backgroundColor: '#FFFFFF' }]}
              onPress={() => toggleReasonStatusView()}>
              <Text style={{ color: Colors.primary }}>{i18n.t('global.cancel')}</Text>
            </Button>
            <Button block style={styles.dialogButton} onPress={() => toggleReasonStatusView(true)}>
              <Text style={{ color: Colors.buttonText }}>{i18n.t('global.confirm')}</Text>
            </Button>
          </Row>
        </Grid>
      </View>
    );
  };

  // TODO:  move to CommentDialog/Modal component
  const openCommentDialog = (comment, deleteComment = false) => {
    setState({
      ...state,
      commentDialog: {
        toggle: true,
        data: comment,
        delete: deleteComment,
      },
    });
  };

  // TODO:  move to CommentDialog/Modal component
  const onCloseCommentDialog = () => {
    setState({
      ...state,
      commentDialog: {
        toggle: false,
        data: {},
        delete: false,
      },
    });
  };

  // TODO: how to share in helpers when using styles?
  const renderCommentDialog = () => {
    return (
      <View style={styles.dialogBox}>
        <Grid>
          <Row>
            {state.commentDialog.delete ? (
              <View style={styles.dialogContent}>
                <Row style={{ height: 30 }}>
                  <Label style={[styles.name, { marginBottom: 5 }]}>
                    {i18n.t('global.delete')}
                  </Label>
                </Row>
                <Row>
                  <Text style={{ fontSize: 15 }}>{state.commentDialog.data.content}</Text>
                </Row>
              </View>
            ) : (
              <View style={styles.dialogContent}>
                <Grid>
                  <Row style={{ height: 30 }}>
                    <Label style={[styles.name, { marginBottom: 5 }]}>
                      {i18n.t('global.edit')}
                    </Label>
                  </Row>
                  <Row>
                    <Input
                      multiline
                      value={state.commentDialog.data.content}
                      onChangeText={(value) => {
                        setState((prevState) => ({
                          ...state,
                          commentDialog: {
                            ...prevState.commentDialog,
                            data: {
                              ...prevState.commentDialog.data,
                              content: value,
                            },
                          },
                        }));
                      }}
                      style={[styles.contactTextField, { height: 'auto', minHeight: 50 }]}
                    />
                  </Row>
                </Grid>
              </View>
            )}
          </Row>
          <Row style={{ height: 60 }}>
            <Button
              transparent
              style={{
                marginTop: 20,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 'auto',
                paddingLeft: 25,
                paddingRight: 25,
              }}
              onPress={() => {
                onCloseCommentDialog();
              }}>
              <Text style={{ color: Colors.primary }}>{i18n.t('global.close')}</Text>
            </Button>
            {state.commentDialog.delete ? (
              <Button
                block
                style={[styles.dialogButton, { backgroundColor: Colors.buttonDelete }]}
                onPress={() => {
                  //dispatch(deleteComment(state.record.ID, state.commentDialog.data.ID));
                  onCloseCommentDialog();
                }}>
                <Text style={{ color: Colors.buttonText }}>{i18n.t('global.delete')}</Text>
              </Button>
            ) : (
              <Button
                block
                style={styles.dialogButton}
                onPress={() => {
                  //dispatch(saveComment(state.record.ID, state.commentDialog.data));
                  onCloseCommentDialog();
                }}>
                <Text style={{ color: Colors.buttonText }}>{i18n.t('global.save')}</Text>
              </Button>
            )}
          </Row>
        </Grid>
      </View>
    );
  };

  // TODO: better Modal strategy?
  const Modals = () => {
    return (
      <>
        <ActionModal
          visible={state?.commentDialog?.toggle}
          onClose={(visible) => {
            onCancel();
          }}
          title={'?? INSERT TITLE HERE ??'}>
          {renderCommentDialog}
        </ActionModal>
        {/* TODO: not working...*/}
        <ActionModal
          //visible={state?.showShareView}
          visible={false}
          onClose={(visible) => {
            onCancel();
          }}
          title={'?? INSERT TITLE HERE ??'}>
          {renderShowShareView}
        </ActionModal>
        <ActionModal
          visible={state?.showReasonStatusView}
          onClose={(visible) => {
            onCancel();
          }}
          title={'?? INSERT TITLE HERE ??'}>
          {renderShowReasonStatusView}
        </ActionModal>
      </>
    );
  };

  const CreatePost = () => {
    if (!settings?.tiles) return null;
    const fields = [];
    settings.tiles.forEach((tile) => {
      let creationFieldsByTile = tile?.fields?.filter((field) => field?.in_create_form === true);
      if (creationFieldsByTile.length > 0) {
        fields.push(...creationFieldsByTile);
      }
    });
    return (
      <KeyboardAwareScrollView
        enableAutomaticScroll
        enableOnAndroid
        keyboardOpeningTime={0}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled">
        {!isConnected && <OfflineBar />}
        <Tile fields={fields} />
      </KeyboardAwareScrollView>
    );
  };

  const Post = () => {
    // TODO: why relying on position rather than name or type?
    const isLastTab = index === routes?.length - 1;
    //console.log(`isLastTab? ${isLastTab}`);
    // TODO: KeyboardAwareScrollView for editing?
    return (
      <>
        {!isConnected && <OfflineBar />}
        <TabView
          //lazy
          navigationState={{ index, routes }}
          //navigationState={tabRoutes}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={styles.tabStyle}
              activeColor={Colors.tintColor}
              inactiveColor={Colors.gray}
              scrollEnabled
              tabStyle={{ width: 'auto' }}
              indicatorStyle={styles.tabBarUnderlineStyle}
              renderLabel={({ route, color }) => (
                <Text style={{ color, fontWeight: 'bold' }}>{route.title}</Text>
              )}
            />
          )}
          renderScene={({ route }) => {
            // TODO: placeholder if error?
            const tile = settings.tiles.find((tile) => tile.label === route.title);
            if (route.key === 'comments') {
              if (state.showFilterView) {
                return renderFilterCommentsView();
              } else {
                return renderAllCommentsView();
              }
            }
            return <Tile fields={tile.fields} />;
          }}
          //renderLazyPlaceholder={({ route }) => {
          //return null;
          //  console.log("-----> renderLazyPlaceholder ");
          //  return <Text>Loading...</Text>;
          //}}
          onIndexChange={setIndex}
          initialLayout={{ width: windowWidth }}
        />
        {!editing && !isLastTab && <FAB post={post} />}
      </>
    );
  };

  if (postError || settingsError || userError || !id)
    showToast(
      postError?.message || settingsError?.message || userError?.message || 'ZZError',
      true,
    );
  if (!post || !settings || !userData) return null;

  const isCreate = route?.params?.create;
  return (
    <>
      {isCreate ? <CreatePost /> : <Post />}
      <Modals />
    </>
  );
};
DetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};
export default DetailsScreen;
