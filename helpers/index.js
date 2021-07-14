// helpers = stateful, and may contain components
// utils = stateles
import React from 'react';
import { Platform } from 'react-native';
import { Picker } from 'native-base';
import PropTypes from 'prop-types';

import locales from 'languages/locales';

import { Html5Entities } from 'html-entities';

// TODO: useDevice
export const isIOS = Platform.OS === 'ios';

// TODO: refactor to use renderPickerItems above?
//renderPickerItem({ key: locale.code, label: locale.name, value: locale.code })
export const renderLanguagePickerItems = locales.map((locale) => (
  <Picker.Item label={locale.name} value={locale.code} key={locale.code} />
));

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
