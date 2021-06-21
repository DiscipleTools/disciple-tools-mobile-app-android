import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Label, Icon, DatePicker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// Custom Hooks
import usePostType from 'hooks/usePostType.js';

import { styles } from './ConnectionField.styles';

const ConnectionField = ({ field, value }) => {
  console.log('*** CONNECTION FIELD RENDER ***');

  const { isContact, isGroup, postType } = usePostType();

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  // TODO:
  const isConnected = true;

  /* TODO
  // EDIT
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
*/

  // VIEW
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

  let collection = [];
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
          {/*TODO
          <FlatList
            data={value.values.filter((member) => !member.delete)}
            extraData={state.updateMembersList}
            renderItem={(item) => membersRow(item.item)}
            ItemSeparatorComponent={flatListItemSeparator}
          />
          */}
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
  } else if (isGroup) {
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
        <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto', marginBottom: 10 }]}>
          <ScrollView horizontal>
            {propExist && value.values.length > 0
              ? value.values.map((group, index) => (
                  <Col
                    key={index.toString()}
                    style={styles.groupCircleContainer}
                    onPress={() => goToGroupDetailScreen(group.value, group.name)}>
                    {Object.prototype.hasOwnProperty.call(group, 'is_church') && group.is_church ? (
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
        /* TODO:
        collection = [
          ...state.subAssignedContacts,
          ...state.relationContacts,
          ...state.baptizedByContacts,
          ...state.coachedByContacts,
          ...state.coachedContacts,
          ...state.usersContacts,
        ];
        */
        break;
      }
      case 'groups': {
        // TODO
        //collection = [...state.connectionGroups, ...state.groups];
        collection = [];
        isGroup = true;
        break;
      }
      default: {
        break;
      }
    }
    return renderConnectionLink(value, collection, isGroup);
  }

  // - state.peopleGroups
  // - state.usersContacts
  // - state.groups
  // - state.membersContacts
  // - state.updateMembersList
  const ConnectionFieldEdit = () => {
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
        onChangeSelectedItems={(selectedItems) => onSelectizeValueChange(field.name, selectedItems)}
        inputContainerStyle={styles.selectizeField}
      />
    );
  };

  const ConnectionFieldView = () => {
    let collection = [],
      isGroup = false;
    if (field.name === 'people_groups') {
      mappedValue = (
        <Text
          style={[
            { marginTop: 'auto', marginBottom: 'auto' },
            this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
          ]}>
          {value.values
            .map(
              function (peopleGroup) {
                return safeFind(
                  this.state.peopleGroups.find((person) => person.value === peopleGroup.value),
                  'name',
                );
              }.bind(this),
            )
            .filter(String)
            .join(', ')}
        </Text>
      );
    } else {
      switch (postType) {
        case 'contacts': {
          collection = [
            ...this.state.subAssignedContacts,
            ...this.state.relationContacts,
            ...this.state.baptizedByContacts,
            ...this.state.coachedByContacts,
            ...this.state.coachedContacts,
            ...this.state.usersContacts,
          ];
          break;
        }
        case 'groups': {
          collection = [...this.state.connectionGroups, ...this.state.groups];
          isGroup = true;
          break;
        }
        default: {
          break;
        }
      }
      mappedValue = renderConnectionLink(value, collection, isGroup);
    }
    return mappedValue;
  };

  return <>{editing ? <ConnectionFieldEdit /> : <ConnectionFieldView />}</>;
};
export default ConnectionField;
