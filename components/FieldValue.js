import React from 'react';
import { Text, View } from 'react-native';
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
const FieldValue = ({ state, field }) => {
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

  // TODO: duplicated in Field.js
  const renderStatusPickerItems = () => {
    Object.keys(settings.fields[statusField].values).map((key) => {
      const optionData = settings.fields[statusField].values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });
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
            /* TODO
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'ContactList',
                  params: {
                    customFilter: {
                      [keyName]: entity.value,
                    },
                  },
                }),
              ],
            });
            */
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

  switch (valueType) {
    case 'location': {
      return (
        <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>
          {value.values.map((location) => location.name).join(', ')}
        </Text>
      );
    }
    case 'date': {
      return (
        <Text>
          {utils.formatDateToView(utils.isNumeric(value) ? parseInt(value) * 1000 : value)}
        </Text>
      );
    }
    case 'connection': {
      let collection = [];
      const isGroup = false;
      if (field.name === 'people_groups') {
        return (
          <Text
            style={[
              { marginTop: 'auto', marginBottom: 'auto' },
              isRTL ? { textAlign: 'left', flex: 1 } : {},
            ]}>
            {/*TODOvalue.values
              .map(
                function (peopleGroup) {
                  return safeFind(
                    state.peopleGroups.find(
                      (person) => person.value === peopleGroup.value,
                    ),
                    'name',
                  );
                }.bind(this),
              )
              .filter(String)
              .join(', ')*/}
          </Text>
        );
      } else if (field.name === 'members') {
        if (value.values.length > 0) {
          return (
            <Col>
              <Text
                style={[
                  {
                    color: Colors.tintColor,
                    fontSize: 12,
                    textAlign: 'left',
                    paddingBottom: 15,
                    paddingTop: 5,
                    marginTop: 10,
                  },
                ]}>
                {field.label}
              </Text>
              <FlatList
                data={value.values.filter((member) => !member.delete)}
                extraData={state.updateMembersList}
                renderItem={(item) => membersRow(item.item)}
                ItemSeparatorComponent={flatListItemSeparator}
              />
            </Col>
          );
        }
        return (
          <View>
            <Text style={styles.addMembersHyperlink} onPress={() => onEnableEdit()}>
              {i18n.t('groupDetailScreen.noMembersMessage')}
            </Text>
          </View>
        );
      } else if (postType === POST_TYPE_GROUP) {
        let iconSource = groupParentIcon;
        const groupFieldLabel = String(field.label);
        if (groupFieldLabel.toLowerCase().includes('peer')) iconSource = groupPeerIcon;
        if (groupFieldLabel.toLowerCase().includes('child')) iconSource = groupChildIcon;
        return (
          <Grid>
            <Row style={styles.formRow}>
              <Col style={styles.formIconLabel}>
                <View style={styles.formIconLabelView}>
                  <Image source={iconSource} style={styles.groupIcons} />
                </View>
              </Col>
              <Col style={styles.formIconLabel}>
                <Label style={styles.formLabel}>{field.label}</Label>
              </Col>
              <Col />
            </Row>
            <Row
              style={[styles.groupCircleParentContainer, { overflowX: 'auto', marginBottom: 10 }]}>
              <ScrollView horizontal>
                {propExist && value.values.length > 0
                  ? value.values.map((group, index) => (
                      <Col
                        key={index.toString()}
                        style={styles.groupCircleContainer}
                        onPress={() => goToGroupDetailScreen(group.value, group.name)}>
                        {Object.prototype.hasOwnProperty.call(group, 'is_church') &&
                        group.is_church ? (
                          <Image source={groupCircleIcon} style={styles.groupCircle} />
                        ) : (
                          <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                        )}
                        <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                        <Row style={styles.groupCircleName}>
                          <Text style={styles.groupCircleNameText}>{group.name}</Text>
                        </Row>
                        <Row style={styles.groupCircleCounter}>
                          <Text>{group.baptized_member_count}</Text>
                        </Row>
                        <Row style={[styles.groupCircleCounter, { marginTop: '5%' }]}>
                          <Text>{group.member_count}</Text>
                        </Row>
                      </Col>
                    ))
                  : null}
              </ScrollView>
            </Row>
            <View style={styles.formDivider} />
          </Grid>
        );
      } else {
        switch (postType) {
          case 'contacts': {
            collection = [
              ...state.subAssignedContacts,
              ...state.relationContacts,
              ...state.baptizedByContacts,
              ...state.coachedByContacts,
              ...state.coachedContacts,
              ...state.usersContacts,
            ];
            break;
          }
          case 'groups': {
            collection = [...state.connectionGroups, ...state.groups];
            isGroup = true;
            break;
          }
          default: {
            break;
          }
        }
        return renderConnectionLink(value, collection, isGroup);
      }
    }
    case 'multi_select': {
      if (field.name == 'tags') {
        return renderConnectionLink(
          value,
          tags.map((tag) => ({ value: tag, name: tag })),
          false,
          true,
          'tags',
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
      } else if (field.name == 'sources') {
        return (
          <Text
            style={[
              { marginTop: 'auto', marginBottom: 'auto' },
              isRTL ? { textAlign: 'left', flex: 1 } : {},
            ]}>
            {value.values
              .map(
                (source) =>
                  state.sources.find((sourceItem) => sourceItem.value === source.value).name,
              )
              .join(', ')}
          </Text>
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
                  {settings.fields.health_metrics.name}
                </Label>
              </Col>
            </Row>
            {/* TODO: renderHealthMilestones() */}
            {/* TODO: renderCustomHealthMilestones() */}
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
      if (field.name.includes('phone')) {
        return value
          .filter((communicationChannel) => !communicationChannel.delete)
          .map((communicationChannel, index) => (
            <TouchableOpacity
              key={index.toString()}
              activeOpacity={0.5}
              onPress={() => {
                linkingPhoneDialer(communicationChannel.value);
              }}>
              <Text
                style={[
                  styles.linkingText,
                  { marginTop: 'auto', marginBottom: 'auto' },
                  isRTL ? { textAlign: 'left', flex: 1 } : {},
                ]}>
                {communicationChannel.value}
              </Text>
            </TouchableOpacity>
          ));
      } else if (field.name.includes('email')) {
        return value
          .filter((communicationChannel) => !communicationChannel.delete)
          .map((communicationChannel, index) => (
            <TouchableOpacity
              key={index.toString()}
              activeOpacity={0.5}
              onPress={() => {
                Linking.openURL('mailto:' + communicationChannel.value);
              }}>
              <Text
                style={[
                  styles.linkingText,
                  { marginTop: 'auto', marginBottom: 'auto' },
                  isRTL ? { textAlign: 'left', flex: 1 } : {},
                ]}>
                {communicationChannel.value}
              </Text>
            </TouchableOpacity>
          ));
      } else {
        return (
          <Text
            style={[
              { marginTop: 'auto', marginBottom: 'auto' },
              isRTL ? { textAlign: 'left', flex: 1 } : {},
            ]}>
            {value
              .filter((communicationChannel) => !communicationChannel.delete)
              .map((communicationChannel) => communicationChannel.value)
              .join(', ')}
          </Text>
        );
      }
    }
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
            <Row style={[styles.formRow, { paddingTop: 5, paddingBottom: 5 }]} pointerEvents="none">
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
              </Col>
            </Row>
            <Row style={{ paddingBottom: 15 }}>
              {Object.prototype.hasOwnProperty.call(record, `reason_${record.overall_status}`) ? (
                <Text>
                  (
                  {
                    settings.fields[`reason_${record.overall_status}`].values[
                      record[`reason_${record.overall_status}`]
                    ].label
                  }
                  )
                </Text>
              ) : null}
            </Row>
          </Col>
        );
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
            <Row style={[styles.formRow, { paddingTop: 5, paddingBottom: 5 }]} pointerEvents="none">
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
              </Col>
            </Row>
          </Col>
        );
      } else {
        return (
          <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>
            {field.default[value] ? field.default[value].label : ''}
          </Text>
        );
      }
    }
    case 'user_select': {
      return renderContactLink(value);
    }
    default: {
      return <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{value.toString()}</Text>;
    }
  }
  return null;
};
export default FieldValue;
