import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import MultiSelect from 'components/MultiSelect';
import PostLink from 'components/PostLink';

// Custom Hooks
import usePostType from 'hooks/usePostType';
import useUsersContacts from 'hooks/useUsersContacts';
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
  const { isContact, isGroup, postType } = usePostType();

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const selectedItems = value?.values;

  const addConnection = (newValue) => {
    const exists = selectedItems.find((existingValue) => existingValue?.value === newValue?.ID);
    if (!exists)
      onChange({
        values: [
          ...selectedItems,
          {
            value: newValue.ID,
            name: newValue.name,
          },
        ],
      });
  };

  const PeopleGroupEdit = () => {
    const { peopleGroups } = usePeopleGroups();
    if (!peopleGroups) return null;
    return (
      <MultiSelect
        items={peopleGroups}
        selectedItems={selectedItems}
        onChange={onChange}
        customAdd={addConnection}
        placeholder={''}
      />
    );
  };

  const GroupEdit = () => {
    const mergedUsersContacts = useUsersContacts();
    // TODO: filter should be 2nd param so we can default it to null
    const { posts: groups } = useList(null, 'groups');
    if (!groups || !mergedUsersContacts) return null;
    return (
      <MultiSelect
        items={groups}
        selectedItems={selectedItems}
        onChange={onChange}
        customAdd={addConnection}
        placeholder={''}
      />
    );
  };

  const ContactEdit = () => {
    const mergedUsersContacts = useUsersContacts();
    if (!mergedUsersContacts) return null;
    return (
      <MultiSelect
        items={mergedUsersContacts}
        selectedItems={selectedItems}
        onChange={onChange}
        customAdd={addConnection}
        placeholder={''}
      />
    );
  };

  const PeopleGroupView = () => (
    <>
      {selectedItems.map((connection) => (
        <PostLink id={connection?.ID} title={connection?.name} type={'people_groups'} />
      ))}
    </>
  );

  const GroupView = () => {
    const navigation = useNavigation();
    //const { posts: contacts } = useList(null, 'contacts');
    //const { posts: groups } = useList(null, 'groups');
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
            {selectedItems.map((group, index) => {
              const id = group?.value;
              const title = group?.name;
              // TODO: constant?
              const type = 'groups';
              return (
                <Col
                  key={index.toString()}
                  style={styles.groupCircleContainer}
                  onPress={() => {
                    navigation.push('Details', {
                      id,
                      name: title,
                      type,
                      //onGoBack: () => onRefresh(),
                    });
                  }}>
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
              );
            })}
          </ScrollView>
        </Row>
        <View style={styles.formDivider} />
      </Grid>
    );
  };

  const ContactView = () => (
    <>
      {selectedItems.map((connection) => (
        <PostLink id={connection?.value} title={connection?.name} type={'contacts'} />
      ))}
    </>
  );

  const ConnectionFieldEdit = () => {
    if (field?.name === 'people_groups') return <PeopleGroupEdit />;
    if (isGroup) return <GroupEdit />;
    return <ContactEdit />;
  };

  const ConnectionFieldView = () => {
    if (field?.name === 'people_groups') return <PeopleGroupView />;
    if (isGroup) return <GroupView />;
    return <ContactView />;
  };

  return <>{editing ? <ConnectionFieldEdit /> : <ConnectionFieldView />}</>;
};
export default ConnectionField;
