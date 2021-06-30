import React, { useState } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

//import Field from 'components/Field';
import Field from 'components/Field/Field';
import FieldIcon from 'components/Field/FieldIcon';

import { showToast } from 'helpers';
import Colors from 'constants/Colors';
import i18n from 'languages';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { styles } from './Tile.styles';

const Tile = ({ post, fields }) => {
  console.log('*** TILE RENDER ***');

  const editing = useSelector((state) => state.appReducer.editing);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  //const [refreshing, setRefreshing] = useState(false);

  const isRequiredField = (field) => {
    const name = field.name;
    if (name === 'name') return true;
    return false;
  };

  const setFieldContentStyle = (field) => {
    //if (isRequiredField(field)) console.log(`------------- POST[FIELD.NAME]: ${ JSON.stringify(post[field.name]) } ------------`);
    const type = field.type;
    const name = field.name;
    let newStyles = {};
    // TODO: use Constants
    if (type == 'key_select' || type == 'user_select') {
      newStyles = {
        ...styles.contactTextRoundField,
        paddingRight: 10,
      };
    }
    /* TODO: move this bc we do not have post here?
    if (isRequiredField(field)) {
      newStyles = {
        ...newStyles,
        backgroundColor: '#FFE6E6',
        borderWidth: 2,
        borderColor: Colors.errorBackground,
      };
    }
    */
    return newStyles;
  };

  const isUndecoratedField = (field) => {
    const name = field?.name;
    const type = field?.type;
    // TODO: use Constants
    return (
      name == 'overall_status' ||
      name == 'milestones' ||
      name == 'group_status' ||
      name == 'health_metrics' ||
      name == 'members' ||
      type == 'communication_channel' ||
      (type == 'connection' && field.post_type === 'groups')
    );
  };

  const DecoratedField = ({ field }) => {
    const type = field.type;
    const name = field.name;
    const label = field.label;
    return (
      <Col>
        {editing ? (
          <>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <FieldIcon field={field} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>{label}</Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <FieldIcon field={field} />
                </View>
              </Col>
              <Col style={setFieldContentStyle(field)}>
                <Field post={post} field={field} />
              </Col>
            </Row>
            {/*isRequiredField(field) && (
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
                    {i18n.t('detailsScreen.requiredField')}
                  </Text>
                </Col>
              </Row>
            )*/}
          </>
        ) : (
          <>
            <Row style={[styles.formRow, { paddingTop: 15 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <FieldIcon field={field} />
              </Col>
              <Col>
                <View>
                  <Field post={post} field={field} />
                </View>
              </Col>
              <Col style={styles.formParentLabel}>
                <Label style={styles.formLabel}>{field.label}</Label>
              </Col>
            </Row>
          </>
        )}
      </Col>
    );
  };

  const hasFormDivider = (field) => {
    const name = field?.name;
    return !(name == 'overall_status' || name == 'group_status');
  };

  const Fields = () => {
    return (
      <>
        {fields
          //.filter((field) => field.name !== 'tags')
          .map((field, idx) => (
            <Field post={post} field={field} />
          ))}
      </>
    );
  };
  /*
            <>
              {isUndecoratedField(field) ? (
                <Field field={field} />
              ) : (
                <DecoratedField field={field} />
              )}
              {hasFormDivider(field) ? null : <View style={styles.formDivider} />}
            </>
  */

  /*
  const TileEdit = () => (
    <KeyboardAwareScrollView
      enableAutomaticScroll
      enableOnAndroid
      keyboardOpeningTime={0}
      extraScrollHeight={150}
      keyboardShouldPersistTaps={"handled"}
    >
      <View style={[styles.formContainer, { marginTop: 10, paddingTop: 0 }]}>
        <Fields />
      </View>
    </KeyboardAwareScrollView>
  );
  //<KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}>
  <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={10}
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      }}
  >
  */
  const TileEdit = () => (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={[styles.formContainer, { marginTop: 0 }]}>
        <Fields />
      </View>
    </ScrollView>
  );

  const TileView = () => (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      // TODO: pass 'mutate()' down or refresh up?
      //refreshControl={
      //<RefreshControl
      //refreshing={refreshing}
      //onRefresh={onRefresh}
      //}}
      ///>
      //}
    >
      <View style={[styles.formContainer, { marginTop: 0 }]}>
        <Fields />
      </View>
    </ScrollView>
  );

  //<View style={{ flex: 1 }}>
  return <TileEdit />;
  return <>{editing ? <TileEdit /> : <TileView />}</>;
};
export default React.memo(Tile);
