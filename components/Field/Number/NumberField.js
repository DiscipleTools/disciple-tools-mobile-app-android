import React from 'react';
import { Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
//import { Input } from 'native-base';

import { styles } from './NumberField.styles';

const NumberField = ({ value, editing, onChange }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const handleChange = (newValue) => {
    if (newValue !== value) onChange(newValue);
  };

  // TODO: persist keyboard while typing
  const NumberFieldEdit = () => (
    <TextInput
      value={value}
      keyboardType="numeric"
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
