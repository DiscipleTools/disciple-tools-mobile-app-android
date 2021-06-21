import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Image, Icon, Label, Picker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// Custom Hooks
import usePostType from 'hooks/usePostType.js';
import useSettings from 'hooks/useSettings.js';

import Colors from 'constants/Colors';
import statusIcon from 'assets/icons/status.png';

import { styles } from './KeySelectField.styles';

const KeySelectField = ({ field, value }) => {
  console.log('*** KEY SELECT FIELD RENDER ***');

  const name = field.name;

  const { isContact, isGroup, postType } = usePostType();
  const statusField = isContact ? 'overall_status' : 'group_status';

  const { settings, error: settingsError } = useSettings();

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const renderStatusPickerItems = () => {
    Object.keys(settings.fields[statusField].values).map((key) => {
      const optionData = settings.fields[statusField].values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });
  };

  const KeySelectFieldEdit = () => {
    if (name === 'overall_status') {
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
                    //TODO:borderColor: state.overallStatusBackgroundColor,
                    //TODO:backgroundColor: state.overallStatusBackgroundColor,
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
                    //TODO:backgroundColor: state.overallStatusBackgroundColor,
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
                    settings.fields[`reason_${record.overall_status}`].values[
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
    } else if (name === 'group_status') {
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
                    //TODO:borderColor: state.groupStatusBackgroundColor,
                    //TODO:backgroundColor: state.groupStatusBackgroundColor,
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
                    //TODO:backgroundColor: state.groupStatusBackgroundColor,
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
          //TODO:selectedValue={record[name]}
          onValueChange={(value) => {
            // TODO:
            //setContactCustomFieldValue(name, value)
            //setGroupCustomFieldValue(name, value)}
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
  };

  /*
            {Object.prototype.hasOwnProperty.call(post, `reason_${post.overall_status}`) ? (
              <Text>
                (
                {
                  settings.fields[`reason_${post.overall_status}`].values[
                    post[`reason_${post.overall_status}`]
                  ].label
                }
                )
              </Text>
            ) : null}
*/
  const KeySelectFieldView = () => {
    console.log(`name: ${name} `);
    return null;
    if (name === 'overall_status') {
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
                    //TODO:borderColor: state.overallStatusBackgroundColor,
                    //TODO:backgroundColor: state.overallStatusBackgroundColor,
                  },
                }),
              ]}>
              <Picker
                selectedValue={value}
                // TODO
                //onValueChange={setContactStatus}
                style={Platform.select({
                  android: {
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                  },
                  ios: {
                    //TODO:backgroundColor: state.overallStatusBackgroundColor,
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
            <Text>ZZZZZZZZ</Text>
          </Row>
        </Col>
      );
    } else if (name === 'group_status') {
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
                    //TODO:borderColor: state.groupStatusBackgroundColor,
                    //TODO:backgroundColor: state.groupStatusBackgroundColor,
                  },
                }),
              ]}>
              <Picker
                selectedValue={value}
                // TODO
                //onValueChange={setGroupStatus}
                style={Platform.select({
                  android: {
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                  },
                  ios: {
                    //TODO:backgroundColor: state.groupStatusBackgroundColor,
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
      console.log(`field: ${field}`);
      return (
        <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>
          {field?.default?.value ? field?.default?.value?.label : ''}
        </Text>
      );
    }
  };

  return <>{editing ? <KeySelectFieldEdit /> : <KeySelectFieldView />}</>;
};
export default KeySelectField;
