import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  ScrollView,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
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

import {
  Button,
  DatePicker,
  Label,
  Input,
  Icon,
  Picker,
  //Tab,
  //Tabs,
  //ScrollableTab,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

// TODO: upgrade
//import { NavigationActions, StackActions } from 'react-navigation';
//import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// TODO: use Native Base?
import ActionButton from 'react-native-action-button';
// TODO: use Native Base?
import { Chip, Selectize } from 'react-native-material-selectize';
// TODO: use Native Base?
import { TabView, TabBar } from 'react-native-tab-view';

import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MentionsTextInput from 'react-native-mentions';
import ParsedText from 'react-native-parsed-text';

import CustomView from 'components/CustomView';
import ActionModal from 'components/ActionModal';
import OfflineBar from 'components/OfflineBar';
import HeaderLeft from 'components/HeaderLeft';
import HeaderRight from 'components/HeaderRight';
import KebabMenu from 'components/KebabMenu';

import utils from 'utils';
import {
  saveGroup,
  getById,
  getCommentsByGroup,
  saveComment,
  getActivitiesByGroup,
  getByIdEnd,
  searchLocations,
  deleteComment,
  loadingFalse,
  updatePrevious,
  getShareSettings,
  addUserToShare,
  removeUserToShare,
} from 'store/actions/groups.actions';

import { updatePrevious as updatePreviousContacts } from 'store/actions/contacts.actions';

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
  baptismIcon,
  bibleStudyIcon,
  communionIcon,
  fellowShipIcon,
  givingIcon,
  prayerIcon,
  praiseIcon,
  leadersIcon,
  circleIcon,
  dottedCircleIcon,
  swimmingPoolIcon,
  groupCircleIcon,
  groupDottedCircleIcon,
  groupChildIcon,
  groupParentIcon,
  groupPeerIcon,
  groupTypeIcon,
  footprint,
} from 'constants/Icons';

import i18n from 'languages';
import helpers from 'helpers';
import { getRoutes, renderCreationFields } from 'helpers';

import { styles } from './GroupDetailScreen.styles';

const GroupDetailScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const route = useRoute();
  console.log(JSON.stringify(route));

  let keyboardDidShowListener, keyboardDidHideListener, focusListener, hardwareBackPressListener;
  //const hasNotch = Platform.OS === 'android' && StatusBar.currentHeight > 25;
  //const extraNotchHeight = hasNotch ? StatusBar.currentHeight : 0;
  const isIOS = Platform.OS === 'ios';
  /* eslint-disable */
  let commentsFlatListRef, addMembersSelectizeRef;
  /* eslint-enable */
  const userData = useSelector((state) => state.userReducer.userData);
  const userReducerError = useSelector((state) => state.userReducer.error);
  const users = useSelector((state) => state.usersReducer.users);
  const group = useSelector((state) => state.groupsReducer.group);
  const comments = useSelector((state) => state.groupsReducer.comments);
  const totalComments = useSelector((state) => state.groupsReducer.totalComments);
  const loadingComments = useSelector((state) => state.groupsReducer.loadingComments);
  const activities = useSelector((state) => state.groupsReducer.activities);
  const totalActivities = useSelector((state) => state.groupsReducer.totalActivities);
  const loadingActivities = useSelector((state) => state.groupsReducer.loadingActivities);
  const newComment = useSelector((state) => state.groupsReducer.newComment);
  const groupsReducerError = useSelector((state) => state.groupsReducer.error);
  const loading = useSelector((state) => state.groupsReducer.loading);
  const saved = useSelector((state) => state.groupsReducer.saved);
  const isConnected = useSelector((state) => state.networkConnectivityReducer.isConnected);
  const groupSettings = useSelector((state) => state.groupsReducer.settings);
  const foundGeonames = useSelector((state) => state.groupsReducer.foundGeonames);
  const groupsList = useSelector((state) => state.groupsReducer.groups);
  const contactsList = useSelector((state) => state.contactsReducer.contacts);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const previousGroups = useSelector((state) => state.groupsReducer.previousGroups);
  const previousContacts = useSelector((state) => state.contactsReducer.previousContacts);
  const questionnaires = useSelector((state) => state.questionnaireReducer.questionnaires);
  const loadingShare = useSelector((state) => state.groupsReducer.loadingShare);
  const shareSettings = useSelector((state) => state.groupsReducer.shareSettings);
  const savedShare = useSelector((state) => state.groupsReducer.savedShare);
  const tags = useSelector((state) => state.contactsReducer.tags);

  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;
  const spacing = windowWidth * 0.025;
  const sideSize = windowWidth - 2 * spacing;

  const initialState = {
    group: {},
    unmodifiedGroup: {},
    onlyView: false,
    loadedLocal: false,
    comment: '',
    users: [],
    usersContacts: [],
    geonames: [],
    peopleGroups: [],
    groups: [],
    comments: {
      data: [],
      pagination: {
        limit: 10,
        offset: 0,
        total: 0,
      },
    },
    loadComments: false,
    loadMoreComments: false,
    activities: {
      data: [],
      pagination: {
        limit: 10,
        offset: 0,
        total: 0,
      },
    },
    loadActivities: false,
    loadMoreActivities: false,
    showAssignedToModal: false,
    groupStatusBackgroundColor: '#ffffff',
    loading: false,
    tabViewConfig: {
      index: 0,
      routes: [
        /*...tabViewRoutes*/
      ],
    },
    updateMembersList: false,
    foundGeonames: [],
    footerLocation: 0,
    footerHeight: 0,
    nameRequired: false,
    executingBack: false,
    keyword: '',
    suggestedUsers: [],
    height: utils.commentFieldMinHeight,
    groupCoachContacts: [],
    unmodifiedGroupCoachContacts: [],
    parentGroups: [],
    unmodifiedParentGroups: [],
    peerGroups: [],
    unmodifiedPeerGroups: [],
    childGroups: [],
    unmodifiedChildGroups: [],
    membersContacts: [],
    unmodifiedMembersContacts: [],
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
  };

  const [state, setState] = useState({
    ...initialState,
    group,
    //onlyView: true,
    tabViewConfig: {
      ...initialState.tabViewConfig,
      routes: getRoutes(groupSettings),
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
        const id = group?.ID;
        if (domain && id) {
          Linking.openURL(`https://${domain}/groups/${id}/`);
        } else {
          showToast(i18n.t('global.error.recordData'), true);
        }
      },
    },
  ];

  useLayoutEffect(() => {
    const title = route.params?.groupName ?? i18n.t('groupDetailScreen.addNewGroup');
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

  useEffect(() => {
    //onLoad();
    const { params } = route;
    const groupId = params.groupId;
    dispatch(getById(groupId));
    /*
    onRefreshCommentsActivities(groupId, true);
    dispatch(getShareSettings(groupId));
    if (state.showShareView) {
      toggleShareView();
    }
    */
  }, []);

  const getStorageItemAsync = async (stateKey, storageKey) => {
    const item = await ExpoFileSystemStorage.getItem(storageKey);
    if (item !== null) {
      state[stateKey] = JSON.parse(item);
      setState(state);
    } else {
      console.log('*** UNABLE TO RETRIEVE STORAGE LIST ***');
      // TODO:
      console.warn('*** UNABLE TO RETRIEVE STORAGE LIST ***');
    }
  };

  // TODO: explain
  useEffect(() => {
    if (state.users === null) getStorageItemAsync('users', 'usersList');
    if (state.geonames === null) getStorageItemAsync('geonames', 'locationsList');
    if (state.peopleGroups === null) getStorageItemAsync('peopleGroups', 'peopleGroupsList');
  }, []);

  // TODO: explain
  useEffect(() => {
    if (groupsList !== null && contactsList !== null && users !== null) {
      const mappedGroups = groupsList.map((group) => {
        return {
          name: group.title,
          value: group.ID,
        };
      });
      const mappedUserContacts = contactsList.map((contact) => {
        return {
          name: contact.title,
          value: contact.ID,
          avatarUri: null,
        };
      });
      const mappedUsersContacts = users.map((user) => {
        return {
          name: user.name,
          value: String(user.contact_id),
          avatarUri: user.avatar,
        };
      });
      const mappedUsers = users.map((user) => {
        return {
          key: user.ID,
          label: user.name,
        };
      });
      setState({
        ...state,
        users: mappedUsers,
        usersContacts: [...mappedContacts, ...mappedUsersContacts],
        groups: mappedGroups,
      });
    }
  }, [groupsList, contactsList, users]);

  /*
  componentDidMount() {
    onLoad();

    // Add afterBack param to execute 'parents' functions (ContactsView, NotificationsView)
    if (!navigation.state.params.afterBack) {
      params = {
        ...params,
        afterBack: afterBack,
      };
    }
    navigation.setParams(params);

    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow,
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );
    focusListener = navigation.addListener('didFocus', () => {
      //Focus on 'detail mode' (going back or open detail view)
      if (groupIsCreated()) {
        dispatch(loadingFalse());
        onRefresh(navigation.state.params.groupId, true);
      }
    });
    // Android bottom back button listener
    hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.state.params.backButtonTap();
      return true;
    });
  }

  componentDidCatch(error, errorInfo) {}

  componentWillUnmount() {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
    focusListener.remove();
    hardwareBackPressListener.remove();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      group,
      loading,
      comments,
      loadingComments,
      activities,
      loadingActivities,
      foundGeonames,
      isConnected,
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
      group: prevState.group,
      unmodifiedGroup: prevState.unmodifiedGroup,
    };

    // SAVE / GET BY ID
    if (group) {
      newState = {
        ...newState,
        group: {
          ...group,
        },
        unmodifiedGroup: {
          ...group,
        },
      };
      if (newState.group.group_status) {
        newState = {
          ...newState,
          groupStatusBackgroundColor: utils.getSelectorColor(newState.group.group_status),
        };
      }
      if (newState.group.location_grid) {
        newState.group.location_grid.values.forEach((location) => {
          const foundLocation = newState.geonames.find(
            (geoname) => geoname.value === location.value,
          );
          if (!foundLocation) {
            // Add non existent group location in the geonames list to avoid null exception
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
      if (newState.group.members) {
        // Add member names to list in OFFLINE mode
        if (!isConnected) {
          let membersList = newState.group.members.values.map((member) => {
            if (!member.name) {
              member = {
                ...member,
                name: safeFind(
                  newState.usersContacts.find((user) => user.value === member.value),
                  'name',
                ),
              };
            }
            return member;
          });
          newState = {
            ...newState,
            group: {
              ...newState.group,
              members: {
                values: [...membersList],
              },
            },
            unmodifiedGroup: {
              ...newState.group,
              members: {
                values: [...membersList],
              },
            },
          };
        }
        newState = {
          ...newState,
          updateMembersList: !newState.updateMembersList,
        };

        // Clear collection
        newState = {
          ...newState,
          membersContacts: [],
        };

        newState.group.members.values.forEach((member) => {
          const foundMember = newState.usersContacts.find(
            (contact) => contact.value === member.value,
          );
          if (!foundMember) {
            // Add non existent member contact in members list (user does not have access permission to contact/s)
            newState = {
              ...newState,
              membersContacts: [
                ...newState.membersContacts,
                {
                  name: member.name,
                  value: member.value,
                },
              ],
              unmodifiedMembersContacts: [
                ...newState.unmodifiedMembersContacts,
                {
                  name: member.name,
                  value: member.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.coaches) {
        // Clear collection
        newState = {
          ...newState,
          groupCoachContacts: [],
        };

        newState.group.coaches.values.forEach((coachContact) => {
          const foundCoachContact = newState.usersContacts.find(
            (user) => user.value === coachContact.value,
          );
          if (!foundCoachContact) {
            // Add non existent coach contact in usersContacts list (user does not have access permission to contacts)
            newState = {
              ...newState,
              groupCoachContacts: [
                ...newState.groupCoachContacts,
                {
                  name: coachContact.name,
                  value: coachContact.value,
                },
              ],
              unmodifiedGroupCoachContacts: [
                ...newState.unmodifiedGroupCoachContacts,
                {
                  name: coachContact.name,
                  value: coachContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.parent_groups) {
        // Clear collection
        newState = {
          ...newState,
          parentGroups: [],
        };

        newState.group.parent_groups.values.forEach((parentGroup) => {
          const foundParentGroup = newState.groups.find(
            (groups) => groups.value === parentGroup.value,
          );
          if (!foundParentGroup) {
            // Add non existent parent group in groups list (user does not have access permission to group/s)
            newState = {
              ...newState,
              parentGroups: [
                ...newState.parentGroups,
                {
                  name: parentGroup.name,
                  value: parentGroup.value,
                },
              ],
              unmodifiedParentGroups: [
                ...newState.unmodifiedParentGroups,
                {
                  name: parentGroup.name,
                  value: parentGroup.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.peer_groups) {
        // Clear collection
        newState = {
          ...newState,
          peerGroups: [],
        };

        newState.group.peer_groups.values.forEach((peerGroup) => {
          const foundPeerGroup = newState.groups.find((groups) => groups.value === peerGroup.value);
          if (!foundPeerGroup) {
            // Add non existent peer group in groups list (user does not have access permission to group/s)
            newState = {
              ...newState,
              peerGroups: [
                ...newState.peerGroups,
                {
                  name: peerGroup.name,
                  value: peerGroup.value,
                },
              ],
              unmodifiedPeerGroups: [
                ...newState.unmodifiedPeerGroups,
                {
                  name: peerGroup.name,
                  value: peerGroup.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.child_groups) {
        // Clear collection
        newState = {
          ...newState,
          childGroups: [],
        };

        newState.group.child_groups.values.forEach((childGroup) => {
          const foundChildGroup = newState.groups.find(
            (groups) => groups.value === childGroup.value,
          );
          if (!foundChildGroup) {
            // Add non existent child group in groups list (user does not have access permission to group/s)
            newState = {
              ...newState,
              childGroups: [
                ...newState.childGroups,
                {
                  name: childGroup.name,
                  value: childGroup.value,
                },
              ],
              unmodifiedChildGroups: [
                ...newState.unmodifiedChildGroups,
                {
                  name: childGroup.name,
                  value: childGroup.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.assigned_to) {
        // Clear collection
        newState = {
          ...newState,
          assignedToContacts: [],
        };

        let foundAssigned = newState.users.find(
          (user) => user.key === newState.group.assigned_to.key,
        );
        if (!foundAssigned) {
          // Add non existent group to list (user does not have access permission to groups)
          newState = {
            ...newState,
            assignedToContacts: [
              ...newState.assignedToContacts,
              {
                label: newState.group.assigned_to.label,
                key: newState.group.assigned_to.key,
              },
            ],
            unmodifedAssignedToContacts: [
              ...newState.unmodifedAssignedToContacts,
              {
                label: newState.group.assigned_to.label,
                key: newState.group.assigned_to.key,
              },
            ],
          };
        }
      }
    }

    // GET COMMENTS
    if (comments) {
      if (
        navigation.state.params.groupId &&
        Object.prototype.hasOwnProperty.call(comments, navigation.state.params.groupId)
      ) {
        // NEW COMMENTS (PAGINATION)
        if (comments[navigation.state.params.groupId].pagination.offset > 0) {
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
            ...comments[navigation.state.params.groupId],
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

    // GET ACTIVITITES
    if (activities) {
      if (
        navigation.state.params.groupId &&
        Object.prototype.hasOwnProperty.call(activities, navigation.state.params.groupId)
      ) {
        // NEW ACTIVITIES (PAGINATION)
        if (activities[navigation.state.params.groupId].pagination.offset > 0) {
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
            ...activities[navigation.state.params.groupId],
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
        navigation.state.params.groupId &&
        Object.prototype.hasOwnProperty.call(shareSettings, navigation.state.params.groupId)
      ) {
        newState = {
          ...newState,
          sharedUsers: shareSettings[navigation.state.params.groupId],
        };
      }
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {
      userReducerError,
      group,
      navigation,
      newComment,
      groupsReducerError,
      saved,
      savedShare,
    } = 

    // NEW COMMENT
    if (newComment && prevProps.newComment !== newComment) {
      commentsFlatListRef.scrollToOffset({ animated: true, offset: 0 });
      setComment('');
    }

    // GROUP SAVE / GET BY ID
    if (group && prevProps.group !== group) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Same offline group created in DB (AutoID to DBID)
      if (
        (Object.prototype.hasOwnProperty.call(group, 'ID') &&
          !Object.prototype.hasOwnProperty.call(state.group, 'ID')) ||
        (Object.prototype.hasOwnProperty.call(group, 'ID') &&
          group.ID.toString() === state.group.ID.toString()) ||
        (Object.prototype.hasOwnProperty.call(group, 'oldID') &&
          group.oldID === state.group.ID.toString())
      ) {
        // Highlight Updates -> Compare state.group with group and show differences
        navigation.setParams({ groupName: group.name, groupId: group.ID });
        dispatch(getByIdEnd());
        // Add group to 'previousGroups' array on creation
        if (
          !previousGroups.find(
            (previousGroup) => parseInt(previousGroup.groupId) === parseInt(group.ID),
          )
        ) {
          dispatch(updatePrevious([
            ...previousGroups,
            {
              groupId: parseInt(group.ID),
              onlyView: true,
              groupName: group.name,
            },
          ]));
        }
      }
    }

    // Share Contact with user
    if (savedShare && prevProps.savedShare !== savedShare) {
      // Highlight Updates -> Compare state.group with current group and show differences
      onRefreshCommentsActivities(state.group.ID, true);
      helpers.showToast(i18n.t('global.success.save'));
    }

    // GROUP SAVE
    if (saved && prevProps.saved !== saved) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Sane offline group created in DB (AutoID to DBID)
      if (
        (typeof group.ID !== 'undefined' && typeof state.group.ID === 'undefined') ||
        (group.ID && group.ID.toString() === state.group.ID.toString()) ||
        (group.oldID && group.oldID === state.group.ID.toString())
      ) {
        // Highlight Updates -> Compare state.group with contact and show differences
        onRefreshCommentsActivities(group.ID, true);
        helpers.showToast(i18n.t('global.success.save'));
        onDisableEdit();
      }
    }

    // ERROR
    const usersError = prevProps.userReducerError !== userReducerError && userReducerError;
    let groupsError = prevProps.groupsReducerError !== groupsReducerError;
    groupsError = groupsError && groupsReducerError;
    if (usersError || groupsError) {
      const error = userReducerError || groupsReducerError;
      helpers.showToast(`${ error.code }: ${ error.message }`, true);
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

  // TODO: use ? operator and remove
  const safeFind = (found, prop) => {
    if (typeof found === 'undefined') return '';
    return found[prop];
  };

  // OK, move to helpers?
  const keyboardDidShow = (event) => {
    // + extraNotchHeight
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

  // TODO: merge with Contact and move to helpers
  const backButtonTap = () => {
    let { params } = navigation.state;
    if (params.hideTabBar) {
      setState(
        ...state,
        {
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

  // TODO: specific to Group or merge with Contact and move to helpers?
  const afterBack = () => {
    let newPreviousGroups = [...previousGroups];
    newPreviousGroups.pop();
    dispatch(updatePrevious(newPreviousGroups));
    if (newPreviousGroups.length > 0) {
      dispatch(loadingFalse());
      let currentParams = {
        ...newPreviousGroups[newPreviousGroups.length - 1],
      };
      setState({
        ...state,
        group: {
          ID: currentParams.groupId,
          name: currentParams.groupName,
          group_type: 'group',
        },
        groupStatusBackgroundColor: '#ffffff',
      });
      navigation.setParams({
        ...currentParams,
      });
      onRefresh(currentParams.groupId, true);
    } else if (navigation.state.params.fromNotificationView) {
      /*
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'GroupList' })],
      });
      navigation.dispatch(resetAction);
      navigation.navigate('NotificationList');
      */
    } else {
      navigation.goBack();
      // Prevent error when view loaded from ContactDetailScreen.js
      if (typeof navigation.state.params.onGoBack === 'function') {
        navigation.state.params.onGoBack();
      }
    }
  };

  // TODO: ?? delete or merge with Contact
  const groupIsCreated = () => {
    return Object.prototype.hasOwnProperty.call(navigation.state.params, 'groupId');
  };

  // TODO: ?? delete or merge with Contact
  const onLoad = () => {
    /*
    const { groupId, onlyView, groupName } = navigation.state.params;
    let newState = {};
    if (groupIsCreated()) {
      newState = {
        ...state,
        group: {
          ...state.group,
          ID: groupId,
          name: groupName,
          group_type: 'group',
        },
      };
      navigation.setParams({ groupName });
    } else {
      newState = {
        ...state,
        group: {
          name: null,
          group_type: 'group',
        },
      };
      navigation.setParams({ hideTabBar: true });
    }
    if (onlyView) {
      newState = {
        ...state,
        ...newState,
        onlyView,
      };
    }
    setState(newState, () => {
      getLists();
    });
    */
  };

  // TODO: leave this specific to each Module?
  const onRefresh = (groupId, forceRefresh = false) => {
    if (!state.loading || forceRefresh) {
      dispatch(getById(groupId));
      onRefreshCommentsActivities(groupId, true);
      dispatch(getShareSettings(groupId));
      if (state.showShareView) {
        toggleShareView();
      }
    }
  };

  // TODO: move to helpers?
  const onRefreshCommentsActivities = (groupId, resetPagination = false) => {
    getGroupComments(groupId, resetPagination);
    getGroupActivities(groupId, resetPagination);
  };

  // TODO: move to helpers?
  const getGroupComments = (groupId, resetPagination = false) => {
    if (isConnected) {
      if (resetPagination) {
        dispatch(
          getCommentsByGroup(groupId, {
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
          dispatch(getCommentsByGroup(groupId, state.comments.pagination));
        }
      }
    }
  };

  // TODO: move to helpers?
  const getGroupActivities = (groupId, resetPagination = false) => {
    if (isConnected) {
      if (resetPagination) {
        dispatch(
          getActivitiesByGroup(groupId, {
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
          dispatch(getActivitiesByGroup(groupId, state.activities.pagination));
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
        onlyView: false,
        tabViewConfig: {
          ...prevState.tabViewConfig,
          index: indexFix,
          routes: getRoutes(groupSettings).filter(
            (route) => route.key !== 'comments', // && route.key !== 'other',
          ),
        },
      };
    });
    navigation.setParams({
      hideTabBar: true,
      onlyView: false,
      groupName: state.group.name,
    });
  };

  // TODO: move to helpers
  const onDisableEdit = () => {
    const {
      unmodifiedGroup,
      unmodifiedGroupCoachContacts,
      unmodifiedParentGroups,
      unmodifiedPeerGroups,
      unmodifiedChildGroups,
      unmodifiedMembersContacts,
      unmodifedAssignedToContacts,
    } = state;
    setState((prevState) => {
      // Set correct index in Tab position according to view mode and current tab position
      let indexFix = prevState.tabViewConfig.index;
      return {
        onlyView: true,
        group: {
          ...unmodifiedGroup,
        },
        groupStatusBackgroundColor: utils.getSelectorColor(unmodifiedGroup.group_status),
        tabViewConfig: {
          ...prevState.tabViewConfig,
          index: indexFix,
          routes: getRoutes(groupSettings),
        },
        groupCoachContacts: [...unmodifiedGroupCoachContacts],
        parentGroups: [...unmodifiedParentGroups],
        peerGroups: [...unmodifiedPeerGroups],
        childGroups: [...unmodifiedChildGroups],
        membersContacts: [...unmodifiedMembersContacts],
        assignedToContacts: [...unmodifedAssignedToContacts],
      };
    });
    navigation.setParams({ hideTabBar: false, onlyView: true });
  };

  // TODO: merge with 'setContactStatus'? and move to helpers? bc Field and FieldValue
  const setGroupStatus = (value) => {
    let newColor = '';
    if (value === 'inactive') {
      newColor = '#d9534f';
    } else if (value === 'active') {
      newColor = '#5cb85c';
    } else if (value === 'paused') {
      newColor = '#f0ad4e';
    }
    setState((prevState) => ({
      ...state,
      group: {
        ...prevState.group,
        group_status: value,
      },
      groupStatusBackgroundColor: newColor,
    }));
  };

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

  const goToContactDetailScreen = (contactID, name) => {
    dispatch(
      updatePreviousContacts([
        {
          contactId: contactID,
          onlyView: true,
          contactName: name,
        },
      ]),
    );
    navigation.navigate('ContactDetail', {
      contactId: contactID,
      onlyView: true,
      contactName: name,
    });
  };

  const getSelectizeItems = (groupList, localList) => {
    const items = [];
    if (groupList) {
      groupList.values.forEach((listItem) => {
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

  const onCheckExistingHealthMetric = (metricName) => {
    const healthMetrics = state.group.health_metrics ? [...state.group.health_metrics.values] : [];
    // get healthMetrics that exist in the list and are not deleted
    const foundhealthMetric = healthMetrics.some(
      (healthMetric) => healthMetric.value === metricName && !healthMetric.delete,
    );
    return foundhealthMetric;
  };

  const onHealthMetricChange = (metricName) => {
    const healthMetrics = state.group.health_metrics ? [...state.group.health_metrics.values] : [];
    const foundhealthMetric = healthMetrics.find((metric) => metric.value === metricName);
    if (foundhealthMetric) {
      const healthMetricIndex = healthMetrics.indexOf(foundhealthMetric);
      if (foundhealthMetric.delete) {
        const healthMetricModified = {
          ...foundhealthMetric,
        };
        delete healthMetricModified.delete;
        healthMetrics[healthMetricIndex] = healthMetricModified;
      } else {
        healthMetrics[healthMetricIndex] = {
          ...foundhealthMetric,
          delete: true,
        };
      }
    } else {
      healthMetrics.push({
        value: metricName,
      });
    }
    setState((prevState) => ({
      ...state,
      group: {
        ...prevState.group,
        health_metrics: {
          values: healthMetrics,
        },
      },
    }));
  };

  const setComment = (value) => {
    setState({
      ...state,
      comment: value,
    });
  };

  const onAddMember = (selectedValue) => {
    setState((prevState) => {
      let previousMembers = prevState.group.members ? prevState.group.members.values : [];
      return {
        group: {
          ...prevState.group,
          members: {
            values: [
              ...previousMembers,
              {
                name: safeFind(
                  prevState.usersContacts.find((user) => user.value === selectedValue.value),
                  'name',
                ), // Show name in list while request its processed
                value: selectedValue.value,
              },
            ],
          },
        },
      };
    });
  };

  const onRemoveMember = (selectedValue) => {
    const foundMember = state.group.members.values.find(
      (member) => member.value === selectedValue.value,
    );
    if (foundMember) {
      let membersListCopy = [...state.group.members.values];
      const foundMemberIndex = membersListCopy.indexOf(foundMember);
      membersListCopy.splice(foundMemberIndex, 1);
      let foundMemberContactIndex = state.membersContacts.findIndex(
        (memberContact) => memberContact.value === selectedValue.value,
      );
      let membersContacts = [...state.membersContacts];
      if (foundMemberContactIndex > -1) {
        membersContacts.splice(foundMemberContactIndex, 1);
      }
      setState((prevState) => ({
        ...state,
        group: {
          ...prevState.group,
          members: {
            values: [...membersListCopy],
          },
        },
        // Remove member contact from list
        membersContacts: membersContacts,
      }));
    }
  };

  const onSetLeader = (selectedValue) => {
    let leadersListCopy = state.group.leaders ? [...state.group.leaders.values] : [];
    const foundLeaderIndex = leadersListCopy.findIndex(
      (leader) => leader.value === selectedValue.value,
    );
    if (foundLeaderIndex > -1) {
      // 3 Remove leader 'deletion'
      if (leadersListCopy[foundLeaderIndex].delete) {
        leadersListCopy[foundLeaderIndex] = {
          ...selectedValue,
          delete: false,
        };
      } else {
        // 2 Delete leader
        leadersListCopy[foundLeaderIndex] = {
          ...selectedValue,
          delete: true,
        };
      }
    } else {
      // 1 Add leader
      leadersListCopy.push(selectedValue);
    }
    setState((prevState) => ({
      ...state,
      group: {
        ...prevState.group,
        leaders: {
          values: [...leadersListCopy],
        },
      },
    }));
  };

  const getSelectizeValuesToSave = (dbData, selectedValues) => {
    const dbItems = [...dbData];
    let localItems = [...selectedValues];
    const itemsToSave = localItems
      .filter((localItem) => {
        const foundLocalInDatabase = dbItems.find((dbItem) => dbItem.value === localItem.value);
        return foundLocalInDatabase === undefined;
      })
      .map((localItem) => ({ value: localItem.value }));

    dbItems.forEach((dbItem) => {
      const foundDatabaseInLocal = localItems.find((localItem) => dbItem.value === localItem.value);
      if (!foundDatabaseInLocal) {
        itemsToSave.push({
          ...dbItem,
          delete: true,
        });
      }
    });

    return itemsToSave;
  };

  // TODO: possible to merge any of this with Contact?
  // only diff in most cases is state.group vs state.contact
  const onSaveGroup = (quickAction = {}) => {
    setState(
      ...state,
      {
        nameRequired: false,
      },
      () => {
        Keyboard.dismiss();
        if (state.group.name && state.group.name.length > 0) {
          const { unmodifiedGroup } = state;
          let groupToSave = {
            ...state.group,
          };
          if (
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_scheduled') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_postponed') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_complete')
          ) {
            groupToSave = {
              ...groupToSave,
              ...quickAction,
            };
          } else {
            // if property exist, get from json, otherwise, send empty array
            if (addMembersSelectizeRef) {
              groupToSave = {
                ...groupToSave,
                members: {
                  values: getSelectizeValuesToSave(
                    unmodifiedGroup.members ? unmodifiedGroup.members.values : [],
                    groupToSave.members ? groupToSave.members.values : [],
                  ),
                },
              };
            }
          }
          groupToSave = {
            ...utils.diff(unmodifiedGroup, groupToSave),
            name: state.group.name,
          };
          //After 'utils.diff()' method, ID is removed, then we add it again
          if (Object.prototype.hasOwnProperty.call(state.group, 'ID')) {
            groupToSave = {
              ...groupToSave,
              ID: state.group.ID,
            };
          }
          if (groupToSave.assigned_to) {
            // TODO: is a (hopefully temprorary workaround)
            // ref: 'setGroupCustomFieldValue' method AND "case 'user_select':"
            const assignedTo = groupToSave.assigned_to;
            const assignedToID = assignedTo.hasOwnProperty('key') ? assignedTo.key : assignedTo;
            groupToSave = {
              ...groupToSave,
              assigned_to: `user-${assignedToID}`,
            };
          }
          dispatch(saveGroup(groupToSave));
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

  const formatActivityDate = (comment) => {
    let baptismDateRegex = /\{(\d+)\}+/;
    if (baptismDateRegex.test(comment)) {
      comment = comment.replace(baptismDateRegex, (match, timestamp) =>
        utils.formatDateToView(timestamp * 1000),
      );
    }
    return comment;
  };

  const onSaveComment = () => {
    const { comment } = state;
    if (!state.loadComments) {
      if (comment.length > 0) {
        Keyboard.dismiss();
        dispatch(saveComment(state.group.ID, { comment }));
      }
    }
  };

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

  const onUpdateComment = (commentData) => {
    dispatch(saveComment(state.group.ID, commentData));
    onCloseCommentDialog();
  };

  const onDeleteComment = (commentData) => {
    dispatch(deleteComment(state.group.ID, commentData.ID));
    onCloseCommentDialog();
  };

  const goToGroupDetailScreen = (groupID, name) => {
    /* eslint-disable */
    // Save new group in 'previousGroups' array
    if (!previousGroups.find((previousGroup) => previousGroup.groupId === groupID)) {
      // Add contact to 'previousGroups' array on creation
      dispatch(
        updatePrevious([
          ...previousGroups,
          {
            groupId: groupID,
            onlyView: true,
            groupName: name,
          },
        ]),
      );
    }
    navigation.push('GroupDetails', {
      groupId: groupID,
      onlyView: true,
      groupName: name,
      afterBack: () => afterBack(),
    });
    /* eslint-enable */
  };

  // move to Tab component
  const tabChanged = (index) => {
    // Hide tabBar when tab its in 'comments' section
    /*navigation.setParams({
      hideTabBar: (index === 2 && state.onlyView) || !state.onlyView,
    });*/
    setState((prevState) => ({
      ...state,
      tabViewConfig: {
        ...prevState.tabViewConfig,
        index,
      },
    }));
  };

  const toggleFilterView = () => {
    setState((prevState) => ({
      ...state,
      showFilterView: !prevState.showFilterView,
    }));
  };

  const resetFilters = () => {
    setState(
      ...state,
      {
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

  const toggleFilter = (value, filterName) => {
    setState((prevState) => ({
      ...state,
      filtersSettings: {
        ...prevState.filtersSettings,
        [filterName]: !value,
      },
    }));
  };

  const toggleMenu = (value, menuRef) => {
    if (value) {
      menuRef.show();
    } else {
      menuRef.hide();
    }
  };

  const toggleShareView = () => {
    setState({
      ...state,
      showShareView: !state.showShareView,
    });
  };

  const noCommentsRender = () => (
    <ScrollView
      style={styles.noCommentsContainer}
      refreshControl={
        <RefreshControl
          refreshing={state.loadComments || state.loadActivities}
          onRefresh={() => onRefreshCommentsActivities(state.group.ID, true)}
        />
      }>
      <Grid style={{ transform: [{ scaleY: -1 }] }}>
        <Col>
          <Row style={{ justifyContent: 'center' }}>
            <Image style={styles.noCommentsImage} source={dtIcon} />
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('groupDetailScreen.noGroupCommentPlaceHolder')}
            </Text>
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('groupDetailScreen.noGroupCommentPlaceHolder1')}
            </Text>
          </Row>
          {!isConnected && (
            <Row>
              <Text style={[styles.noCommentsText, { backgroundColor: '#fff2ac' }]}>
                {i18n.t('groupDetailScreen.noGroupCommentPlaceHolderOffline')}
              </Text>
            </Row>
          )}
        </Col>
      </Grid>
    </ScrollView>
  );

  const onSuggestionTap = (username, hidePanel) => {
    hidePanel();
    let comment = state.comment.slice(0, -state.keyword.length),
      mentionFormat = `@[${username.label}](${username.key})`;
    setState({
      ...state,
      suggestedUsers: [],
      comment: `${comment}${mentionFormat}`,
    });
  };

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

  const commentsView = () => {
    if (state.showFilterView) {
      return (
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
                //Component={TouchableWithoutFeedback}
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
                //Component={TouchableWithoutFeedback}
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
    } else {
      return (
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
              extraData={!state.loadMoreComments || !state.loadMoreActivities}
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
                  onRefresh={() => onRefreshCommentsActivities(state.group.ID, true)}
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
                      getGroupComments(state.group.ID);
                      getGroupActivities(state.group.ID);
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
    }
  };

  const flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  );

  const membersRow = (membersGroup) => (
    <View style={{ flex: 1 }}>
      {state.onlyView ? (
        <Grid style={{ marginTop: 10, marginBottom: 10 }}>
          <Col style={{ width: 20 }}>
            <Image
              source={footprint}
              style={[
                styles.membersLeaderIcon,
                state.group.leaders &&
                state.group.leaders.values.find((leader) => leader.value === membersGroup.value)
                  ? styles.membersIconActive
                  : styles.membersIconInactive,
              ]}
            />
          </Col>
          <Col>
            <TouchableOpacity
              onPress={() => goToContactDetailScreen(membersGroup.value, membersGroup.name)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text
                style={[
                  styles.linkingText,
                  { marginTop: 'auto', marginBottom: 'auto', padding: 5 },
                  isRTL ? { textAlign: 'left', flex: 1, marginRight: 15 } : { marginLeft: 15 },
                ]}>
                {membersGroup.name}
              </Text>
            </TouchableOpacity>
          </Col>
        </Grid>
      ) : (
        <Grid style={{ marginTop: 10, marginBottom: 10 }}>
          <Col style={{ width: 20 }}>
            <TouchableOpacity onPress={() => onSetLeader(membersGroup)} key={membersGroup.value}>
              <Image
                source={footprint}
                style={[
                  styles.membersLeaderIcon,
                  state.group.leaders &&
                  state.group.leaders.values.find(
                    (leader) => leader.value === membersGroup.value && !leader.delete,
                  )
                    ? styles.membersIconActive
                    : styles.membersIconInactive,
                ]}
              />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              onPress={() => goToContactDetailScreen(membersGroup.value, membersGroup.name)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text
                style={[
                  styles.linkingText,
                  { marginTop: 'auto', marginBottom: 'auto', padding: 5 },
                  isRTL ? { textAlign: 'left', flex: 1, marginRight: 15 } : { marginLeft: 15 },
                ]}>
                {membersGroup.name}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col style={{ width: 20 }}>
            <TouchableOpacity onPress={() => onRemoveMember(membersGroup)} key={membersGroup.value}>
              <Icon type="MaterialCommunityIcons" name="close" style={styles.membersCloseIcon} />
            </TouchableOpacity>
          </Col>
        </Grid>
      )}
    </View>
  );

  // TODO: move to FAB component
  const onSaveQuickAction = (quickActionPropertyName) => {
    /*let newActionValue = state.group[quickActionPropertyName]
      ? parseInt(state.group[quickActionPropertyName], 10) + 1
      : 1;
    if (isConnected) {
      // ONLINE mode
      onSaveGroup({
        [quickActionPropertyName]: newActionValue,
      });
    } else {
      // OFFLINE mode
    }
    */
    var comment = '';
    switch (quickActionPropertyName) {
      case 'quick_button_meeting_scheduled':
        comment = i18n.t('groupDetailScreen.fab.quick_button_meeting_scheduled');
        break;
      case 'quick_button_meeting_postponed':
        comment = i18n.t('groupDetailScreen.fab.quick_button_meeting_postponed');
        break;
      case 'quick_button_meeting_complete':
        comment = i18n.t('groupDetailScreen.fab.quick_button_meeting_complete');
        break;
      default:
        comment = '';
    }
    // TODO: temporarily save a Comment until supported by D.T as an Activity w/ count
    if (comment != '') {
      dispatch(saveComment(state.group.ID, { comment }));
      // TODO: saveComment doesn't display Toast on normal `Comments and Activities` tabView, so we mock it
      helpers.showToast(i18n.t('global.success.save'));
    }
  };

  const onMeetingComplete = () => {
    // determine whether there is an existing 'meeting_complete' questionnaire,
    // if so, proxy from Attendance to Questionnaire, else back to GroupDetails
    var isQuestionnaireEnabled = false;
    var q_id = null;
    // loop thru all (active) questionnaires, and check whether 'group'->'meeting_complete' is enabled
    questionnaires.map((questionnaire) => {
      if (
        questionnaire.trigger_type == 'group' &&
        questionnaire.trigger_value == 'meeting_complete'
      ) {
        isQuestionnaireEnabled = true;
        q_id = questionnaire.id;
      }
    });
    navigation.navigate(
      NavigationActions.navigate({
        routeName: 'Attendance',
        action: NavigationActions.navigate({
          routeName: 'Attendance',
          params: {
            userData: userData,
            group: state.group,
            q_id,
          },
        }),
      }),
    );
    /*
    navigation.navigate(
      NavigationActions.navigate({
        routeName: 'Questionnaire',
        action: NavigationActions.navigate({
          routeName: 'Question',
          params: {
            userData: userData,
            group: state.group,
            title: state.group.title,
            q_id,
          },
        }),
      }),
    );
    */
  };

  // TODO: componentize (w/ Modal?)
  const renderCommentDialog = () => (
    <View style={styles.dialogBox}>
      <Grid>
        <Row>
          {state.commentDialog.delete ? (
            <View style={styles.dialogContent}>
              <Row style={{ height: 30 }}>
                <Label style={[styles.name, { marginBottom: 5 }]}>{i18n.t('global.delete')}</Label>
              </Row>
              <Row>
                <Text style={{ fontSize: 15 }}>{state.commentDialog.data.content}</Text>
              </Row>
            </View>
          ) : (
            <View style={styles.dialogContent}>
              <Grid>
                <Row style={{ height: 30 }}>
                  <Label style={[styles.name, { marginBottom: 5 }]}>{i18n.t('global.edit')}</Label>
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
                    style={[styles.groupTextField, { height: 'auto', minHeight: 50 }]}
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
                onDeleteComment(state.commentDialog.data);
              }}>
              <Text style={{ color: Colors.buttonText }}>{i18n.t('global.delete')}</Text>
            </Button>
          ) : (
            <Button
              block
              style={styles.dialogButton}
              onPress={() => {
                onUpdateComment(state.commentDialog.data);
              }}>
              <Text style={{ color: Colors.buttonText }}>{i18n.t('global.save')}</Text>
            </Button>
          )}
        </Row>
      </Grid>
    </View>
  );

  // TODO: componentize (w/ Modal?)
  // named renderShowShareView in ContactDetails
  const renderShareView = () => (
    <View style={styles.dialogBox}>
      <Grid>
        <Row>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>
              {i18n.t('global.shareSettings')}
            </Text>
            <Text>{i18n.t('groupDetailScreen.groupSharedWith')}:</Text>
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
                    dispatch(removeUserToShare(state.group.ID, item.value));
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
                    dispatch(addUserToShare(state.group.ID, parseInt(item.value)));
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

  // TODO: move to it's own component
  const FAB = () => (
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
        buttonColor={Colors.colorWait}
        //title={groupSettings.fields.quick_button_meeting_scheduled.name}
        title={i18n.t('groupDetailScreen.fab.quick_button_meeting_scheduled')}
        onPress={() => {
          onSaveQuickAction('quick_button_meeting_scheduled');
        }}
        size={40}
        nativeFeedbackRippleColor="rgba(0,0,0,0)"
        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
        textContainerStyle={{ height: 'auto' }}>
        <Icon type="MaterialCommunityIcons" name="calendar-plus" style={styles.groupFABIcon} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor={Colors.colorYes}
        //title={groupSettings.fields.quick_button_meeting_complete.name}
        title={i18n.t('groupDetailScreen.fab.quick_button_meeting_complete')}
        onPress={() => {
          onMeetingComplete();
        }}
        size={40}
        nativeFeedbackRippleColor="rgba(0,0,0,0)"
        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
        textContainerStyle={{ height: 'auto' }}>
        <Icon type="MaterialCommunityIcons" name="calendar-check" style={styles.groupFABIcon} />
      </ActionButton.Item>
      <ActionButton.Item
        buttonColor={Colors.colorNo}
        //title={groupSettings.fields.quick_button_meeting_postponed.name}
        title={i18n.t('groupDetailScreen.fab.quick_button_meeting_postponed')}
        onPress={() => {
          onSaveQuickAction('quick_button_meeting_postponed');
        }}
        size={40}
        nativeFeedbackRippleColor="rgba(0,0,0,0)"
        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
        textContainerStyle={{ height: 'auto' }}>
        <Icon type="MaterialCommunityIcons" name="calendar-minus" style={styles.groupFABIcon} />
      </ActionButton.Item>
    </ActionButton>
  );

  // TODO: review all of this display logic
  // {state.loadedLocal && (
  // {groupIsCreated() ? (
  console.log(`state.loadedLocal: ${state.loadedLocal}`);
  //console.log(`groupIsCreated(): ${ groupIsCreated() }`);
  return (
    <View style={{ flex: 1 }}>
      {true && (
        <View style={{ flex: 1 }}>
          {true ? (
            <View style={{ flex: 1 }}>
              {!isConnected && <OfflineBar />}
              <Tabs />
              {state.onlyView &&
                state.tabViewConfig.index != state.tabViewConfig.routes.length - 1 && <FAB />}
              <ActionModal
                visible={state.commentDialog.toggle}
                onClose={(visible) => {
                  // TODO: ?
                }}
                //title={i18n.t('')}
              >
                {renderCommentDialog}
              </ActionModal>
              <ActionModal
                visible={state.showShareView}
                onClose={(visible) => {
                  // TODO: ?
                }}
                //title={i18n.t('')}
              >
                {renderShareView}
              </ActionModal>
            </View>
          ) : (
            <KeyboardAwareScrollView
              enableAutomaticScroll
              enableOnAndroid
              keyboardOpeningTime={0}
              extraScrollHeight={150}
              keyboardShouldPersistTaps="handled">
              {!isConnected && <OfflineBar />}
              <View style={styles.formContainer}>
                <CustomView state={state} fields={renderCreationFields(groupSettings)} create />
              </View>
            </KeyboardAwareScrollView>
          )}
        </View>
      )}
    </View>
  );
};
/*
GroupDetailScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onlyView: PropTypes.any,
        groupId: PropTypes.any,
        groupName: PropTypes.string,
      }),
    }),
  }).isRequired,
};
GroupDetailScreen.defaultProps = {};
*/
export default GroupDetailScreen;
