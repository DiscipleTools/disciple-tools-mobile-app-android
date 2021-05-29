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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Label, Input, Icon, Picker, DatePicker, Textarea, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
// TODO: replace with Native Base FAB?
import ActionButton from 'react-native-action-button';

import { Chip, Selectize } from 'react-native-material-selectize';
import { TabView, TabBar } from 'react-native-tab-view';
//import { NavigationActions, StackActions } from 'react-navigation';
import MentionsTextInput from 'react-native-mentions';
import ParsedText from 'react-native-parsed-text';
// TODO: re-implement?
//import * as Sentry from 'sentry-expo';
import { CheckBox } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import CustomView from 'components/CustomView';
import ActionModal from 'components/ActionModal';
import OfflineBar from 'components/OfflineBar';
import HeaderLeft from 'components/HeaderLeft';
import HeaderRight from 'components/HeaderRight';
import KebabMenu from 'components/KebabMenu';
import {
  save,
  getCommentsByContact,
  saveComment,
  getActivitiesByContact,
  getAll,
  getById,
  getByIdEnd,
  getContactSettings,
  saveEnd,
  deleteComment,
  loadingFalse,
  updatePrevious,
  getShareSettings,
  addUserToShare,
  removeUserToShare,
} from 'store/actions/contacts.actions';
import { getContactFilters } from 'store/actions/users.actions';
import {
  updatePrevious as updatePreviousGroups,
  searchLocations,
} from 'store/actions/groups.actions';

import i18n from 'languages';

import utils from 'utils';
import { isIOS, getRoutes, renderCreationFields, showToast } from 'helpers';
import Colors from 'constants/Colors';
import {
  hasBibleIcon,
  statusIcon,
  readingBibleIcon,
  statesBeliefIcon,
  canShareGospelIcon,
  sharingTheGospelIcon,
  baptizedIcon,
  baptizingIcon,
  inChurchIcon,
  dtIcon,
  startingChurchesIcon,
} from 'constants/Icons';
import { styles } from './ContactDetailScreen.styles';

