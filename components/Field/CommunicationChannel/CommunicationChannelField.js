import React, { useRef } from 'react';
import { Linking, Pressable, Text, TextInput } from 'react-native';
import { Icon } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
//import PropTypes from 'prop-types';

import useI18N from 'hooks/useI18N';

// TODO: refactor unused styles
import { styles } from './CommunicationChannelField.styles';

const CommunicationChannelField = ({ field, value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();

  const valueRef = useRef(value);

  const timerRef = useRef(null);

  const changeDelay = () => {
    if (timerRef.current !== null) {
      const timer = timerRef.current;
      clearTimeout(timer);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      onChange(valueRef.current);
    }, 2000);
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

  const onCommunicationFieldChange = (newValue, idx, key) => {
    if (newValue !== value[idx]) {
      const updatedValue = [...value];
      if (key) {
        updatedValue[idx] = { key, value: newValue };
      } else {
        updatedValue[idx] = { value: newValue };
      }
      valueRef.current = updatedValue;
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

  const CommunicationLink = ({ key, url, value }) => (
    <Pressable key={key} onPress={() => Linking.openURL(url)}>
      <Text
        style={[
          styles.linkingText,
          { marginTop: 'auto', marginBottom: 'auto' },
          isRTL ? { textAlign: 'left', flex: 1 } : {},
        ]}>
        {value}
      </Text>
    </Pressable>
  );

  const isValidHttp = (communicationChannelValue) => {
    return communicationChannelValue?.toLowerCase()?.includes('http');
  };

  const isValidTLD = (communicationChannelValue) => {
    const lowercaseValue = communicationChannelValue?.toLowerCase();
    return (
      lowercaseValue.includes('.com') ||
      lowercaseValue.includes('.net') ||
      lowercaseValue.includes('.org') ||
      lowercaseValue.includes('.me')
    );
  };

  const isValidPhone = (communicationChannelValue) => {
    // TODO: phone regex
    return field?.name?.includes('phone');
  };

  const isValidEmail = (communicationChannelValue) => {
    // TODO: email regex
    return field?.name?.includes('email');
  };

  const isValidURL = (communicationChannelValue) => {
    // TODO: URL regex
    return isValidHttp(communicationChannelValue) || isValidTLD(communicationChannelValue);
  };

  const CommunicationChannelFieldView = () => {
    console.log(`communication value: ${JSON.stringify(value)}`);
    return value.map((communicationChannel) => {
      const communicationChannelValue = communicationChannel.value;
      if (isValidPhone(communicationChannelValue)) {
        return (
          <CommunicationLink
            key={communicationChannel.key}
            url={'tel:' + communicationChannelValue}
            value={communicationChannelValue}
          />
        );
      } else if (isValidEmail(communicationChannelValue)) {
        return (
          <CommunicationLink
            key={communicationChannel.key}
            url={'mailto:' + communicationChannelValue}
            value={communicationChannelValue}
          />
        );
      } else if (isValidURL(communicationChannelValue)) {
        const url = isValidHttp(communicationChannelValue)
          ? communicationChannelValue
          : `https://${communicationChannelValue}`;
        return (
          <CommunicationLink
            key={communicationChannel.key}
            url={url}
            value={communicationChannelValue}
          />
        );
      } else {
        return (
          <Text
            style={[
              { marginTop: 'auto', marginBottom: 'auto' },
              isRTL ? { textAlign: 'left', flex: 1 } : {},
            ]}>
            {communicationChannelValue}
          </Text>
        );
      }
    });
  };

  return <>{editing ? <CommunicationChannelFieldEdit /> : <CommunicationChannelFieldView />}</>;
};
export default CommunicationChannelField;
