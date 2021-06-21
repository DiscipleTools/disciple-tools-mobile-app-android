import React, { useState, useEffect } from 'react';
import { Button, View, FlatList, Pressable, RefreshControl, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { Container, Icon } from 'native-base';
import PropTypes from 'prop-types';

// Expo
import * as Contacts from 'expo-contacts';

// Helpers
import Colors from 'constants/Colors';
import i18n from 'languages';
import { isIOS, showToast } from 'helpers';

// Utils
import utils from 'utils';

// Custom Hooks
import useNetworkStatus from 'hooks/useNetworkStatus';
import usePostType from 'hooks/usePostType.js';
import useList from 'hooks/useList.js';

// Custom Components
import FAB from 'components/FAB';
import FilterList from 'components/FilterList';
import ActionModal from 'components/ActionModal';
import OfflineBar from 'components/OfflineBar';

import Subtitles from 'components/Subtitles';

// TODO: use Native Base?
import ActionButton from 'react-native-action-button';

import { styles } from './ListScreen.styles';

import Constants from 'constants';

const ListScreen = ({ navigation, route }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const isConnected = useNetworkStatus();

  const { isContact, isGroup, postType } = usePostType();

  const defaultFilter = {
    text: '',
    sort: '-last_modified',
  };
  const [filter, setFilter] = useState(defaultFilter);
  /*
  const zztestfilter = {
    text: '', //"and",
    sort: "-last_modified",
    //contact_phone: ["123", "-234"] // good test to force fail groups
  };
  */

  //const userData = useSelector((state) => state.userReducer.userData);
  //const questionnaires = useSelector((state) => state.questionnaireReducer.questionnaires);

  // TODO: useFilters() in FiltersPanel
  //let filters = useSelector((state) => state.usersReducer.contactFilters);
  let totalPosts = 20;
  let filteredPosts = null;

  // default to contacts type
  const [state, setState] = useState({
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

  /*
  // focus effect
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //setModuleType(getModuleType(route));
    });
    return unsubscribe;
  }, [navigation]);
*/

  // get posts
  const { posts, error: listError, isLoading, isValidating, mutate } = useList(filter);
  if (listError) showToast(listError.message, true);
  /*
  return(
    <Text style={{ fontWeight: 'bold', color: 'blue' }}>{ JSON.stringify(posts) }</Text>
  );
  */

  const renderFooter = () => {
    return (
      <View style={styles.loadMoreFooterText}>
        {isConnected && state.offset + state.limit < totalPosts && (
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
        style={styles.rowFront}
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

  const renderRow = (record) => {
    // TODO: better support for expansion of postTypes
    const statusValue = isContact ? record.overall_status : record.group_status;
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
                width: Constants.STATUS_CIRCLE_SIZE,
                paddingTop: 0,
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              isRTL ? { marginRight: 5 } : { marginLeft: 5 },
            ]}>
            <View
              style={{
                width: Constants.STATUS_CIRCLE_SIZE,
                height: Constants.STATUS_CIRCLE_SIZE,
                borderRadius: Constants.STATUS_CIRCLE_SIZE / 2,
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
    const btn1Style = isRTL ? { left: Constants.SWIPE_BTN_WIDTH * 2 } : { left: 0 };
    const btn2Style = isRTL
      ? { left: Constants.SWIPE_BTN_WIDTH }
      : { left: Constants.SWIPE_BTN_WIDTH };
    const btn3Style = isRTL ? { left: 0 } : { left: Constants.SWIPE_BTN_WIDTH * 2 };
    //const btn3Style = isRTL ? { right: 0 } : { right: Constants.SWIPE_BTN_WIDTH };
    //const btn4Style = isRTL ? { right: Constants.SWIPE_BTN_WIDTH } : { right: 0 };
    return (
      <View style={styles.rowBack}>
        <Pressable
          style={[styles.backBtn, styles.backBtn1, btn1Style, { width: Constants.SWIPE_BTN_WIDTH }]}
          onPress={() => console.log('*** BUTTON 1 CLICKED ***')}>
          <Icon type="MaterialCommunityIcons" name="check" style={styles.backBtnIcon} />
          <Text style={styles.backBtnText}>Update Status</Text>
        </Pressable>
        <Pressable
          style={[styles.backBtn, styles.backBtn2, btn2Style, { width: Constants.SWIPE_BTN_WIDTH }]}
          onPress={() => {
            console.log('*** BUTTON 2 CLICKED ***');
            console.log(JSON.stringify(questionnaires));
          }}>
          <Icon type="MaterialCommunityIcons" name="calendar-check" style={styles.backBtnIcon} />
          <Text style={styles.backBtnText}>Meeting Complete</Text>
        </Pressable>
        <Pressable
          style={[styles.backBtn, styles.backBtn3, btn3Style, { width: Constants.SWIPE_BTN_WIDTH }]}
          onPress={() => {
            console.log('*** BUTTON 3 CLICKED ***');
            //setState({ ...state, commentsModalVisible: true });
          }}>
          <Icon type="MaterialCommunityIcons" name="pencil" style={styles.backBtnIcon} />
          <Text style={styles.backBtnText}>Comment</Text>
        </Pressable>
        {/*
        <Pressable
          style={[styles.backBtn, styles.backBtn4, btn4Style, { width: Constants.SWIPE_BTN_WIDTH }]}
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

  const onRefresh = () => {
    mutate();
  };

  const goToDetailsScreen = (postData = null, isPhoneImport = false) => {
    if (postData && isPhoneImport) {
      navigation.navigate('Details', {
        importContact: contactData,
        type: postType,
      });
    } else if (postData) {
      // Detail
      navigation.navigate('Details', {
        id: postData.ID,
        name: postData.title,
        type: postType,
        onGoBack: () => onRefresh(),
      });
    } else {
      // Create
      navigation.navigate('Details', {
        create: true,
        type: postType,
      });
    }
  };

  // TODO: filters
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

  // TODO: filters
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
    return (
      <FilterList
        //settings={null}
        //filterConfig={importContactsFilters}
        posts={importContactsList}
        //loading={isLoading}
        renderRow={renderImportContactsRow}
      />
    );
  };

  // TODO:
  const commentsRender = () => {
    return <Text>Hello Comments</Text>;
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
            title={i18n.t('contactsScreen.importContact')}>
            {importContactsRender()}
          </ActionModal>
        )}
        <FilterList
          filter={filter}
          setFilter={setFilter}
          resetFilter={() => setFilter(defaultFilter)}
          posts={posts}
          renderRow={renderRow}
          loading={isLoading}
          onRefresh={onRefresh}
          renderHiddenRow={isContact ? renderHiddenRow : null}
          leftOpenValue={isContact ? Constants.SWIPE_BTN_WIDTH * 3 : null}
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
