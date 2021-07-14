import React from 'react';
import { Text, TextInput } from 'react-native';
//import PropTypes from 'prop-types';

import useI18N from 'hooks/useI18N';

import { styles } from './NumberField.styles';

const NumberField = ({ value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();

  const handleChange = (newValue) => {
    if (newValue !== value) onChange(newValue);
  };

  const NumberFieldEdit = () => (
    <TextInput
      autoFocus={true}
      keyboardType="numeric"
      defaultValue={value}
      onChangeText={handleChange}
      // TODO: more consistent styling
      style={[styles.textField, isRTL ? { textAlign: 'left', flex: 1 } : {}]}
    />
  );

  const NumberFieldView = () => {
    return <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{value.toString()}</Text>;
  };

  return <>{editing ? <NumberFieldEdit /> : <NumberFieldView />}</>;
};
export default NumberField;
