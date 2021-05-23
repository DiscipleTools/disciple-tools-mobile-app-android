import React, { useState, useEffect } from 'react';
import { View, FlatList, Pressable, RefreshControl, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Icon } from 'native-base';
import PropTypes from 'prop-types';

// Expo
import * as Contacts from 'expo-contacts';

// Helpers
import Colors from 'constants/Colors';
import i18n from 'languages';
import { showToast } from 'helpers';

// Utils
import utils from 'utils';

// Custom Hooks
import useList from 'hooks/useList.js';
import useSettings from 'hooks/useSettings.js';

// Custom Components
import SearchBar from 'components/SearchBar';
import FilterList from 'components/FilterList';
import ActionModal from 'components/ActionModal';
import OfflineBar from 'components/OfflineBar';

// TODO: use Native Base?
import ActionButton from 'react-native-action-button';

import { styles } from './ListScreen.styles';

// TODO: constants
const POST_TYPE_CONTACT = 'contacts';
const POST_TYPE_GROUP = 'groups';

const STATUS_CIRCLE_SIZE = 15;
const SWIPE_BTN_WIDTH = 80;

const ListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const isConnected = useSelector((state) => state.networkConnectivityReducer.isConnected);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  // TODO: use SWR Hooks
  const userData = useSelector((state) => state.userReducer.userData);
  const questionnaires = useSelector((state) => state.questionnaireReducer.questionnaires);

  let filters = useSelector((state) => state.usersReducer.contactFilters);
  let totalRecords = 20;
  let filteredRecords = null;

  // default to contacts type
  const [state, setState] = useState({
    moduleType: POST_TYPE_CONTACT,
    isContact: true,
    isGroup: null,
    offset: 0,
    limit: utils.paginationLimit,
    sort: '-last_modified',
    filtered: false,
    filterOption: null,
    filterText: null,
    fixFABIndex: false,
    commentsModalVisible: false,
    dataSourceContact: [],
    importContactsModalVisible: false,
    importContactsList: [],
  });

  // focus effect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const moduleType = route?.name?.toLowerCase();
      setModuleType(moduleType);
    });
    return unsubscribe;
  }, [navigation]);

  // get settings
  const { settings, error: settingsError } = useSettings(state.moduleType);
  if (settingsError) showToast(settingsError.message, true);

  // get records list
  const { records, error: recordsError } = useList(state.moduleType);
  if (recordsError) showToast(recordsError.message, true);

  let loading = !settings || !records;

  const setModuleType = (moduleType) => {
    setState({
      ...state,
      moduleType,
      isContact: moduleType === POST_TYPE_CONTACT,
      isGroup: moduleType === POST_TYPE_GROUP,
    });
  };

  const renderFooter = () => {
    return (
      <View style={styles.loadMoreFooterText}>
        {isConnected && state.offset + state.limit < totalRecords && (
          <Pressable
            onPress={() => {
              onRefresh(true);
            }}>
            <Text style={styles.loadMoreFooterText}>{i18n.t('notificationsScreen.loadMore')}</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const truncateRowChars = (displayValue) => {
    const threshold = 40;
    if (displayValue.length > threshold) {
      return displayValue.substring(0, threshold) + '...';
    }
    return displayValue;
  };

  const renderImportContactsRow = (contact) => {
    // TODO: FINISH - conditional icons
    let contactExists = contact.exists ? true : false;
    let contactPhoneDisplay = '';
    if (contact.contact_phone) {
      contactPhoneDisplay = contact.contact_phone[0].value;
      if (contact.contact_phone.length > 1) {
        contactPhoneDisplay = contactPhoneDisplay + ', ' + contact.contact_phone[1].value;
      }
    }
    let contactEmailDisplay = '';
    if (contact.contact_email) {
      contactEmailDisplay = contact.contact_email[0].value;
      if (contact.contact_email.length > 1) {
        contactEmailDisplay = contactEmailDisplay + ', ' + contact.contact_email[1].value;
      }
    }
    return (
      <Pressable
        onPress={() => {
          if (contactExists) {
            // DISPLAY MODAL TO CONFIRM NAVIGATE TO CONTACT DETAILS
            console.log('*************');
            console.log('ASK THE USER!!');
            //goToDetailsScreen(contact);
          } else {
            setState({ importContactsModalVisible: false });
            goToDetailsScreen(contact, true);
          }
        }}
        style={styles.flatListItem}
        key={contact.idx}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          <View style={{ flexDirection: 'column', flexGrow: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ textAlign: 'left', flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }}>
                {Object.prototype.hasOwnProperty.call(contact, 'name')
                  ? contact.name
                  : contact.title}
              </Text>
            </View>
            {contactPhoneDisplay.length > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.contactSubtitle,
                    {
                      textAlign: 'left',
                    },
                  ]}>
                  {truncateRowChars(contactPhoneDisplay)}
                </Text>
              </View>
            )}
            {contactEmailDisplay.length > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.contactSubtitle,
                    {
                      textAlign: 'left',
                    },
                  ]}>
                  {truncateRowChars(contactEmailDisplay)}
                </Text>
              </View>
            )}
          </View>
          <View
            style={[
              {
                flexDirection: 'column',
                width: 35,
                paddingTop: 0,
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              isRTL ? { marginRight: 5 } : { marginLeft: 5 },
            ]}>
            <Icon
              style={{ color: contactExists ? Colors.gray : Colors.tintColor }}
              type="MaterialIcons"
              name={contactExists ? 'playlist-add-check' : 'person-add'}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  //TODO{state.isGroup && (
  const Subtitles = ({ record }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={[
            // TODO: rename to just 'styles.subtitle'
            styles.contactSubtitle,
            {
              textAlign: 'left',
            },
          ]}>
          {state.isContact && (
            <>
              {settings.fields.overall_status?.values[record.overall_status]
                ? settings.fields.overall_status.values[record.overall_status].label
                : ''}
              {settings.fields.overall_status?.values[record.overall_status] &&
              settings.fields.seeker_path.values[record.seeker_path]
                ? ' • '
                : ''}
              {settings.fields.seeker_path?.values[record.seeker_path]
                ? settings.fields.seeker_path.values[record.seeker_path].label
                : ''}
            </>
          )}
          {!state.isContact && (
            <>
              {settings.fields.group_status.values[record.group_status]
                ? settings.fields.group_status.values[record.group_status].label
                : ''}
              {settings.fields.group_status.values[record.group_status] &&
              settings.fields.group_type.values[record.group_type]
                ? ' • '
                : ''}
              {settings.fields.group_type.values[record.group_type]
                ? settings.fields.group_type.values[record.group_type].label
                : ''}
              {settings.fields.group_type.values[record.group_type] && record.member_count
                ? ' • '
                : ''}
              {record.member_count ? record.member_count : ''}
            </>
          )}
        </Text>
      </View>
    );
  };

  const renderRow = (record) => {
    // TODO: better support for expanion of postTypes
    const statusValue = state.isContact ? record.overall_status : record.group_status;
    return (
      <Pressable
        onPress={() => {
          goToDetailsScreen(record);
        }}
        style={styles.rowFront}
        key={record.ID}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          <View style={{ flexDirection: 'column', flexGrow: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[{ textAlign: 'left', flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }]}>
                {Object.prototype.hasOwnProperty.call(record, 'name') ? record.name : record.title}
              </Text>
            </View>
            <Subtitles record={record} />
          </View>
          <View
            style={[
              {
                flexDirection: 'column',
                width: STATUS_CIRCLE_SIZE,
                paddingTop: 0,
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              isRTL ? { marginRight: 5 } : { marginLeft: 5 },
            ]}>
            <View
              style={{
                width: STATUS_CIRCLE_SIZE,
                height: STATUS_CIRCLE_SIZE,
                borderRadius: STATUS_CIRCLE_SIZE / 2,
                backgroundColor: utils.getSelectorColor(statusValue),
                marginTop: 'auto',
                marginBottom: 'auto',
              }}></View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderHiddenRow = (data, rowMap) => {
    const btn1Style = isRTL ? { left: SWIPE_BTN_WIDTH * 2 } : { left: 0 };
    const btn2Style = isRTL ? { left: SWIPE_BTN_WIDTH } : { left: SWIPE_BTN_WIDTH };
    const btn3Style = isRTL ? { left: 0 } : { left: SWIPE_BTN_WIDTH * 2 };
    //const btn3Style = isRTL ? { right: 0 } : { right: SWIPE_BTN_WIDTH };
    //const btn4Style = isRTL ? { right: SWIPE_BTN_WIDTH } : { right: 0 };
    return (
      <View style={styles.rowBack}>
        <Pressable
          style={[styles.backBtn, styles.backBtn1, btn1Style, { width: SWIPE_BTN_WIDTH }]}
          onPress={() => console.log('*** BUTTON 1 CLICKED ***')}>
          <Icon type="MaterialCommunityIcons" name="check" style={styles.backBtnIcon} />
          <Text style={styles.backBtnText}>Update Status</Text>
        </Pressable>
        <Pressable
          style={[styles.backBtn, styles.backBtn2, btn2Style, { width: SWIPE_BTN_WIDTH }]}
          onPress={() => {
            console.log('*** BUTTON 2 CLICKED ***');
            console.log(JSON.stringify(questionnaires));
          }}>
          <Icon type="MaterialCommunityIcons" name="calendar-check" style={styles.backBtnIcon} />
          <Text style={styles.backBtnText}>Meeting Complete</Text>
        </Pressable>
        <Pressable
          style={[styles.backBtn, styles.backBtn3, btn3Style, { width: SWIPE_BTN_WIDTH }]}
          onPress={() => {
            console.log('*** BUTTON 3 CLICKED ***');
            //setState({ ...state, commentsModalVisible: true });
          }}>
          <Icon type="MaterialCommunityIcons" name="pencil" style={styles.backBtnIcon} />
          <Text style={styles.backBtnText}>Comment</Text>
        </Pressable>
        {/*
        <Pressable
          style={[styles.backBtn, styles.backBtn4, btn4Style, { width: SWIPE_BTN_WIDTH }]}
          onPress={() => {
            console.log('*** BUTTON 4 CLICKED ***');
            //setState({ ...state, commentsModalVisible: true })
          }}>
          <Icon type="MaterialCommunityIcons" name="pencil" style={styles.backBtnIcon} />
          <Text style={styles.backBtnText}>BTN 4</Text>
        </Pressable>
        */}
      </View>
    );
  };

  const flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
        marginTop: 5,
      }}
    />
  );

  const onRefresh = (increasePagination = false, returnFromDetail = false) => {
    let newState = {
      offset: increasePagination ? state.offset + state.limit : 0,
    };
    setState(
      (prevState) => {
        return returnFromDetail ? prevState : newState;
      },
      () => {
        let filter = {};
        // Add pagination on ONLINE mode
        if (isConnected) {
          filter = {
            offset: state.offset,
            limit: state.limit,
            sort: state.sort,
          };
        }
        if (state.filtered) {
          filter = {
            ...filter,
            filtered: true,
          };
          if (state.filterOption) {
            filter = {
              ...filter,
              ...state.filterOption,
              filterOption: true,
            };
          } else if (state.filterText) {
            filter = {
              ...filter,
              name: state.filterText,
              sort: 'name',
              filterText: true,
            };
          }
        }
        dispatch(getAll(domain, token, offset, limit, sort));
      },
    );
  };

  const goToDetailsScreen = (record, isPhoneImport = false) => {
    if (state.isContact) {
      goToContactDetailScreen(record, isPhoneImport);
      return;
    }
    if (state.isGroup) {
      goToGroupDetailScreen(record);
      return;
    }
    return null;
  };

  // TODO: merge with goToGroupDetailScreen
  const goToContactDetailScreen = (contactData = null, isPhoneImport = false) => {
    if (contactData && isPhoneImport) {
      //dispatch(updatePrevious([]));
      navigation.navigate('ContactDetails', {
        onlyView: true,
        importContact: contactData,
        //onGoBack: () => onRefresh(false, true),
      });
    } else if (contactData) {
      /* TODO: ??
      dispatch(
        updatePrevious([
          {
            contactId: parseInt(contactData.ID),
            onlyView: true,
            contactName: contactData.title,
            importContact: null,
          },
        ]),
      );
      */
      // Detail
      navigation.navigate('ContactDetails', {
        contactId: contactData.ID,
        onlyView: true,
        contactName: contactData.title,
        importContact: null,
        //onGoBack: () => onRefresh(false, true),
      });
    } else {
      //dispatch(updatePrevious([]));
      // Create
      navigation.navigate('ContactDetails', {
        onlyView: true,
        importContact: null,
        //onGoBack: () => onRefresh(false, true),
      });
    }
  };

  const goToGroupDetailScreen = (groupData = null) => {
    if (groupData) {
      console.log('*** IF GROUP DATA ***');
      /* TODO: ??
      dispatch(
        updatePrevious([
          {
            groupId: parseInt(groupData.ID),
            onlyView: true,
            groupName: groupData.title,
          },
        ]),
      );
      */
      // Detail
      navigation.navigate('GroupDetails', {
        groupId: groupData.ID,
        onlyView: true,
        groupName: groupData.title,
      });
      //onGoBack: () => onRefresh(false, true),
    } else {
      console.log('*** ELSE GROUP DATA = null  ***');
      //dispatch(updatePrevious([]));
      // Create
      navigation.navigate('GroupDetails', {
        onlyView: true,
        onGoBack: () => onRefresh(false, true),
      });
    }
  };

  const selectOptionFilter = (selectedFilter) => {
    setState(
      {
        filtered: true,
        filterText: null,
        filterOption: selectedFilter,
      },
      () => {
        onRefresh(false);
      },
    );
  };

  const filterByText = utils.debounce((queryText) => {
    if (queryText.length > 0) {
      setState(
        {
          filtered: true,
          filterText: queryText,
          filterOption: null,
        },
        () => {
          onRefresh(false);
        },
      );
    } else {
      setState(
        {
          filtered: false,
          filterText: null,
          filterOption: null,
        },
        () => {
          onRefresh();
        },
      );
    }
  }, 750);

  const onLayout = (fabIndexFix) => {
    if (fabIndexFix !== state.fixFABIndex) {
      setState({
        fixFABIndex: fabIndexFix,
      });
    }
  };

  const importContactsRender = () => {
    // NOTE: Contacts are already indexed by most recently modified, so we only need to reverse the array. If ever changes, then just sort by idx (id)
    const importContactsList = state.importContactsList.reverse();
    const existingContactsList =
      state.dataSourceContact && state.dataSourceContact.length > 0 ? state.dataSourceContact : [];
    const contactsInBothLists = [];
    existingContactsList.map((existingContact) => {
      importContactsList.map((importContact) => {
        if (
          (existingContact.title &&
            importContact.title &&
            existingContact.title === importContact.title) ||
          (existingContact.title &&
            importContact.name &&
            existingContact.title === importContact.name) ||
          (existingContact.name &&
            importContact.name &&
            existingContact.name === importContact.name) ||
          (existingContact.name &&
            importContact.title &&
            existingContact.name === importContact.title)
        ) {
          importContact['exists'] = true;
          contactsInBothLists.push(importContact);
        }
      });
    });
    //console.log('*********************');
    //console.log(`IN BOTH COUNT: ${contactsInBothLists.length}`);
    //console.log(JSON.stringify(contactsInBothLists[0]));
    const importContactsFilters = {
      tabs: [
        {
          key: 'default',
          label: 'Default Filters',
          order: 1,
        },
      ],
      filters: [
        {
          ID: 'all_my_contacts',
          labels: [
            {
              id: 'all',
              name: 'All Contacts',
            },
          ],
          name: 'All Contacts',
          query: {
            sort: '-last_modified',
          },
          tab: 'default',
        },
        {
          ID: 'not_yet_imported',
          labels: [
            {
              id: 'notyet',
              name: 'Not Yet Imported',
            },
          ],
          name: 'Not Yet Imported',
          query: {
            sort: '-last_modified',
          },
          tab: 'default',
        },
        {
          ID: 'already_imported',
          labels: [
            {
              id: 'already',
              name: 'Already Imported',
            },
          ],
          name: 'Already Imported',
          query: {
            sort: '-last_modified',
          },
          tab: 'default',
        },
      ],
    };
    // TODO: use FilterList component
    return (
      <>
        <SearchBar
          filterConfig={importContactsFilters}
          onSelectFilter={selectOptionFilter}
          onTextFilter={filterByText}
          onClearTextFilter={filterByText}
          onLayout={(idx) => onLayout(idx)}
          count={importContactsList.length}
        />
        <FlatList
          data={importContactsList}
          renderItem={(item) => renderImportContactsRow(item.item)}
          ItemSeparatorComponent={flatListItemSeparator}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item) => item.index}
        />
      </>
    );
  };

  /*
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      //rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    //setListData(newData);
  };
  */

  // TODO:
  const commentsRender = () => {
    return <Text>Hello Comments</Text>;
  };

  // TODO: create FAB component
  const FAB = () => {
    return (
      <ActionButton
        style={[state.fixFABIndex ? { zIndex: -1 } : {}]}
        buttonColor={Colors.primaryRGBA}
        renderIcon={(active) =>
          active ? (
            <Icon type="MaterialIcons" name="close" style={{ color: 'white', fontSize: 22 }} />
          ) : (
            <Icon type="MaterialIcons" name="add" style={{ color: 'white', fontSize: 25 }} />
          )
        }
        degrees={0}
        activeOpacity={0}
        bgColor="rgba(0,0,0,0.5)"
        nativeFeedbackRippleColor="rgba(0,0,0,0)">
        {/* TODO: translate these new fields */}
        <ActionButton.Item
          title={'Add New Contact'}
          onPress={() => {
            goToDetailsScreen();
          }}
          size={40}
          buttonColor={Colors.tintColor}
          nativeFeedbackRippleColor="rgba(0,0,0,0)"
          textStyle={{ color: Colors.tintColor, fontSize: 15 }}
          textContainerStyle={{ height: 'auto' }}>
          <Icon type="MaterialIcons" name="add" style={styles.contactFABIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          // TODO: translate
          title={'Import Phone Contact'}
          onPress={() => {
            (async () => {
              const { status } = await Contacts.requestPermissionsAsync();
              if (status === 'granted') {
                const importContactsList = [];
                const { data } = await Contacts.getContactsAsync({});
                data.map((contact) => {
                  const contactData = {};
                  if (contact.contactType === 'person') {
                    contactData['idx'] = contact.id;
                    contactData['title'] = contact.name;
                    contactData['name'] = contact.name;
                    if (contact.hasOwnProperty('emails') && contact.emails.length > 0) {
                      contactData['contact_email'] = [];
                      contact.emails.map((email, idx) => {
                        contactData['contact_email'].push({
                          key: `contact_email_${idx}`,
                          value: email.email,
                        });
                      });
                    }
                    if (contact.hasOwnProperty('phoneNumbers') && contact.phoneNumbers.length > 0) {
                      contactData['contact_phone'] = [];
                      contact.phoneNumbers.map((phoneNumber, idx) => {
                        contactData['contact_phone'].push({
                          key: `contact_phone_${idx}`,
                          value: phoneNumber.number,
                        });
                      });
                    }
                    importContactsList.push(contactData);
                  }
                });
                setState({
                  importContactsModalVisible: true,
                  importContactsList,
                });
              }
            })();
          }}
          size={40}
          buttonColor={Colors.colorYes}
          nativeFeedbackRippleColor="rgba(0,0,0,0)"
          textStyle={{ color: Colors.tintColor, fontSize: 15 }}
          textContainerStyle={{ height: 'auto' }}>
          <Icon type="MaterialIcons" name="contact-phone" style={styles.contactFABIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {!isConnected && <OfflineBar />}
        {state.commentsModalVisible && (
          <ActionModal
            height={'40%'}
            modalVisible={state.commentsModalVisible}
            setModalVisible={(modalVisible) => setState({ commentsModalVisible: modalVisible })}
            // TODO: translate
            title={'Comments'}>
            {commentsRender()}
          </ActionModal>
        )}
        {state.importContactsModalVisible && (
          <ActionModal
            fullScreen
            modalVisible={state.importContactsModalVisible}
            setModalVisible={(modalVisible) =>
              setState({ importContactsModalVisible: modalVisible })
            }
            // TODO: translate
            title={'Import Phone Contacts'}>
            {importContactsRender()}
          </ActionModal>
        )}
        <FilterList
          settings={settings}
          data={records}
          loading={loading}
          renderRow={renderRow}
          renderHiddenRow={renderHiddenRow}
          leftOpenValue={SWIPE_BTN_WIDTH * 3}
        />
        <FAB />
      </View>
    </Container>
  );
};

ListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
ListScreen.defaultProps = {};

export default ListScreen;
