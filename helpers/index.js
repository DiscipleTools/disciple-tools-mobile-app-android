// helpers = stateful, and may contain components
// utils = stateles
import React from 'react';
import { Platform } from 'react-native';
import { Picker, Toast } from 'native-base';
import PropTypes from 'prop-types';

import locales from 'languages/locales';
import i18n from 'languages';

// { key: 1, label: "mylabel", value: "myval" }
/*
export const renderPickerItem = (item) => (
  <Picker.Item key={item.key} label={item.label} value={item.value} />
);
*/
export const isIOS = Platform.OS === 'ios';

export const renderCreationFields = (settings) => {
  if (!settings?.tiles) return [];
  let creationFields = [];
  settings.tiles.forEach((tile) => {
    let creationFieldsByTile = tile.fields.filter(
      (field) =>
        Object.prototype.hasOwnProperty.call(field, 'in_create_form') &&
        field.in_create_form === true,
    );
    if (creationFieldsByTile.length > 0) {
      creationFields.push(...creationFieldsByTile);
    }
  });
  return creationFields;
};

export const isContact = (moduleType) => {
  return moduleType === 'contacts';
};

export const isGroup = (moduleType) => {
  return moduleType === 'groups';
};

export const getModuleType = (route) => {
  // TODO: use string contains?
  const moduleType = route?.name?.toLowerCase().replace('detail', '');
  if (moduleType) return moduleType;
  // default to contact type
  return 'contacts';
};

export const getTabRoutes = (settings) => {
  if (!settings?.tiles) return [];
  return [
    ...settings.tiles.map((tile) => {
      return {
        key: tile.name,
        title: tile.label,
      };
    }),
    {
      key: 'comments',
      title: i18n.t('global.commentsActivity'),
    },
  ];
};

// TODO: refactor to use renderPickerItems above?
//renderPickerItem({ key: locale.code, label: locale.name, value: locale.code })
export const renderLanguagePickerItems = locales.map((locale) => (
  <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
));

// NOTE: wait half second to allow for collapse of virtual keyboard before showing Toast
const DEFAULT_WAIT = 500;
export const showToast = (message, error = false) => {
  if (error) {
    const text = `${i18n.t('global.error.text')} ${message}`;
    setTimeout(() => {
      Toast.show({
        text,
        duration: 5000,
        type: 'danger',
      });
    }, DEFAULT_WAIT);
  } else {
    setTimeout(() => {
      Toast.show({
        text: message,
        duration: 3000,
      });
    }, DEFAULT_WAIT);
  }
};

export const withPropsValidation = (propTypes, props) => {
  PropTypes.checkPropTypes(propTypes, props, 'prop', '');
  return props;
};

/*
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
*/
