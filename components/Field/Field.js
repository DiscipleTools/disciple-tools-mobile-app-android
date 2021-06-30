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

const Field = ({ post, field }) => {
  console.log('*** FIELD RENDER ***');

  //const ref = useRef(null);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const locale = useSelector((state) => state.i18nReducer.locale);

  // validate to confirm that post has the field name and value(s)
  const fieldName = field.name;
  console.log(`FIELD NAME: ${fieldName}`);
  const fieldType = field.type;
  console.log(`FIELD TYPE: ${fieldType}`);
  if (!post.hasOwnProperty(fieldName)) return null;
  const value = post[fieldName];
  if (value?.length < 1) return null;

  const [state, setState] = useState({
    editing: null,
    //initialValue: value,
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

  // TODO: use Constants
  const FieldComponent = () => {
    switch (fieldType) {
      case 'communication_channel': {
        return (
          <CommunicationChannelField
            name={field.name}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      }
      case 'date': {
        return <DateField value={state.value} editing={state.editing} onChange={onChange} />;
      }
      case 'key_select': {
        return (
          <KeySelectField
            name={field.name}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      }
      /*
      case 'location': {
        return <LocationField value={postValue} editing />;
      }
      case 'connection': {
        //return <ConnectionField field={field} value={postValue} editing />;
        return null;
      }
      case 'multi_select': {
        return <MultiSelectField field={field} value={postValue} editing />;
      }
      case 'user_select': {
        const defaultValue = postValue?.key ?? postValue;
        return <UserSelectField value={defaultValue} editing />;
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
