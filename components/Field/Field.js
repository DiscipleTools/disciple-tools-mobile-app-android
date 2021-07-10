import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, Label } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';

// Custom Components
import FieldIcon from 'components/Field/FieldIcon';
import BooleanField from 'components/Field/Boolean/BooleanField';
import CommunicationChannelField from 'components/Field/CommunicationChannel/CommunicationChannelField';
import ConnectionField from 'components/Field/Connection/ConnectionField';
import DateField from 'components/Field/Date/DateField';
import KeySelectField from 'components/Field/KeySelect/KeySelectField';
import LocationField from 'components/Field/Location/LocationField';
import MultiSelectField from 'components/Field/MultiSelect/MultiSelectField';
import NumberField from 'components/Field/Number/NumberField';
import TagsField from 'components/Field/Tags/TagsField';
import TextField from 'components/Field/Text/TextField';
import ZZTextField from 'components/Field/Text/ZZTextField';
import UserSelectField from 'components/Field/UserSelect/UserSelectField';

import i18n from 'languages';

import { styles } from './Field.styles';

const Field = ({ post, field, save }) => {
  //console.log(`FIELD: ${JSON.stringify(field)}`);

  //const ref = useRef(null);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const locale = useSelector((state) => state.i18nReducer.locale);

  // validate to confirm that post has the field name and value(s)
  if (!post.hasOwnProperty(field.name)) return null;
  const value = post[field.name];
  if (value?.length < 1) return null;

  /*
  NOTE: the difference between value and apiValue:

  'value': the value returned from the API that we use to control components,
  and so we need to keep this consistent for handling 'onChange' events and
  future API reads

  'apiValue': this is used only when format to update the API differs from the
  format that the API returns upon reads (eg, 'user_select' fields)
  https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#user_select

  'user_select' read: 
 {"assigned_to":{"key":2,"label":"Jane Doe (multiplier)"}} 

  'user_select' write:
  { "assigned_to": 2 }
  */
  const [state, setState] = useState({
    editing: null,
    value,
    apiValue: null,
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
    setState({
      ...state,
      editing: false,
    });
    /*
    if field requires a different API write format,
    then we'll use that (populated in 'onChange')
    */
    if (state.apiValue !== null) {
      save(field.name, state.apiValue);
      return;
    }
    save(field.name, state.value);
  };

  const onCancel = () => {
    setState({
      ...state,
      editing: false,
      value, // initialValue
      apiValue: null,
    });
  };

  const onChange = (newValue, apiValue = null) => {
    console.log('$$$$$$ ON CHANGE $$$$$$');
    console.log(`newValue: ${JSON.stringify(newValue)}`);
    console.log(`apiValue: ${JSON.stringify(apiValue)}`);
    setState({
      ...state,
      value: newValue,
      apiValue,
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

  const FieldComponent = () => {
    switch (field.type) {
      case 'boolean':
        // TODO: implement (as read-only Switch?)
        return <BooleanField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'communication_channel':
        // TODO: Linking, handle change, save
        return (
          <CommunicationChannelField
            name={field.name}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'connection':
        // TODO: Lists
        return (
          <ConnectionField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'date':
        // TODO: formatting?
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
      //case 'location_grid':
      case 'location':
        // TODO: handle changes, save
        return <LocationField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'multi_select':
        // TODO: handle save
        return (
          <MultiSelectField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'number':
        // TODO: style
        return <NumberField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'post_user_meta':
        // TODO: implement
        return (
          <PostUserMetaField value={state.value} editing={state.editing} onChange={onChange} />
        );
      case 'tags':
        // TODO: style, implement edit
        return <TagsField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'user_select':
        // TODO: RTL
        return <UserSelectField value={state.value} editing={state.editing} onChange={onChange} />;
      default:
        //return null;
        // TODO: styling, onchange, save
        return <ZZTextField value={state.value} editing={state.editing} onChange={onChange} />;
        return (
          <TextField
            //accessibilityLabel={i18n.t('label', { locale })}
            //label={null}}
            //containerStyle={null}
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
            value={state.value}
            returnKeyType="next"
            textContentType="text"
            keyboardType="text"
            //disabled={state.loading}
            //placeholder={i18n.t('loginScreen.domain.placeholder', { locale })}
          />
        );
    }
  };

  return (
    <Grid>
      <Row style={[state.editing ? styles.raisedBox : null, styles.formRow]}>
        <Col size={1} style={styles.formIconLabel}>
          <FieldIcon field={field} />
        </Col>
        <Col size={2} style={styles.formParentLabel}>
          <Label style={styles.formLabel}>{field.label}</Label>
        </Col>
        <Col size={8}>
          <View style={styles.formComponent}>
            <FieldComponent />
          </View>
        </Col>
        {!state.editing && (
          <Col size={1} style={styles.formControls}>
            <DefaultControls />
          </Col>
        )}
        {state.editing && <EditControls />}
      </Row>
    </Grid>
  );
};
export default Field;