const initialState = {
  contact: {},
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
  tabViewConfig: {
    index: 0,
    routes: [],
  },
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

// TODO: create a Module component and just pass it in the relevant Settings, etc...
const ContactDetailScreen = ({ navigation, route }) => {
  const kebabMenuRef = useRef();
  const dispatch = useDispatch();

  let keyboardDidShowListener, keyboardDidHideListener, focusListener, hardwareBackPressListener;

  const layout = useWindowDimensions();
  const windowWidth = layout.width;
  const milestonesGridSize = windowWidth + 5;
  const windowHeight = layout.height;

  const userData = useSelector((state) => state.userReducer.userData);
  const userReducerError = useSelector((state) => state.userReducer.error);
  const contact = useSelector((state) => state.contactsReducer.contact);
  const comments = useSelector((state) => state.contactsReducer.comments);
  const totalComments = useSelector((state) => state.contactsReducer.totalComments);
  const loadingComments = useSelector((state) => state.contactsReducer.loadingComments);
  const activities = useSelector((state) => state.contactsReducer.activities);
  const totalActivities = useSelector((state) => state.contactsReducer.totalActivities);
  const loadingActivities = useSelector((state) => state.contactsReducer.loadingActivities);
  const newComment = useSelector((state) => state.contactsReducer.newComment);
  const contactsReducerError = useSelector((state) => state.contactsReducer.error);
  const loading = useSelector((state) => state.contactsReducer.loading);
  const saved = useSelector((state) => state.contactsReducer.saved);
  const isConnected = useSelector((state) => state.networkConnectivityReducer.isConnected);
  const contactSettings = useSelector((state) => state.contactsReducer.settings);
  const foundGeonames = useSelector((state) => state.groupsReducer.foundGeonames);
  const groupsList = useSelector((state) => state.groupsReducer.groups);
  const contactsList = useSelector((state) => state.contactsReducer.contacts);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const questionnaires = useSelector((state) => state.questionnaireReducer.questionnaires);
  const previousContacts = useSelector((state) => state.contactsReducer.previousContacts);
  const previousGroups = useSelector((state) => state.groupsReducer.previousGroups);
  const loadingShare = useSelector((state) => state.contactsReducer.loadingShare);
  const shareSettings = useSelector((state) => state.contactsReducer.shareSettings);
  const savedShare = useSelector((state) => state.contactsReducer.savedShare);
  const tags = useSelector((state) => state.contactsReducer.tags);

  const [state, setState] = useState({
    ...initialState,
    tabViewConfig: {
      ...initialState.tabViewConfig,
      routes: getRoutes(contactSettings),
    },
  });

  const kebabMenuItems = [
    {
      label: i18n.t('global.share'),
      callback: () => toggleShareView(),
    },
    {
      label: i18n.t('global.viewOnMobileWeb'),
      callback: () => {
        const domain = userData?.domain;
        const id = contact?.ID;
        if (domain && id) {
          Linking.openURL(`https://${domain}/contacts/${id}/`);
        } else {
          showToast(i18n.t('global.error.recordData'), true);
        }
      },
    },
  ];

  useLayoutEffect(() => {
    const title = route.params?.contactName ?? i18n.t('contactDetailScreen.addNewContact');
    navigation.setOptions({
      title,
      headerLeft: (props) => (
        <HeaderLeft
          {...props}
          onPress={() => {
            console.log('*** HEADER LEFT WAS PRESSED ***');
            /*
              //backButtonTap();
              //onDisableEdit();
            */
          }}
        />
      ),
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
        width: route.params?.onlyView
          ? Platform.select({
              android: 180,
              ios: 140,
            })
          : Platform.select({
              android: 180,
              ios: 140,
            }),
        marginLeft: route.params?.onlyView ?? 25,
      },
    });
  }, [navigation]);

  /*
  useEffect(() => {
    const contactId = route?.params?.contactId ?? null;
    console.log(`**** CONTACT ID: ${ contactId } ****`);
    dispatch(getById(contactId));
  }, []);


  useEffect(() => {
    console.log("*** CONTACT DETAILS LOADED ***");
    const routes = getRoutes(contactSettings);
    console.log(routes);
    setState({
      ...state,
      tabViewConfig: {
        ...state.tabViewConfig,
        routes,
      }
    });
  }, []);
  */

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
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      contact,
      loading,
      comments,
      loadingComments,
      activities,
      loadingActivities,
      foundGeonames,
      loadingShare,
      shareSettings,
      navigation,
    } = nextProps;
    let newState = {
      ...prevState,
      loading: loading || loadingShare,
      comments: prevState.comments,
      loadComments: loadingComments,
      activities: prevState.activities,
      loadActivities: loadingActivities,
      contact: prevState.contact,
      unmodifiedContact: prevState.unmodifiedContact,
    };

    // SAVE / GET BY ID
    if (contact) {
      newState = {
        ...newState,
        contact: {
          ...contact,
        },
        unmodifiedContact: {
          ...contact,
        },
      };
      if (newState.contact.overall_status) {
        newState = {
          ...newState,
          overallStatusBackgroundColor: utils.getSelectorColor(
            newState.contact.overall_status,
          ),
        };
        let contactReasonStatusKey = `reason_${newState.contact.overall_status}`;
        // CONTACT HAS STATUS WITH REASON
        let contactHasStatusReason = Object.prototype.hasOwnProperty.call(
          newState.contact,
          contactReasonStatusKey,
        );
        if (contactHasStatusReason) {
          newState = {
            ...newState,
            selectedReasonStatus: {
              key: contactReasonStatusKey,
              value: newState.contact[contactReasonStatusKey],
            },
            unmodifiedSelectedReasonStatus: {
              key: contactReasonStatusKey,
              value: newState.contact[contactReasonStatusKey],
            },
          };
        }
      }
      if (prevState.contact.initial_comment) {
        newState = {
          ...newState,
          comment: prevState.contact.initial_comment,
        };
      }
      if (newState.contact.location_grid) {
        newState.contact.location_grid.values.forEach((location) => {
          const foundLocation = newState.geonames.find(
            (geoname) => geoname.value === location.value,
          );
          if (!foundLocation) {
            // Add non existent contact location in the geonames list to avoid null exception
            newState = {
              ...newState,
              geonames: [
                ...newState.geonames,
                {
                  name: location.name,
                  value: location.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.sources) {
        newState.contact.sources.values.forEach((sourceContact) => {
          const foundSource = newState.sources.find(
            (sourceItem) => sourceItem.value === sourceContact.value,
          );
          if (!foundSource) {
            // Add non existent contact source in sources list to avoid null exception
            newState = {
              ...newState,
              sources: [
                ...newState.sources,
                {
                  name: sourceContact.value,
                  value: sourceContact.value,
                },
              ],
              nonExistingSources: [
                ...newState.nonExistingSources,
                {
                  name: sourceContact.value,
                  value: sourceContact.value,
                },
              ],
              unmodifiedSources: [
                ...newState.unmodifiedSources,
                {
                  name: sourceContact.value,
                  value: sourceContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.subassigned) {
        // Clear collection
        newState = {
          ...newState,
          subAssignedContacts: [],
        };

        newState.contact.subassigned.values.forEach((subassignedContact) => {
          const foundSubassigned = newState.usersContacts.find(
            (user) => user.value === subassignedContact.value,
          );
          if (!foundSubassigned) {
            // Add non existent contact subassigned in subassigned list (user does not have access permission to contacts)
            newState = {
              ...newState,
              subAssignedContacts: [
                ...newState.subAssignedContacts,
                {
                  name: subassignedContact.name,
                  value: subassignedContact.value,
                },
              ],
              unmodifiedSubAssignedContacts: [
                ...newState.unmodifiedSubAssignedContacts,
                {
                  name: subassignedContact.name,
                  value: subassignedContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.relation) {
        // Clear collection
        newState = {
          ...newState,
          relationContacts: [],
        };

        newState.contact.relation.values.forEach((relationContact) => {
          const foundRelation = newState.usersContacts.find(
            (user) => user.value === relationContact.value,
          );
          if (!foundRelation) {
            // Add non existent contact relation in relation list (user does not have access permission to contacts)
            newState = {
              ...newState,
              relationContacts: [
                ...newState.relationContacts,
                {
                  name: relationContact.name,
                  value: relationContact.value,
                },
              ],
              unmodifiedRelationContacts: [
                ...newState.unmodifiedRelationContacts,
                {
                  name: relationContact.name,
                  value: relationContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.baptized_by) {
        // Clear collection
        newState = {
          ...newState,
          baptizedByContacts: [],
        };

        newState.contact.baptized_by.values.forEach((baptizedByContact) => {
          const foundBaptized = newState.usersContacts.find(
            (user) => user.value === baptizedByContact.value,
          );
          if (!foundBaptized) {
            // Add non existent contact relation in relation list (user does not have access permission to contacts)
            newState = {
              ...newState,
              baptizedByContacts: [
                ...newState.baptizedByContacts,
                {
                  name: baptizedByContact.name,
                  value: baptizedByContact.value,
                },
              ],
              unmodifiedBaptizedByContacts: [
                ...newState.unmodifiedBaptizedByContacts,
                {
                  name: baptizedByContact.name,
                  value: baptizedByContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.baptized) {
        // Clear collection
        newState = {
          ...newState,
          baptizedContacts: [],
        };

        newState.contact.baptized.values.forEach((baptizedContact) => {
          const foundBaptized = newState.usersContacts.find(
            (user) => user.value === baptizedContact.value,
          );
          if (!foundBaptized) {
            // Add non existent contact baptized to list (user does not have access permission to contacts)
            newState = {
              ...newState,
              baptizedContacts: [
                ...newState.baptizedContacts,
                {
                  name: baptizedContact.name,
                  value: baptizedContact.value,
                },
              ],
              unmodifiedBaptizedContacts: [
                ...newState.unmodifiedBaptizedContacts,
                {
                  name: baptizedContact.name,
                  value: baptizedContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.coached_by) {
        // Clear collection
        newState = {
          ...newState,
          coachedByContacts: [],
        };

        newState.contact.coached_by.values.forEach((coachedByContact) => {
          const foundcoachedBy = newState.usersContacts.find(
            (user) => user.value === coachedByContact.value,
          );
          if (!foundcoachedBy) {
            // Add non existent contact coachedBy to list (user does not have access permission to contacts)
            newState = {
              ...newState,
              coachedByContacts: [
                ...newState.coachedByContacts,
                {
                  name: coachedByContact.name,
                  value: coachedByContact.value,
                },
              ],
              unmodifiedCoachedByContacts: [
                ...newState.unmodifiedCoachedByContacts,
                {
                  name: coachedByContact.name,
                  value: coachedByContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.coaching) {
        // Clear collection
        newState = {
          ...newState,
          coachedContacts: [],
        };

        newState.contact.coaching.values.forEach((coachedContact) => {
          const foundCoached = newState.usersContacts.find(
            (user) => user.value === coachedContact.value,
          );
          if (!foundCoached) {
            // Add non existent contact coached to list (user does not have access permission to contacts)
            newState = {
              ...newState,
              coachedContacts: [
                ...newState.coachedContacts,
                {
                  name: coachedContact.name,
                  value: coachedContact.value,
                },
              ],
              unmodifiedCoachedContacts: [
                ...newState.unmodifiedCoachedContacts,
                {
                  name: coachedContact.name,
                  value: coachedContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.groups) {
        // Clear collection
        newState = {
          ...newState,
          connectionGroups: [],
        };

        newState.contact.groups.values.forEach((groupConnection) => {
          const foundGroup = newState.groups.find((group) => group.value === groupConnection.value);
          if (!foundGroup) {
            // Add non existent group to list (user does not have access permission to groups)
            newState = {
              ...newState,
              connectionGroups: [
                ...newState.connectionGroups,
                {
                  name: groupConnection.name,
                  value: groupConnection.value,
                },
              ],
              unmodifiedConnectionGroups: [
                ...newState.unmodifiedConnectionGroups,
                {
                  name: groupConnection.name,
                  value: groupConnection.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.assigned_to) {
        // Clear collection
        newState = {
          ...newState,
          assignedToContacts: [],
        };

        let foundAssigned = newState.users.find(
          (user) => user.key === newState.contact.assigned_to.key,
        );
        if (!foundAssigned) {
          // Add non existent group to list (user does not have access permission to groups)
          newState = {
            ...newState,
            assignedToContacts: [
              ...newState.assignedToContacts,
              {
                label: newState.contact.assigned_to.label,
                key: newState.contact.assigned_to.key,
              },
            ],
            unmodifedAssignedToContacts: [
              ...newState.unmodifedAssignedToContacts,
              {
                label: newState.contact.assigned_to.label,
                key: newState.contact.assigned_to.key,
              },
            ],
          };
        }
      }
    }

    // GET COMMENTS
    if (comments) {
      if (
        navigation.state.params.contactId &&
        Object.prototype.hasOwnProperty.call(comments, navigation.state.params.contactId)
      ) {
        // NEW COMMENTS (PAGINATION)
        if (comments[navigation.state.params.contactId].pagination.offset > 0) {
          newState = {
            ...newState,
            loadingMoreComments: false,
          };
        }
        // ONLINE MODE: USE STATE PAGINATION - OFFLINE MODE: USE STORE PAGINATION
        // UPDATE OFFSET
        newState = {
          ...newState,
          comments: {
            ...comments[navigation.state.params.contactId],
          },
        };
      } else {
        newState = {
          ...newState,
          comments: {
            ...initialState.comments,
          },
        };
      }
    }

    // GET ACTIVITIES
    if (activities) {
      if (
        navigation.state.params.contactId &&
        Object.prototype.hasOwnProperty.call(activities, navigation.state.params.contactId)
      ) {
        // NEW ACTIVITIES (PAGINATION)
        if (activities[navigation.state.params.contactId].pagination.offset > 0) {
          newState = {
            ...newState,
            loadingMoreActivities: false,
          };
        }
        // ONLINE MODE: USE STATE PAGINATION - OFFLINE MODE: USE STORE PAGINATION
        // UPDATE OFFSET
        newState = {
          ...newState,
          activities: {
            ...activities[navigation.state.params.contactId],
          },
        };
      } else {
        newState = {
          ...newState,
          activities: {
            ...initialState.activities,
          },
        };
      }
    }

    // GET FILTERED LOCATIONS
    if (foundGeonames) {
      newState = {
        ...newState,
        foundGeonames,
      };
    }

    if (shareSettings) {
      if (
        navigation.state.params.contactId &&
        Object.prototype.hasOwnProperty.call(shareSettings, navigation.state.params.contactId)
      ) {
        newState = {
          ...newState,
          sharedUsers: shareSettings[navigation.state.params.contactId],
        };
      }
    }

    return newState;
  }
  */

  // componentDidUpdate
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      // TODO
      console.log('*** COMPONENT DID UPDATE ***');
    } else didMountRef.current = true;
  });

  /*
  componentDidUpdate(prevProps) {
    const {
      userReducerError,
      contact,
      navigation,
      newComment,
      contactsReducerError,
      saved,
      savedShare,
    } = 

    // NEW COMMENT
    if (newComment && prevProps.newComment !== newComment) {
      // Only do scroll when element its rendered
      if (commentsFlatListRef) {
        commentsFlatListRef.scrollToOffset({ animated: true, offset: 0 });
      }
      setComment('');
    }

    // CONTACT SAVE / GET BY ID
    if (contact && prevProps.contact !== contact) {
      // Update contact data only in these conditions:
      // Same contact created (offline/online)
      // Same contact updated (offline/online)
      // Same offline contact created in DB (AutoID to DBID)
      if (
        (Object.prototype.hasOwnProperty.call(contact, 'ID') &&
          !Object.prototype.hasOwnProperty.call(state.contact, 'ID')) ||
        (Object.prototype.hasOwnProperty.call(contact, 'ID') &&
          contact.ID.toString() === state.contact.ID.toString()) ||
        (Object.prototype.hasOwnProperty.call(contact, 'oldID') &&
          contact.oldID === state.contact.ID.toString())
      ) {
        // Highlight Updates -> Compare state.contact with contact and show differences
        navigation.setParams({ contactName: contact.name, contactId: contact.ID });
        if (state.comment && state.comment.length > 0) {
          onSaveComment();
        }
        dispatch(getByIdEnd());
        // Add contact to 'previousContacts' array on creation
        if (
          !previousContacts.find(
            (previousContact) => previousContact.contactId === parseInt(contact.ID),
          )
        ) {
          dispatch(updatePrevious([
            ...previousContacts,
            {
              contactId: parseInt(contact.ID),
              onlyView: true,
              contactName: contact.name,
            },
          ]));
        }
      }
    }

    // CONTACT SAVE
    if (saved && prevProps.saved !== saved) {
      // Update contact data only in these conditions:
      // Same contact created (offline/online)
      // Same contact updated (offline/online)
      // Same offline contact created in DB (AutoID to DBID)
      if (
        (typeof contact.ID !== 'undefined' && typeof state.contact.ID === 'undefined') ||
        (contact.ID && contact.ID.toString() === state.contact.ID.toString()) ||
        (contact.oldID && contact.oldID === state.contact.ID.toString())
      ) {
        // Highlight Updates -> Compare state.contact with current contact and show differences
        onRefreshCommentsActivities(contact.ID, true);
        toastSuccess.show(
          <View>
            <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
          </View>,
          3000,
        );
        onDisableEdit();
        dispatch(saveEnd());
      }
    }

    // Share Contact with user
    if (savedShare && prevProps.savedShare !== savedShare) {
      // Highlight Updates -> Compare state.contact with current contact and show differences
      onRefreshCommentsActivities(state.contact.ID, true);
      toastSuccess.show(
        <View>
          <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
        </View>,
        3000,
      );
    }

    // ERROR
    const usersError = prevProps.userReducerError !== userReducerError && userReducerError;
    let contactsError = prevProps.contactsReducerError !== contactsReducerError;
    contactsError = contactsError && contactsReducerError;
    if (usersError || contactsError) {
      const error = userReducerError || contactsReducerError;
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.code')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.code}</Text>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.message')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.message}</Text>
        </View>,
        3000,
      );
    }
    // Fix to press back button in comments tab
    if (prevProps.navigation.state.params.hideTabBar !== navigation.state.params.hideTabBar) {
      if (!navigation.state.params.hideTabBar && state.executingBack) {
        setTimeout(() => {
          navigation.goBack(null);
          navigation.state.params.afterBack();
        }, 1000);
      }
    }
  }
  */

  // TODO: ?? delete or merge with Group
  const contactIsCreated = () => {
    return Object.prototype.hasOwnProperty.call(navigation.state.params, 'contactId');
  };

  // TODO: ?? delete or merge with Group
  const onLoad = () => {
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
    dispatch(updatePrevious(newPreviousContacts));
    if (newPreviousContacts.length > 0) {
      dispatch(loadingFalse());
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
      navigation.dispatch(resetAction);
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
      dispatch(getById(contactId));
      onRefreshCommentsActivities(contactId, true);
      dispatch(getShareSettings(contactId));
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
        onRefresh(state.contact.ID);
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
        dispatch(
          getCommentsByContact(contactId, {
            offset: 0,
            limit: 10,
          }),
        );
      } else {
        //ONLY GET DATA IF THERE IS MORE DATA TO GET
        if (
          !state.loadComments &&
          state.comments.pagination.offset < state.comments.pagination.total
        ) {
          dispatch(getCommentsByContact(contactId, state.comments.pagination));
        }
      }
    }
  };

  // TODO: move to helpers?
  const getContactActivities = (contactId, resetPagination = false) => {
    if (isConnected) {
      if (resetPagination) {
        dispatch(
          getActivitiesByContact(contactId, {
            offset: 0,
            limit: 10,
          }),
        );
      } else {
        //ONLY GET DATA IF THERE IS MORE DATA TO GET
        if (
          !state.loadActivities &&
          state.activities.pagination.offset < state.activities.pagination.total
        ) {
          dispatch(getActivitiesByContact(contactId, state.activities.pagination));
        }
      }
    }
  };

  // TODO: move to helpers
  const onEnableEdit = () => {
    setState((prevState) => {
      let indexFix = prevState.tabViewConfig.index;
      // Last tab (comments/activities)
      if (prevState.tabViewConfig.index === prevState.tabViewConfig.routes.length - 1) {
        indexFix = indexFix - 1; // -1 for commentsTab
      }
      return {
        ...state,
        onlyView: false,
        tabViewConfig: {
          ...prevState.tabViewConfig,
          index: indexFix,
          routes: getRoutes(contactSettings).filter(
            (route) => route.key !== 'comments', // && route.key !== 'other',
          ),
        },
      };
    });
    navigation.setParams({
      hideTabBar: true,
      onlyView: false,
      contactName: state.contact.name,
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
      let indexFix = prevState.tabViewConfig.index;
      let newState = {
        onlyView: true,
        contact: {
          ...unmodifiedContact,
        },
        overallStatusBackgroundColor: utils.getSelectorColor(unmodifiedContact.overall_status),
        tabViewConfig: {
          ...prevState.tabViewConfig,
          index: indexFix,
          routes: getRoutes(contactSettings),
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
          ...prevState.contact,
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
        if (state.contact.name && state.contact.name.length > 0) {
          const { unmodifiedContact } = state;
          let contactToSave = {
            ...state.contact,
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
            name: state.contact.name,
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
          if (Object.prototype.hasOwnProperty.call(state.contact, 'ID')) {
            contactToSave = {
              ...contactToSave,
              ID: state.contact.ID,
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
          dispatch(save(contactToSave));
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
        dispatch(saveComment(state.contact.ID, { comment }));
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
  const goToContactDetailScreen = (contactID, name) => {
    // Save new contact in 'previousContacts' array
    if (!previousContacts.find((previousContact) => previousContact.contactId === contactID)) {
      // Add contact to 'previousContacts' array on creation
      dispatch(
        updatePrevious([
          ...previousContacts,
          {
            contactId: contactID,
            onlyView: true,
            contactName: name,
          },
        ]),
      );
    }
    navigation.push('ContactDetail', {
      contactId: contactID,
      onlyView: true,
      contactName: name,
      afterBack: () => afterBack(),
    });
  };

  // TODO: move to helpers?
  const goToGroupDetailScreen = (groupID, name) => {
    // Clean 'previousContacts' array
    dispatch(
      updatePreviousGroups([
        {
          groupId: groupID,
          onlyView: true,
          groupName: name,
        },
      ]),
    );
    navigation.navigate('GroupDetail', {
      groupId: groupID,
      onlyView: true,
      groupName: name,
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
              onRefresh={() => onRefreshCommentsActivities(state.contact.ID, true)}
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
                  getContactComments(state.contact.ID);
                  getContactActivities(state.contact.ID);
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
          onRefresh={() => onRefreshCommentsActivities(state.contact.ID, true)}
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

  // TODO: move to Tab component
  const tabChanged = (index) => {
    setState((prevState) => ({
      ...state,
      tabViewConfig: {
        ...prevState.tabViewConfig,
        index,
      },
    }));
  };

  // TODO: move to FAB component
  const onMeetingComplete = () => {
    onSaveQuickAction('quick_button_meeting_complete');
    var isQuestionnaireEnabled = false;
    var q_id = null;
    // loop thru all (active) questionnaires, and check whether 'contact'->'meeting_complete' is enabled
    questionnaires.map((questionnaire) => {
      if (
        questionnaire.trigger_type == 'contact' &&
        questionnaire.trigger_value == 'meeting_complete'
      ) {
        isQuestionnaireEnabled = true;
        q_id = questionnaire.id;
      }
    });
    /* TODO
    if (isQuestionnaireEnabled) {
      navigation.navigate(
        NavigationActions.navigate({
          routeName: 'Questionnaire',
          action: NavigationActions.navigate({
            routeName: 'Question',
            params: {
              userData: userData,
              contact: state.contact,
              q_id,
            },
          }),
        }),
      );
    }
    */
  };

  // TODO: move to FAB component
  const onSaveQuickAction = (quickActionPropertyName) => {
    let newActionValue = state.contact[quickActionPropertyName]
      ? parseInt(state.contact[quickActionPropertyName], 10) + 1
      : 1;
    if (isConnected) {
      onSaveContact({
        [quickActionPropertyName]: newActionValue,
      });
    } else {
      // Update Seeker Path in OFFLINE mode
      let seekerPathValue = null;
      let quickActionName = quickActionPropertyName.replace('quick_button_', '');
      switch (quickActionName) {
        case 'no_answer': {
          seekerPathValue = 'attempted';
          break;
        }
        case 'contact_established': {
          seekerPathValue = 'established';
          break;
        }
        case 'meeting_scheduled': {
          seekerPathValue = 'scheduled';
          break;
        }
        case 'meeting_complete': {
          seekerPathValue = 'met';
          break;
        }
      }
      if (seekerPathValue && state.contact.seeker_path != 'met') {
        setState(
          (prevState) => ({
            ...state,
            contact: {
              ...prevState.contact,
              seeker_path: seekerPathValue,
            },
          }),
          () => {
            onSaveContact({
              [quickActionPropertyName]: newActionValue,
            });
          },
        );
      } else {
        onSaveContact({
          [quickActionPropertyName]: newActionValue,
        });
      }
    }
  };

  // TODO: refactor to shared component AND dynamic list
  const FAB = () => {
    return (
      <ActionButton
        buttonColor={Colors.primaryRGBA}
        renderIcon={(active) =>
          active ? (
            <Icon
              type="MaterialCommunityIcons"
              name="close"
              style={{ color: 'white', fontSize: 22 }}
            />
          ) : (
            <Icon
              type="MaterialCommunityIcons"
              name="comment-plus"
              style={{ color: 'white', fontSize: 25 }}
            />
          )
        }
        degrees={0}
        activeOpacity={0}
        bgColor="rgba(0,0,0,0.5)"
        nativeFeedbackRippleColor="rgba(0,0,0,0)">
        <ActionButton.Item
          title={contactSettings.fields.quick_button_no_answer.name}
          onPress={() => {
            onSaveQuickAction('quick_button_no_answer');
          }}
          size={40}
          buttonColor={Colors.colorNo}
          nativeFeedbackRippleColor="rgba(0,0,0,0)"
          textStyle={{ color: Colors.tintColor, fontSize: 15 }}
          textContainerStyle={{ height: 'auto' }}>
          <Icon type="Feather" name="phone-off" style={styles.contactFABIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          title={contactSettings.fields.quick_button_contact_established.name}
          onPress={() => {
            onSaveQuickAction('quick_button_contact_established');
          }}
          size={40}
          buttonColor={Colors.colorYes}
          nativeFeedbackRippleColor="rgba(0,0,0,0)"
          textStyle={{ color: Colors.tintColor, fontSize: 15 }}
          textContainerStyle={{ height: 'auto' }}>
          <Icon type="MaterialCommunityIcons" name="phone-in-talk" style={styles.contactFABIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          title={contactSettings.fields.quick_button_meeting_scheduled.name}
          onPress={() => {
            onSaveQuickAction('quick_button_meeting_scheduled');
          }}
          buttonColor={Colors.colorWait}
          size={40}
          nativeFeedbackRippleColor="rgba(0,0,0,0)"
          textStyle={{ color: Colors.tintColor, fontSize: 15 }}
          textContainerStyle={{ height: 'auto' }}>
          <Icon type="MaterialCommunityIcons" name="calendar-plus" style={styles.contactFABIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          title={contactSettings.fields.quick_button_meeting_complete.name}
          onPress={() => {
            onMeetingComplete();
          }}
          size={40}
          buttonColor={Colors.colorYes}
          nativeFeedbackRippleColor="rgba(0,0,0,0)"
          textStyle={{ color: Colors.tintColor, fontSize: 15 }}
          textContainerStyle={{ height: 'auto' }}>
          <Icon type="MaterialCommunityIcons" name="calendar-check" style={styles.contactFABIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          title={contactSettings.fields.quick_button_no_show.name}
          onPress={() => {
            onSaveQuickAction('quick_button_no_show');
          }}
          size={40}
          buttonColor={Colors.colorNo}
          nativeFeedbackRippleColor="rgba(0,0,0,0)"
          textStyle={{ color: Colors.tintColor, fontSize: 15 }}
          textContainerStyle={{ height: 'auto' }}>
          <Icon
            type="MaterialCommunityIcons"
            name="calendar-remove"
            style={styles.contactFABIcon}
          />
        </ActionButton.Item>
      </ActionButton>
    );
  };

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
            ...prevState.contact,
            [prevState.selectedReasonStatus.key]: prevState.selectedReasonStatus.value,
          },
        };
      } else {
        // Revert selectedReasonStatus to current cotnact reasonStatus
        newState = {
          ...state,
          ...newState,
          selectedReasonStatus: {
            key: `reason_${state.contact.overall_status}`,
            value: state.contact[`reason_${state.contact.overall_status}`],
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
                      dispatch(removeUserToShare(state.contact.ID, item.value));
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
                      dispatch(addUserToShare(state.contact.ID, parseInt(item.value)));
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
                {contactSettings.fields[`reason_${state.contact.overall_status}`].name}
              </Text>
              <Text style={{ marginBottom: 20 }}>
                {contactSettings.fields[`reason_${state.contact.overall_status}`].description}
              </Text>
              <Text style={{ marginBottom: 20 }}>{i18n.t('global.chooseOption')}:</Text>
              <View style={styles.contactTextRoundField}>
                <Picker
                  selectedValue={state.selectedReasonStatus.value}
                  onValueChange={(value) => {
                    setState({
                      ...state,
                      selectedReasonStatus: {
                        key: `reason_${state.contact.overall_status}`,
                        value,
                      },
                    });
                  }}>
                  {renderReasonStatusPickerItems(
                    contactSettings.fields[`reason_${state.contact.overall_status}`].values,
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
                  dispatch(deleteComment(state.contact.ID, state.commentDialog.data.ID));
                  onCloseCommentDialog();
                }}>
                <Text style={{ color: Colors.buttonText }}>{i18n.t('global.delete')}</Text>
              </Button>
            ) : (
              <Button
                block
                style={styles.dialogButton}
                onPress={() => {
                  dispatch(saveComment(state.contact.ID, state.commentDialog.data));
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

  // TODO: componentize as NewRecord?
  const NewContact = () => {
    return (
      <KeyboardAwareScrollView
        enableAutomaticScroll
        enableOnAndroid
        keyboardOpeningTime={0}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled">
        {!isConnected && <OfflineBar />}
        <View style={styles.formContainer}>
          <CustomView state={state} fields={renderCreationFields(contactSettings)} create />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  // TODO: move to it's own component
  const Tabs = () => {
    return (
      <TabView
        lazy
        navigationState={state.tabViewConfig}
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
          const tile = contactSettings.tiles.find((tile) => tile.label === route.title);
          if (route.key === 'comments') {
            if (state.showFilterView) {
              return renderFilterCommentsView();
            } else {
              return renderAllCommentsView();
            }
          }
          return <CustomView state={state} fields={tile.fields} />;
        }}
        renderLazyPlaceholder={({ route }) => {
          return null;
        }}
        onIndexChange={tabChanged}
        initialLayout={{ width: windowWidth }}
      />
    );
  };

  // TODO: componentize as ExistingRecord?
  const ExistingContact = () => {
    return (
      <>
        {!isConnected && <OfflineBar />}
        <Tabs />
        {true && state.tabViewConfig?.index !== state.tabViewConfig?.routes?.length - 1 && <FAB />}
      </>
    );
  };
  //{state.onlyView && state.tabViewConfig?.index !== state.tabViewConfig?.routes?.length-1 && (

  // TODO: componentize?
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

  // TODO:
  const isAddNewContact = false;
  return (
    <>
      {isAddNewContact ? <NewContact /> : <ExistingContact />}
      <Modals />
    </>
  );
};

/*
ContactDetailScreen.propTypes = {
*/
export default ContactDetailScreen;
