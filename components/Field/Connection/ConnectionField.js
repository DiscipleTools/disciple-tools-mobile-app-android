import React, { useState, useEffect, useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { useSelector } from 'react-redux';

import MultiSelect from 'components/MultiSelect';
import PostLink from 'components/PostLink';

// Custom Hooks
import useNetworkStatus from 'hooks/useNetworkStatus';
//import useDebounce from 'hooks/useDebounce.js';
import usePostType from 'hooks/usePostType';
import useUsers from 'hooks/useUsers';
import useList from 'hooks/useList';
import usePeopleGroups from 'hooks/usePeopleGroups';

import i18n from 'languages';

import {
  groupCircleIcon,
  groupDottedCircleIcon,
  groupChildIcon,
  groupParentIcon,
  groupPeerIcon,
  groupTypeIcon,
  swimmingPoolIcon,
} from 'constants/Icons';
import { styles } from './ConnectionField.styles';

const ConnectionField = ({ field, value, editing, onChange }) => {
  console.log(`connection field: ${JSON.stringify(field)}`);

  const isConnected = useNetworkStatus();

  const { isContact, isGroup, postType } = usePostType();
  // TODO: filter should be 2nd param so we can default it to null
  const { posts } = useList(null, postType);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const { users } = useUsers();
  if (!users) return null;

  // - state.users
  // - state.usersContacts
  //..................
  // - state.groups
  // - state.membersContacts
  // - state.users
  // - state.usersContacts
  // TODO:
  const ConnectionFieldEditPeopleGroups = () => {
    const { peopleGroups } = usePeopleGroups();
    if (!peopleGroups) return null;
    return (
      <MultiSelect
        items={peopleGroups}
        selectedItems={value?.values}
        onChange={onChange}
        placeholder={'zzzzz'}
      />
    );
  };

  const connectionsList = [
    ...value.values,
    { value: -1, name: 'ZZTest' },
    { value: -2, name: 'Timmy Testerton' },
    { value: -3, name: 'Jane Doe' },
  ];
  const ConnectionFieldEditDefault = () => (
    <MultiSelect
      items={connectionsList}
      selectedItems={value?.values}
      onChange={onChange}
      placeholder={'zzzzz'}
    />
  );

  const GroupView = () => {
    const { posts: contacts } = useList(null, 'contacts');
    const { posts: groups } = useList(null, 'groups');
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
            {value?.values?.map((group, index) => (
              <Col
                key={index.toString()}
                style={styles.groupCircleContainer}
                // TODO: onPress={() => goToGroupDetailScreen(group.value, group.name)}
              >
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
            ))}
          </ScrollView>
        </Row>
        <View style={styles.formDivider} />
      </Grid>
    );
  };

  const ContactView = () => (
    <>
      {value?.values?.map((connection) => (
        <PostLink id={connection?.value} title={connection?.name} type={'contacts'} />
      ))}
    </>
  );

  /* TODO: load appropriate connectionLists
    if (field.name === 'people_groups') {
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
          collection = [
            ...this.state.connectionGroups,
             ...this.state.groups];
          isGroup = true;
          break;
        }
        default: {
          break;
        }
      }
  */
  const ConnectionFieldEdit = () => {
    return (
      <>
        {field?.name === 'people_groups' ? (
          <ConnectionFieldEditPeopleGroups />
        ) : (
          <ConnectionFieldEditDefault />
        )}
      </>
    );
  };

  const ConnectionFieldView = () => {
    return <>{isGroup ? <GroupView /> : <ContactView />}</>;
  };

  return <>{editing ? <ConnectionFieldEdit /> : <ConnectionFieldView />}</>;
};
export default ConnectionField;
