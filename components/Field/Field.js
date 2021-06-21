import React from 'react';
import { useSelector } from 'react-redux';

// Custom Hooks
import useId from 'hooks/useId.js';
import useDetails from 'hooks/useDetails.js';

// Custom Components
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

const Field = ({ field }) => {
  console.log('*** FIELD RENDER ***');

  // TODO: merge with useDetails?
  const id = useId();
  const { post, error: postError } = useDetails(id);

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const locale = useSelector((state) => state.i18nReducer.locale);

  if (postError || !id) showToast(postError?.message || 'Error!', true);
  if (!post) return null;

  // validate to confirm that post has the field name and value(s)
  const fieldName = field.name;
  const fieldType = field.type;
  if (!post.hasOwnProperty(fieldName)) return null;
  const postValue = post[fieldName];
  if (postValue?.length < 1) return null;

  // TODO: use Constants
  switch (fieldType) {
    case 'location': {
      return <LocationField value={postValue} />;
    }
    case 'date': {
      return <DateField value={postValue} />;
    }
    case 'connection': {
      return <ConnectionField field={field} value={postValue} />;
    }
    case 'multi_select': {
      return <MultiSelectField field={field} value={postValue} />;
    }
    case 'communication_channel': {
      return <CommunicationChannelField field={field} value={postValue} />;
    }
    case 'key_select': {
      return <KeySelectField field={field} value={postValue} />;
    }
    case 'user_select': {
      const defaultValue = postValue?.key ?? postValue;
      return <UserSelectField value={defaultValue} />;
    }
    case 'number': {
      return <NumberField value={postValue} />;
    }
    case 'tags': {
      return <TagsField value={postValue} />;
    }
    case 'boolean': {
      /*
      return(
        <BooleanField value={postValue} />
      );
      */
    }
    case 'post_user_meta': {
      /*
      return(
        <PostUserMetaField value={postValue} />
      );
      */
    }
    default: {
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
  return null;
};
export default Field;
