import React, { useState } from 'react';
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
import { Label, Input, Icon, Picker, DatePicker, Textarea, Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { isIOS, showToast } from 'helpers';
import Colors from 'constants/Colors';
import i18n from 'languages';

import Field from 'components/Fields/Field';
import FieldValue from 'components/Fields/FieldValue';
import FieldIcon from 'components/Fields/FieldIcon';

import { styles } from './CustomView.styles';

// TODO: move to constants
const POST_TYPE_CONTACT = 'contacts';
const POST_TYPE_GROUP = 'groups';

const CustomView = ({ state, fields, create }) => {
  // TODO:
  // - state.nameRequired
  const setFieldContentStyle = (field) => {
    let newStyles = {};
    if (field.type == 'key_select' || field.type == 'user_select') {
      newStyles = {
        ...styles.contactTextRoundField,
        paddingRight: 10,
      };
    }
    if (field.name == 'name' && state.nameRequired) {
      newStyles = {
        ...newStyles,
        backgroundColor: '#FFE6E6',
        borderWidth: 2,
        borderColor: Colors.errorBackground,
      };
    }
    return newStyles;
  };

  //{state.onlyView && create === false||undefined ? (
  // TODO:
  // - state.loading
  return (
    <View style={{ flex: 1 }}>
      {true ? (
        <View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={state.loading}
                onRefresh={() => {
                  // TODO:
                  //onRefresh(state.contact.ID)
                  //onRefresh(state.group.ID)
                }}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 0 }]}>
              {fields.map((field, index) => (
                <View key={index.toString()}>
                  {field.name == 'overall_status' ||
                  field.name == 'milestones' ||
                  field.name == 'group_status' ||
                  field.name == 'health_metrics' ||
                  field.name == 'members' ||
                  (field.type == 'connection' && field.post_type === POST_TYPE_GROUP) ? (
                    <FieldValue state={state} field={field} />
                  ) : (
                    <Row style={[styles.formRow, { paddingTop: 15 }]}>
                      <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                        <FieldIcon field={field} detailMode />
                      </Col>
                      <Col>
                        <View>
                          <FieldValue state={state} field={field} />
                        </View>
                      </Col>
                      <Col style={styles.formParentLabel}>
                        <Label style={styles.formLabel}>{field.label}</Label>
                      </Col>
                    </Row>
                  )}
                  {field.name == 'overall_status' || field.name == 'group_status' ? null : (
                    <View style={styles.formDivider} />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <KeyboardAwareScrollView
          enableAutomaticScroll
          enableOnAndroid
          keyboardOpeningTime={0}
          extraScrollHeight={150}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.formContainer, { marginTop: 10, paddingTop: 0 }]}>
            {fields
              .filter((field) => field.name !== 'tags')
              .map((field, index) => (
                <View key={index.toString()}>
                  {field.name == 'overall_status' ||
                  field.name == 'milestones' ||
                  field.name == 'group_status' ||
                  field.name == 'health_metrics' ||
                  field.type == 'communication_channel' ? (
                    <Field state={state} field={field} />
                  ) : (
                    <Col>
                      <Row style={styles.formFieldMargin}>
                        <Col style={styles.formIconLabelCol}>
                          <View style={styles.formIconLabelView}>
                            <FieldIcon field={field} />
                          </View>
                        </Col>
                        <Col>
                          <Label style={styles.formLabel}>{field.label}</Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={styles.formIconLabelCol}>
                          <View style={styles.formIconLabelView}>
                            <FieldIcon field={field} hideIcon />
                          </View>
                        </Col>
                        <Col style={setFieldContentStyle(field)}>
                          <Field state={state} field={field} />
                        </Col>
                      </Row>
                      {field.name == 'name' && state.nameRequired ? (
                        <Row>
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
                            <Text style={styles.validationErrorMessage}>
                              {i18n.t('contactDetailScreen.fullName.error')}
                              {/*TODO:i18n.t('groupDetailScreen.groupName.error')*/}
                            </Text>
                          </Col>
                        </Row>
                      ) : null}
                    </Col>
                  )}
                </View>
              ))}
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};
export default CustomView;
