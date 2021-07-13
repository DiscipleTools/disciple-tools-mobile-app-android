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
import UserSelectField from 'components/Field/UserSelect/UserSelectField';

import i18n from 'languages';

import { styles } from './Field.styles';

const Field = ({ post, field, save }) => {
  //console.log(`FIELD: ${JSON.stringify(field)}`);

  //const ref = useRef(null);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const locale = useSelector((state) => state.i18nReducer.locale);

  // validate to confirm that post has the field name and value(s)
  if (!post.hasOwnProperty(field?.name)) return null;
  const value = post[field?.name];
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

  const isUndecoratedField = () => {
    const name = field?.name;
    const type = field?.type;
    return (
      name === 'milestones' ||
      name === 'health_metrics' ||
      name === 'parent_groups' ||
      name === 'peer_groups' ||
      name === 'child_groups' //||
      //name == 'members' // ||
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
      console.log('_______________API SAVE _________');
      console.log(`state.apiValue: ${state.apiValue}`);
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

  // TODO
  //console.log(`state.value: ${ JSON.stringify(state.value) }`)
  //console.log(`value: ${ JSON.stringify(value) }`)
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
      {JSON.stringify(state.value) !== JSON.stringify(value) && (
        <Row>
          <Pressable onPress={() => onSave()}>
            <Icon
              type={'MaterialIcons'}
              name={'save'}
              style={[styles.fieldActionIcon, { fontSize: 32, marginTop: 'auto' }]}
            />
          </Pressable>
        </Row>
      )}
    </Col>
  );

  const FieldComponent = () => {
    switch (field?.type) {
      case 'boolean':
        return null;
      // TODO: implement (as read-only Switch?)
      //return <BooleanField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'communication_channel':
        // TODO: RTL, styles
        return (
          <CommunicationChannelField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'connection':
        // TODO: RTL, style, (*)lists
        console.log(`..................FIELD: ${JSON.stringify(field)}`);
        return (
          <ConnectionField
            field={field}
            value={state.value}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'date':
        // TODO: RTL, style, better component?
        return <DateField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'key_select':
        // TODO: RTL, style
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
        // TODO: RTL, style
        return <LocationField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'multi_select':
        // TODO: RTL, style, (*)save, (*)"defaults"/lists
        return (
          <MultiSelectField
            value={state.value}
            options={field?.default}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'number':
        // TODO: RTL, style
        return <NumberField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'post_user_meta':
        return null;
      //return <PostUserMetaField value={state.value} editing={state.editing} onChange={onChange} />;
      case 'tags':
        // TODO: RTL, style
        return (
          <TagsField
            value={state.value}
            options={post?.tags?.values}
            editing={state.editing}
            onChange={onChange}
          />
        );
      case 'user_select':
        // TODO: RTL, style
        return <UserSelectField value={state.value} editing={state.editing} onChange={onChange} />;
      default:
        // TODO: RTL, style
        return <TextField value={state.value} editing={state.editing} onChange={onChange} />;
    }
  };

  if (isUndecoratedField() && !state.editing)
    return (
      <Grid>
        <Row style={[state.editing ? styles.raisedBox : null, styles.formRow]}>
          <Col size={11}>
            <FieldComponent />
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
