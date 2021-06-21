import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Chip, Selectize } from 'react-native-material-selectize';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

// TODO: refactor unused styles
import { styles } from './CommunicationChannelField.styles';

const CommunicationChannelField = ({ field, value }) => {
  console.log('*** COMMUNICATIONCHANNEL FIELD RENDER ***');

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  // TODO: record[key]?
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

  const CommunicationChannelFieldEdit = () => {
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
                  <Icon type="FontAwesome" name="user" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <Input
                  value={communicationChannel.value}
                  onChangeText={(value) => {
                    onCommunicationFieldChange(field.name, value, index, communicationChannel.key);
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
  };

  const CommunicationChannelFieldView = () => {
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
  };

  return <>{editing ? <CommunicationChannelFieldEdit /> : <CommunicationChannelFieldView />}</>;
};
export default CommunicationChannelField;
