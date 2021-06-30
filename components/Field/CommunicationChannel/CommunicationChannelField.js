import React, { useState } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, Input, Label } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import { Chip, Selectize } from 'react-native-material-selectize';
import PropTypes from 'prop-types';

// TODO: refactor unused styles
import { styles } from './CommunicationChannelField.styles';

// TODO: LINKING PHONE DIALER, EMAIL, etc...
const CommunicationChannelField = ({ name, value, editing, onChange }) => {
  console.log('*** COMMUNICATIONCHANNEL FIELD RENDER ***');
  console.log(`*** VALUE: ${JSON.stringify(value)} ***`);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const onAddCommunicationField = () => {
    onChange([
      ...value,
      {
        value: '',
      },
    ]);
  };

  //const onCommunicationFieldChange = (key, value, index, dbIndex, component) => {
  //const onCommunicationFieldChange = (newValue, idx) => {
  const onCommunicationFieldChange = (newValue) => {
    // TODO: does not work yet bc TabView component rerenders on TextInput
    console.log(`*** COMM FIELD CHANGE: ${JSON.stringify(newValue)}, idx: ${idx} ***`);
    //if (value[idx] !== newValue)
  };

  const onRemoveCommunicationField = (idx) => {
    const cloned = [...value];
    // splice occurs in-place, returns removed (unhandled)
    cloned.splice(idx, 1);
    onChange(cloned);
  };

  const getKeyboardType = () => {
    if (name.includes('phone')) return 'phone-pad';
    if (name.includes('email')) return 'email-address';
    return 'default';
  };

  const CommunicationChannelFieldEdit = () => {
    const keyboardType = getKeyboardType();
    return (
      <Col>
        <Row style={styles.formFieldMargin}>
          <Col style={styles.formIconLabel}>
            <Icon
              android="md-add"
              ios="ios-add"
              style={[styles.addRemoveIcons, styles.addIcons]}
              onPress={() => {
                onAddCommunicationField(name);
              }}
            />
          </Col>
        </Row>
        {value.map((communicationChannel, idx) => (
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <Input
                value={communicationChannel.value}
                onChangeText={onCommunicationFieldChange}
                style={styles.contactTextField}
                keyboardType={keyboardType}
              />
            </Col>
            <Col style={styles.formIconLabel}>
              <Icon
                android="md-remove"
                ios="ios-remove"
                style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
                onPress={() => onRemoveCommunicationField(idx)}
              />
            </Col>
          </Row>
        ))}
      </Col>
    );
  };

  const CommunicationChannelFieldView = () => {
    if (name.includes('phone')) {
      return value.map((communicationChannel, index) => (
        <TouchableOpacity
          key={index.toString()}
          activeOpacity={0.5}
          //onPress={() => {
          //  linkingPhoneDialer(communicationChannel.value);
          //}}
        >
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
    } else if (name.includes('email')) {
      return value.map((communicationChannel, index) => (
        <TouchableOpacity
          key={index.toString()}
          activeOpacity={0.5}
          //onPress={() => {
          //  Linking.openURL('mailto:' + communicationChannel.value);
          //}}
        >
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
          {value.map((communicationChannel) => communicationChannel.value).join(', ')}
        </Text>
      );
    }
  };

  //return(<CommunicationChannelFieldEdit/>);
  return <>{editing ? <CommunicationChannelFieldEdit /> : <CommunicationChannelFieldView />}</>;
};
export default CommunicationChannelField;
