import React, { useState, useEffect, useRef } from 'react';
import { Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Icon, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// Custom Hooks
import useDetails from 'hooks/useDetails.js';

// Custom Components
import FieldIcon from 'components/Field/FieldIcon';
import LocationField from 'components/Field/Location/LocationField';
import DateField from 'components/Field/Date/DateField';
import ConnectionField from 'components/Field/Connection/ConnectionField';
import NumberField from 'components/Field/Number/NumberField';
import KeySelectField from 'components/Field/KeySelect/KeySelectField';
import MultiSelectField from 'components/Field/MultiSelect/MultiSelectField';
import UserSelectField from 'components/Field/UserSelect/UserSelectField';
import CommunicationChannelField from 'components/Field/CommunicationChannel/CommunicationChannelField';
import TextField from 'components/Field/Text/TextField';

import i18n from 'languages';
import { showToast } from 'helpers';

import { styles } from './Field.styles';

const Field = ({ post, field, save }) => {
  console.log('*** FIELD RENDER ***');

  //const ref = useRef(null);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const locale = useSelector((state) => state.i18nReducer.locale);

  console.log(`FIELD: ${JSON.stringify(field)}`);
  // validate to confirm that post has the field name and value(s)
  if (!post.hasOwnProperty(field.name)) return null;
  const value = post[field.name];
  if (value?.length < 1) return null;

  const [state, setState] = useState({
    editing: null,
    value,
  });

  /*
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        alert("You clicked outside of me!");
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  */

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

  const onSave = () => {
    console.log('*** ON SAVE ***');
    setState({
      ...state,
      editing: false,
    });
    save(field.name, state.value);
  };

  const onCancel = () => {
    console.log('*** ON CANCEL ***');
    setState({
      ...state,
      editing: false,
      value, //state.initialValue
    });
  };

  const onChange = (newValue) => {
    console.log(`$$$$$$ ON CHANGE - newValue: ${JSON.stringify(newValue)} $$$$$$`);
    setState({
      ...state,
      value: newValue,
    });
  };

  const DefaultControls = () => (
    <Pressable
      onPress={() => {
        setState({
          ...state,
          editing: true,
        });
      }}>
      <Icon type={'MaterialIcons'} name={'edit'} style={styles.fieldActionIcon} />
    </Pressable>
  );

  const EditControls = () => (
    <Col style={{ marginRight: 15 }}>
      <Row>
        <Pressable onPress={() => onCancel()}>
          <Icon
            type={'MaterialIcons'}
            name={'close'}
            style={[styles.fieldActionIcon, { borderWidth: 0 }]}
          />
        </Pressable>
      </Row>
      <Row>
        <Pressable onPress={() => onSave()}>
          <Icon
            type={'MaterialIcons'}
            name={'save'}
            style={[styles.fieldActionIcon, { fontSize: 32, marginTop: 'auto' }]}
          />
        </Pressable>
      </Row>
    </Col>
  );

  //console.log("******* POST *********");
  //console.log(JSON.stringify(post));
  // TODO: use Constants
  const FieldComponent = () => {
    switch (field.type) {
      case 'communication_channel':
        return (
          <CommunicationChannelField
            name={field.name}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'connection':
        return (
          <ConnectionField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'date':
        return <DateField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'key_select':
        // TODO: field->options={field.default}
        return (
          <KeySelectField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'multi_select':
        return (
          <MultiSelectField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'user_select':
        return <UserSelectField value={state.value} editing={state.editing} onChange={onChange} />;
      /*
      case 'location': {
        return <LocationField value={postValue} editing />;
      }
      case 'number': {
        return <NumberField value={postValue} editing />;
      }
      case 'tags': {
        return <TagsField value={postValue} editing />;
      }
      case 'boolean': {
        //return(
        //  <BooleanField value={postValue} editing />
        //);
      }
      case 'post_user_meta': {
        //return(
        //  <PostUserMetaField value={postValue} editing />
        //);
      }
      */
      default: {
        return null;
        return (
          <TextField
            //accessibilityLabel={i18n.t('loginScreen.domain.label', { locale })}
            //label={i18n.t('loginScreen.domain.label', { locale })}
            //containerStyle={domainStyle}
            //iconName="ios-globe"
            onChangeText={(text) => {
              setState({
                ...state,
                domain: text,
              });
            }}
            textAlign={isRTL ? 'right' : 'left'}
            autoCapitalize="none"
            autoCorrect={false}
            value={postValue}
            returnKeyType="next"
            textContentType="text"
            keyboardType="text"
            //disabled={state.loading}
            //placeholder={i18n.t('loginScreen.domain.placeholder', { locale })}
          />
        );
      }
    }
  };

  return (
    <View style={{ overflow: 'hidden', paddingTop: 2, paddingBottom: 2 }}>
      <View style={state.editing ? styles.raisedBox : null}>
        <Grid>
          <Row style={[styles.formRow, { paddingTop: 15 }]}>
            <Col size={1} style={[styles.formIconLabel, { marginRight: 10 }]}>
              <FieldIcon field={field} />
            </Col>
            <Col size={7}>
              <View style={{ marginRight: 10 }}>
                <FieldComponent />
              </View>
            </Col>
            <Col size={2} style={styles.formParentLabel}>
              <Label style={styles.formLabel}>{field.label}</Label>
            </Col>
            {!state.editing && (
              <Col style={{ marginRight: 15 }}>
                <DefaultControls />
              </Col>
            )}
            {state.editing && <EditControls />}
          </Row>
        </Grid>
      </View>
    </View>
  );
};
export default Field;
