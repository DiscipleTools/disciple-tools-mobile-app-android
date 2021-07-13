import React, { useState, useEffect, useRef } from 'react';
import { Linking, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

import useDebounce from 'hooks/useDebounce.js';

// TODO: refactor unused styles
import { styles } from './CommunicationChannelField.styles';

// TODO: LINKING PHONE DIALER, EMAIL, etc...
const CommunicationChannelField = ({ field, value, editing, onChange }) => {
  console.log('*** COMMUNICATIONCHANNEL FIELD RENDER ***');
  console.log(`*** VALUE: ${JSON.stringify(value)} ***`);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const valueRef = useRef(value);

  /*
  const debouncedValue = useDebounce(zzvalue, 1000);

  useEffect(() => {
    if (debouncedValue) {
      console.log(`debouncedValue: ${ JSON.stringify(debouncedValue)}`)
    }
  }, [debouncedValue]);
  */

  const timerRef = useRef(null);

  const changeDelay = () => {
    if (timerRef.current !== null) {
      const timer = timerRef.current;
      clearTimeout(timer);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      onChange(valueRef.current);
    }, 3000);
  };

  const onEndEditing = () => onChange(valueRef.current);

  const onAddCommunicationField = () => {
    onChange([
      ...value,
      {
        value: '',
      },
    ]);
  };

  //const onCommunicationFieldChange = (key, value, index, dbIndex, component) => {
  const onCommunicationFieldChange = (newValue, idx, key) => {
    console.log(`*** COMM FIELD CHANGE: ${JSON.stringify(newValue)}, idx: ${idx} ***`);
    if (newValue !== value[idx]) {
      const updatedValue = [...value];
      if (key) {
        updatedValue[idx] = { key, value: newValue };
      } else {
        updatedValue[idx] = { value: newValue };
      }
      valueRef.current = updatedValue;
      //onChange(updatedValue);
    }
  };

  const onRemoveCommunicationField = (idx, key) => {
    const newValue = [...value];
    // splice occurs in-place, returns removed (unhandled)
    newValue.splice(idx, 1);
    // ref: https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#communication_channel
    const apiValue = [{ key, delete: true }];
    onChange(newValue, apiValue);
  };

  const getKeyboardType = () => {
    if (field?.name?.includes('phone')) return 'phone-pad';
    if (field?.name?.includes('email')) return 'email-address';
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
                onAddCommunicationField();
              }}
            />
          </Col>
        </Row>
        {value.map((communicationChannel, idx) => (
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <TextInput
                defaultValue={communicationChannel.value}
                onChangeText={(newValue) => {
                  changeDelay();
                  onCommunicationFieldChange(newValue, idx, communicationChannel?.key);
                }}
                //onBlur={onEndEditing}
                onEndEditing={onEndEditing}
                style={styles.contactTextField}
                keyboardType={keyboardType}
              />
            </Col>
            <Col style={styles.formIconLabel}>
              <Icon
                android="md-remove"
                ios="ios-remove"
                style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
                onPress={() => onRemoveCommunicationField(idx, communicationChannel?.key)}
              />
            </Col>
          </Row>
        ))}
      </Col>
    );
  };

  const CommunicationChannelFieldView = () => {
    if (field?.name?.includes('phone')) {
      return value.map((communicationChannel, index) => (
        <TouchableOpacity
          key={index.toString()}
          activeOpacity={0.5}
          onPress={() => {
            Linking.openURL('tel:' + communicationChannel.value);
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
    } else if (field?.name?.includes('email')) {
      return value.map((communicationChannel, index) => (
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
          {value.map((communicationChannel) => communicationChannel.value).join(', ')}
        </Text>
      );
    }
  };

  //return(<CommunicationChannelFieldEdit/>);
  return <>{editing ? <CommunicationChannelFieldEdit /> : <CommunicationChannelFieldView />}</>;
};
export default CommunicationChannelField;
