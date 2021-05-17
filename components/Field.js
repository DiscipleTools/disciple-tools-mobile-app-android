import React from 'react';
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
import { useSelector } from 'react-redux';
import { Label, Input, Icon, Picker, DatePicker, Textarea, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import FaithMilestones from 'components/FaithMilestones';
import i18n from 'languages';
import utils from 'utils';
import { isIOS, showToast } from 'helpers';

// TODO: refactor styles
//import { styles } from './FieldValue.styles';
import { styles } from 'screens/Contact/ContactDetailScreen.styles';
//import { styles } from 'screens/Group/GroupDetailScreen.styles';

// TODO: move to constants
const POST_TYPE_CONTACT = 'contacts';
const POST_TYPE_GROUP = 'groups';

// TODO: no longer pass in 'state' (use Context or Redux)
const Field = ({ state, field }) => {
  const postType = field?.post_type;
  if (!postType) return null;

  let record = null;
  let settings = null;
  let statusField = null;
  if (postType === POST_TYPE_CONTACT) {
    settings = useSelector((state) => state.contactsReducer.settings);
    record = useSelector((state) => state.contactsReducer.contact);
    // TODO: make constant
    statusField = 'overall_status';
  } else if (postType === POST_TYPE_GROUP) {
    settings = useSelector((state) => state.groupsReducer.settings);
    record = useSelector((state) => state.groupsReducer.group);
    // TODO: make constant
    statusField = 'group_status';
  } else {
    return null;
  }
  if (!settings || !record) return null;

  if (!Object.prototype.hasOwnProperty.call(record, field.name)) return null;
  const value = record[field.name];
  if (value.length < 1) return null;
  const valueType = field?.type;

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const isConnected = useSelector((state) => state.networkConnectivityReducer.isConnected);

  const searchLocationsDelayed = utils.debounce((queryText) => {
    /* TODO
    setState(
      {
        ...state,
        foundGeonames: [],
      },
      () => {
        if (queryText.length > 0) {
          dispatch(searchLocations(queryText));
        }
      },
    );
    */
  }, 750);

  // TODO: duplicated in FieldValue.js
  const renderStatusPickerItems = () => {
    Object.keys(settings.fields[statusField].values).map((key) => {
      const optionData = settings.fields[statusField].values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });
  };

  const onSelectizeValueChange = (propName, selectedItems) => {
    /* TODO:
    setState((prevState) => ({
      ...state,
      contact: {
        ...prevState.contact,
        [propName]: {
          values: utils.getSelectizeValuesToSave(
            prevState.contact[propName] ? prevState.contact[propName].values : [],
            selectedItems,
          ),
        },
      },
    }));
    --- GROUP:
    setState((prevState) => {
      if (propName == 'members') {
        return {
          ...state,
          group: {
            ...prevState.group,
            [propName]: {
              values: utils.getSelectizeValuesToSave(
                [...state.membersContacts, ...state.usersContacts].filter((userContact) => {
                  // Filter members to get only members no added to group
                  if (
                    state.group.members &&
                    state.group.members.values.find(
                      (member) => member.value === userContact.value,
                    ) !== undefined
                  ) {
                    return false;
                  } else {
                    return true;
                  }
                }),
                selectedItems,
              ),
            },
          },
        };
      } else {
        return {
          group: {
            ...prevState.group,
            [propName]: {
              values: utils.getSelectizeValuesToSave(
                prevState.group[propName] ? prevState.group[propName].values : [],
                selectedItems,
              ),
            },
          },
        };
      }
    });
    */
  };

  const onAddCommunicationField = (key) => {
    const communicationList = record[key] ? [...record[key]] : [];
    communicationList.push({
      value: '',
    });
    /* TODO:
    setState((prevState) => ({
      ...state,
      contact: {
        ...prevState.contact,
        [key]: communicationList,
      },
      group: {
        ...prevState.group,
        [key]: communicationList,
      },
    }));
    */
  };

  const onCommunicationFieldChange = (key, value, index, dbIndex, component) => {
    const communicationList = [...component.record[key]];
    let communicationItem = {
      ...communicationList[index],
    };
    communicationItem = {
      ...communicationItem,
      value,
    };
    if (dbIndex) {
      communicationItem = {
        ...communicationItem,
        key: dbIndex,
      };
    }
    communicationList[index] = {
      ...communicationItem,
    };
    /* TODO: 
    component.setState((prevState) => ({
      ...state,
      contact: {
        ...prevState.contact,
        [key]: communicationList,
      },
      group: {
        ...prevState.group,
        [key]: communicationList,
      },
    }));
    */
  };

  const onRemoveCommunicationField = (key, index, component) => {
    const communicationList = [...component.record[key]];
    let communicationItem = communicationList[index];
    if (communicationItem.key) {
      communicationItem = {
        key: communicationItem.key,
        delete: true,
      };
      communicationList[index] = communicationItem;
    } else {
      communicationList.splice(index, 1);
    }
    /* TODO:
    component.setState((prevState) => ({
      ...state,
      contact: {
        ...prevState.contact,
        [key]: communicationList,
      },
      group: {
        ...prevState.group,
        [key]: communicationList,
      },
    }));
    */
  };

  const renderContactLink = (assignedTo) => {
    let foundContact, valueToSearch, nameToShow;
    if (assignedTo.key) {
      valueToSearch = assignedTo.key;
      nameToShow = assignedTo.label;
    } else if (assignedTo.value) {
      valueToSearch = assignedTo.value;
      nameToShow = assignedTo.name;
    }
    foundContact = state.users.find(
      (user) => user.key === parseInt(valueToSearch) || user.contactID === parseInt(valueToSearch),
    );
    if (!foundContact) {
      foundContact = state.usersContacts.find((user) => user.value === valueToSearch.toString());
    }
    // User have accesss to assigned_to user/contact
    if (foundContact && foundContact.contactID) {
      // Contact exist in 'state.users' list
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => goToContactDetailScreen(foundContact.contactID, nameToShow)}>
          <Text style={[styles.linkingText, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {nameToShow}
          </Text>
        </TouchableOpacity>
      );
    } else if (foundContact) {
      // Contact exist in 'state.usersContacts' list
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => goToContactDetailScreen(valueToSearch, nameToShow)}>
          <Text style={[styles.linkingText, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {nameToShow}
          </Text>
        </TouchableOpacity>
      );
    } else {
      // User does not exist in any list
      return (
        <Text
          style={[
            { marginTop: 4, marginBottom: 4, fontSize: 15 },
            isRTL ? { textAlign: 'left', flex: 1 } : {},
          ]}>
          {nameToShow}
        </Text>
      );
    }
  };

  const renderConnectionLink = (
    connectionList,
    list,
    isGroup = false,
    search = false,
    keyName = null,
  ) => {
    let collection;
    if (isConnected) {
      collection = [...connectionList.values];
    } else {
      collection = getSelectizeItems(connectionList, list);
    }
    return collection.map((entity, index) => (
      <TouchableOpacity
        key={index.toString()}
        activeOpacity={0.5}
        onPress={() => {
          if (search) {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'GroupList',
                  params: {
                    customFilter: {
                      [keyName]: entity.value,
                    },
                  },
                }),
              ],
            });
            navigation.dispatch(resetAction);
          } else if (isGroup) {
            goToGroupDetailScreen(entity.value, entity.name);
          } else {
            goToContactDetailScreen(entity.value, entity.name);
          }
        }}>
        <Text
          style={[
            styles.linkingText,
            { marginTop: 'auto', marginBottom: 'auto' },
            isRTL ? { textAlign: 'left', flex: 1 } : {},
          ]}>
          {entity.name}
        </Text>
      </TouchableOpacity>
    ));
  };

  //const setGroupCustomFieldValue = (fieldName, value, fieldType = null) => {
  //const setContactCustomFieldValue = (fieldName, value, fieldType = null) => {
  const setCustomFieldValue = (fieldName, value, fieldType = null) => {
    if (fieldType == 'date') {
      if (!value) {
        // Clear DatePicker value
        this[`${fieldName}Ref`].state.chosenDate = undefined;
        this[`${fieldName}Ref`].state.defaultDate = new Date();
        // ?? TODO
        forceUpdate();
      }
      value = value ? utils.formatDateToBackEnd(value) : '';
    }
    /* TODO:
    setState((prevState) => ({
      ...state,
      contact: {
        ...prevState.contact,
        [fieldName]: value,
      },
      group: {
        ...prevState.group,
        [fieldName]: value,
      },
    }));
    */
  };

  const onMilestoneChange = (milestoneName, customProp = null) => {
    let list = customProp ? record[customProp] : record.milestones;
    let propName = customProp ? customProp : 'milestones';
    const milestonesList = list ? [...list.values] : [];
    const foundMilestone = milestonesList.find((milestone) => milestone.value === milestoneName);
    if (foundMilestone) {
      const milestoneIndex = milestonesList.indexOf(foundMilestone);
      if (foundMilestone.delete) {
        const milestoneModified = {
          ...foundMilestone,
        };
        delete milestoneModified.delete;
        milestonesList[milestoneIndex] = milestoneModified;
      } else {
        milestonesList[milestoneIndex] = {
          ...foundMilestone,
          delete: true,
        };
      }
    } else {
      milestonesList.push({
        value: milestoneName,
      });
    }
    // TODO:
    /*
    setState((prevState) => ({
      ...state,
      contact: {
        ...prevState.contact,
        [propName]: {
          values: milestonesList,
        },
      },
      group: {
        ...prevState.group,
        [propName]: {
          values: milestonesList,
        },
      },
    }));
    */
  };

  const onCheckExistingMilestone = (milestoneName, customProp = null) => {
    let list = customProp ? record[customProp] : record.milestones;
    const milestonesList = list ? [...list.values] : [];
    // Return 'boolean' acording to milestone existing in the 'milestonesList'
    return milestonesList.some(
      (milestone) => milestone.value === milestoneName && !milestone.delete,
    );
  };

  const renderMultiSelectField = (field, value, index) => (
    <TouchableOpacity
      key={index.toString()}
      onPress={() => {
        if (!state.onlyView) {
          onMilestoneChange(value, field.name);
        }
      }}
      activeOpacity={1}
      underlayColor={onCheckExistingMilestone(value, field.name) ? Colors.tintColor : Colors.gray}
      style={{
        borderRadius: 10,
        backgroundColor: onCheckExistingMilestone(value, field.name)
          ? Colors.tintColor
          : Colors.gray,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
      }}>
      <Text
        style={[
          styles.progressIconText,
          {
            color: onCheckExistingMilestone(value, field.name) ? '#FFFFFF' : '#000000',
          },
        ]}>
        {field.default[value].label}
      </Text>
    </TouchableOpacity>
  );

  // TODO:
  // - state.foundGeonames
  // - state.geonames
  switch (valueType) {
    case 'location': {
      return (
        <Selectize
          itemId="value"
          items={state.foundGeonames}
          selectedItems={getSelectizeItems(record[field.name], state.geonames)}
          textInputProps={{
            placeholder: i18n.t('global.selectLocations'),
            onChangeText: searchLocationsDelayed,
          }}
          renderChip={(id, onClose, item, style, iconStyle) => (
            <Chip key={id} iconStyle={iconStyle} onClose={onClose} text={item.name} style={style} />
          )}
          renderRow={(id, onPress, item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={id}
              onPress={onPress}
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
              </View>
            </TouchableOpacity>
          )}
          filterOnKey="name"
          onChangeSelectedItems={(selectedItems) =>
            onSelectizeValueChange(field.name, selectedItems)
          }
          inputContainerStyle={styles.selectizeField}
        />
      );
    }
    case 'date': {
      return (
        <Row>
          <DatePicker
            //ref={(ref) => {
            //  this[`${field.name}Ref`] = ref;
            //}}
            onDateChange={(dateValue) => {
              // TODO: conditional type
              //setContactCustomFieldValue(field.name, dateValue, valueType)
              //setGroupCustomFieldValue(field.name, dateValue, valueType)
            }}
            defaultDate={
              record[field.name] && record[field.name].length > 0
                ? utils.formatDateToDatePicker(record[field.name] * 1000)
                : ''
            }
          />
          <Icon
            type="AntDesign"
            name="close"
            style={[
              styles.formIcon,
              styles.addRemoveIcons,
              styles.removeIcons,
              { marginLeft: 'auto' },
            ]}
            onPress={() => {
              // TODO: conditional type
              //setContactCustomFieldValue(field.name, null, valueType)
              //setGroupCustomFieldValue(field.name, null, valueType)
            }}
          />
        </Row>
      );
    }
    // TODO:
    // - state.peopleGroups
    // - state.usersContacts
    // - state.groups
    // - state.membersContacts
    // - state.updateMembersList
    case 'connection': {
      let listItems = [];
      let placeholder = '';
      if (field.name == 'people_groups') {
        listItems = [...state.peopleGroups];
        placeholder = i18n.t('global.selectPeopleGroups');
      } else if (field.name === 'members') {
        return (
          <Col>
            <FlatList
              data={propExist ? value.values : []}
              extraData={state.updateMembersList}
              renderItem={(item) => membersRow(item.item)}
              ItemSeparatorComponent={flatListItemSeparator}
            />
            <Grid>
              <Row>
                <Col
                  style={[
                    { width: 40, marginTop: 5, marginLeft: 0 },
                    isRTL ? { marginRight: 10 } : {},
                  ]}>
                  <Icon type="Entypo" name="add-user" style={{ color: '#CCCCCC' }} />
                </Col>
                <Col style={{ paddingBottom: 200 }}>
                  <Selectize
                    ref={(selectize) => {
                      addMembersSelectizeRef = selectize;
                    }}
                    itemId="value"
                    items={[...state.membersContacts, ...state.usersContacts].filter(
                      (userContact) => {
                        // Filter members to get only members no added to group
                        if (
                          value.values.find((member) => member.value === userContact.value) !==
                          undefined
                        ) {
                          return false;
                        } else {
                          return true;
                        }
                      },
                    )}
                    selectedItems={[]}
                    textInputProps={{
                      placeholder: i18n.t('groupDetailScreen.addMember'),
                      leftIcon: { type: 'Entypo', name: 'add-user' },
                    }}
                    renderRow={(id, onPress, item) => (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        key={id}
                        onPress={() => onAddMember(item)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          {item.avatarUri && (
                            <Image style={styles.avatar} source={{ uri: item.avatarUri }} />
                          )}
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
                    keyboardShouldPersistTaps
                    inputContainerStyle={styles.selectizeField}
                  />
                </Col>
              </Row>
            </Grid>
          </Col>
        );
      } else {
        switch (postType) {
          case 'contacts': {
            listItems = [...state.usersContacts];
            placeholder = i18n.t('global.searchContacts');
            break;
          }
          case 'groups': {
            listItems = [...state.groups];
            placeholder = i18n.t('groupDetailScreen.searchGroups');
            break;
          }
          case 'peoplegroups': {
            listItems = [...state.peopleGroups];
            placeholder = i18n.t('global.selectPeopleGroups');
            break;
          }
          default:
        }
      }
      return (
        <Selectize
          itemId="value"
          items={listItems}
          selectedItems={getSelectizeItems(record[field.name], listItems)}
          textInputProps={{
            placeholder: placeholder,
          }}
          renderRow={(id, onPress, item) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={id}
              onPress={onPress}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {item.avatarUri && <Image style={styles.avatar} source={{ uri: item.avatarUri }} />}
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
          renderChip={(id, onClose, item, style, iconStyle) => (
            <Chip key={id} iconStyle={iconStyle} onClose={onClose} text={item.name} style={style} />
          )}
          filterOnKey="name"
          onChangeSelectedItems={(selectedItems) =>
            onSelectizeValueChange(field.name, selectedItems)
          }
          inputContainerStyle={styles.selectizeField}
        />
      );
    }
    // TODO:
    // - state.sources
    // - state.nonExistingSources
    case 'multi_select': {
      if (field.name == 'sources') {
        return (
          <Selectize
            itemId="value"
            items={state.sources}
            selectedItems={
              record[field.name]
                ? // Only add option elements (by contact sources) does exist in source list
                  record[field.name].values
                    .filter((contactSource) =>
                      state.sources.find((sourceItem) => sourceItem.value === contactSource.value),
                    )
                    .map((contactSource) => {
                      return {
                        name: state.sources.find(
                          (sourceItem) => sourceItem.value === contactSource.value,
                        ).name,
                        value: contactSource.value,
                      };
                    })
                : []
            }
            textInputProps={{
              placeholder: i18n.t('contactDetailScreen.selectSources'),
            }}
            renderRow={(id, onPress, item) => (
              <TouchableOpacity
                activeOpacity={0.6}
                key={id}
                onPress={onPress}
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
                </View>
              </TouchableOpacity>
            )}
            renderChip={(id, onClose, item, style, iconStyle) => (
              <Chip
                key={id}
                iconStyle={iconStyle}
                onClose={(props) => {
                  const nonExistingSourcesList = [...state.nonExistingSources];
                  let foundNonExistingSource = nonExistingSourcesList.findIndex(
                    (source) => source.value === id,
                  );
                  if (foundNonExistingSource > -1) {
                    // Remove custom source from select list
                    const sourceList = [...state.sources]; //,
                    let foundSourceIndex = sourceList.findIndex((source) => source.value === id);
                    sourceList.splice(foundSourceIndex, 1);
                    setState({
                      ...state,
                      sources: [...sourceList],
                    });
                  }
                  onClose(props);
                }}
                text={item.name}
                style={style}
              />
            )}
            filterOnKey="name"
            onChangeSelectedItems={(selectedItems) =>
              onSelectizeValueChange(field.name, selectedItems)
            }
            inputContainerStyle={styles.selectizeField}
          />
        );
      } else if (field.name == 'milestones') {
        return (
          <Col style={{ paddingBottom: 15 }}>
            <Row style={[styles.formRow, { paddingTop: 10 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Icon type="Octicons" name="milestone" style={styles.formIcon} />
              </Col>
              <Col>
                <Label
                  style={[
                    styles.formLabel,
                    { fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto' },
                    isRTL ? { textAlign: 'left', flex: 1 } : {},
                  ]}>
                  {field.label}
                </Label>
              </Col>
            </Row>
            <FaithMilestones state={state} />
            <FaithMilestones state={state} custom />
          </Col>
        );
      } else if (field.name == 'health_metrics') {
        return (
          <View>
            <Row style={[styles.formRow, { paddingTop: 10 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Icon type="MaterialCommunityIcons" name="church" style={[styles.formIcon, {}]} />
              </Col>
              <Col>
                <Label style={[styles.formLabel, { fontWeight: 'bold' }]}>
                  {groupSettings.fields.health_metrics.name}
                </Label>
              </Col>
            </Row>
            {/* TODO: merge <FaithMilestones> and <HealthMilestones> */}
            {renderHealthMilestones()}
            {renderCustomHealthMilestones()}
          </View>
        );
      } else {
        return (
          <Row style={{ flexWrap: 'wrap' }}>
            {Object.keys(field.default).map((value, index) =>
              renderMultiSelectField(field, value, index),
            )}
          </Row>
        );
      }
    }
    case 'communication_channel': {
      let keyboardType = 'default';
      if (field.name.includes('phone')) {
        keyboardType = 'phone-pad';
      } else if (field.name.includes('email')) {
        keyboardType = 'email-address';
      }
      return (
        <Col>
          <Row style={styles.formFieldMargin}>
            <Col style={styles.formIconLabelCol}>
              <View style={styles.formIconLabelView}>
                {/*<Icon type="Octicons" name="primitive-dot" style={styles.formIcon} />*/}
                <Icon type="FontAwesome" name="user" style={styles.formIcon} />
              </View>
            </Col>
            <Col>
              <Label style={styles.formLabel}>{field.label}</Label>
            </Col>
            <Col style={styles.formIconLabel}>
              <Icon
                android="md-add"
                ios="ios-add"
                style={[styles.addRemoveIcons, styles.addIcons]}
                onPress={() => {
                  onAddCommunicationField(field.name);
                }}
              />
            </Col>
          </Row>
          {value.map((communicationChannel, index) =>
            !communicationChannel.delete ? (
              <Row key={index.toString()} style={{ marginBottom: 10 }}>
                <Col style={styles.formIconLabelCol}>
                  <View style={styles.formIconLabelView}>
                    <Icon
                      type="FontAwesome"
                      name="user"
                      style={[styles.formIcon, { opacity: 0 }]}
                    />
                  </View>
                </Col>
                <Col>
                  <Input
                    value={communicationChannel.value}
                    onChangeText={(value) => {
                      onCommunicationFieldChange(
                        field.name,
                        value,
                        index,
                        communicationChannel.key,
                      );
                    }}
                    style={styles.contactTextField}
                    keyboardType={keyboardType}
                  />
                </Col>
                <Col style={styles.formIconLabel}>
                  <Icon
                    android="md-remove"
                    ios="ios-remove"
                    style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
                    onPress={() => {
                      onRemoveCommunicationField(field.name, index, this);
                    }}
                  />
                </Col>
              </Row>
            ) : null,
          )}
        </Col>
      );
    }
    // TODO:
    // - state.overallStatusBackgroundColor,
    case 'key_select': {
      if (field.name === 'overall_status') {
        return (
          <Col>
            <Row style={[styles.formRow, { paddingTop: 15 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Image source={statusIcon} style={[styles.fieldsIcons, {}]} />
              </Col>
              <Col>
                <Label
                  style={[
                    {
                      color: Colors.tintColor,
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                    },
                    isRTL ? { textAlign: 'left', flex: 1 } : {},
                  ]}>
                  {field.label}
                </Label>
              </Col>
            </Row>
            <Row style={[styles.formRow, { paddingTop: 5, paddingBottom: 5 }]}>
              <Col
                style={[
                  styles.statusFieldContainer,
                  Platform.select({
                    android: {
                      borderColor: state.overallStatusBackgroundColor,
                      backgroundColor: state.overallStatusBackgroundColor,
                    },
                  }),
                ]}>
                <Picker
                  selectedValue={value}
                  onValueChange={setContactStatus}
                  style={Platform.select({
                    android: {
                      color: '#ffffff',
                      backgroundColor: 'transparent',
                    },
                    ios: {
                      backgroundColor: state.overallStatusBackgroundColor,
                    },
                  })}
                  textStyle={{
                    color: '#ffffff',
                  }}>
                  {renderStatusPickerItems()}
                </Picker>
                <Icon name="caret-down" size={10} style={styles.pickerIcon} />
              </Col>
            </Row>
            {Object.prototype.hasOwnProperty.call(record, `reason_${record.overall_status}`) ? (
              <TouchableOpacity activeOpacity={0.6} onPress={toggleReasonStatusView}>
                <Row>
                  <Text>
                    (
                    {
                      contactSettings.fields[`reason_${record.overall_status}`].values[
                        record[`reason_${record.overall_status}`]
                      ].label
                    }
                    )
                  </Text>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="pencil"
                    style={{
                      fontSize: 21,
                    }}
                  />
                </Row>
              </TouchableOpacity>
            ) : null}
          </Col>
        );
        // TODO:
        // - state.groupStatusBackgroundColor,
      } else if (field.name === 'group_status') {
        return (
          <Col>
            <Row style={[styles.formRow, { paddingTop: 15 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Image source={statusIcon} style={[styles.fieldsIcons, {}]} />
              </Col>
              <Col>
                <Label
                  style={[
                    {
                      color: Colors.tintColor,
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                    },
                    isRTL ? { textAlign: 'left', flex: 1 } : {},
                  ]}>
                  {field.label}
                </Label>
              </Col>
            </Row>
            <Row style={[styles.formRow, { paddingTop: 5, paddingBottom: 5 }]}>
              <Col
                style={[
                  styles.statusFieldContainer,
                  Platform.select({
                    android: {
                      borderColor: state.groupStatusBackgroundColor,
                      backgroundColor: state.groupStatusBackgroundColor,
                    },
                  }),
                ]}>
                <Picker
                  selectedValue={value}
                  // TODO:
                  onValueChange={setGroupStatus}
                  style={Platform.select({
                    android: {
                      color: '#ffffff',
                      backgroundColor: 'transparent',
                    },
                    ios: {
                      backgroundColor: state.groupStatusBackgroundColor,
                    },
                  })}
                  textStyle={{
                    color: '#ffffff',
                  }}>
                  {renderStatusPickerItems()}
                </Picker>
                <Icon name="caret-down" size={10} style={styles.pickerIcon} />
              </Col>
            </Row>
          </Col>
        );
      } else {
        return (
          <Picker
            mode="dropdown"
            selectedValue={record[field.name]}
            onValueChange={(value) => {
              // TODO:
              //setContactCustomFieldValue(field.name, value)
              //setGroupCustomFieldValue(field.name, value)}
            }}
            textStyle={{ color: Colors.tintColor }}>
            <Picker.Item key={-1} label={''} value={''} />
            {Object.keys(field.default).map((key) => {
              const optionData = field.default[key];
              return <Picker.Item key={key} label={optionData.label} value={key} />;
            })}
          </Picker>
        );
      }
    }
    // TODO:
    // - state.users
    // - state.assignedToContacts
    case 'user_select': {
      const selectedValue = propExist && value.hasOwnProperty('key') ? value.key : value;
      return (
        <Picker
          mode="dropdown"
          selectedValue={propExist ? selectedValue : null}
          onValueChange={(value) => {
            // TODO
            //setContactCustomFieldValue(field.name, value)
            //setGroupCustomFieldValue(field.name, value)}
          }}
          textStyle={{ color: Colors.tintColor }}>
          {[...state.users, ...state.assignedToContacts].map((item) => {
            return (
              <Picker.Item
                key={item.key}
                label={item.label + ' (#' + item.key + ')'}
                value={item.key}
              />
            );
          })}
        </Picker>
      );
    }
    case 'number': {
      return (
        <Input
          value={value}
          keyboardType="numeric"
          onChangeText={(value) => {
            // TODO:
            //setContactCustomFieldValue(field.name, value)
            //setGroupCustomFieldValue(field.name, value)}
          }}
          style={[styles.contactTextField, isRTL ? { textAlign: 'left', flex: 1 } : {}]}
        />
      );
    }
    // TODO;
    // - state.nameRequired
    case 'text': {
      return (
        <Input
          value={value}
          onChangeText={(value) => {
            // TODO:
            //setContactCustomFieldValue(field.name, value)
            //setGroupCustomFieldValue(field.name, value)}
          }}
          style={[
            field.name == 'name' && state.nameRequired
              ? [styles.contactTextField, { borderBottomWidth: 0 }]
              : styles.contactTextField,
            isRTL ? { textAlign: 'left', flex: 1 } : {},
          ]}
        />
      );
    }
    default: {
      return <Text>{field.toString()}</Text>;
    }
  }
  return null;
};
export default Field;
