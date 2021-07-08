import React, { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//import { styles } from './ZZTextField.styles';

const ZZTextField = ({ value, editing, onChange }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const handleChange = (newValue) => {
    if (newValue !== value) onChange(newValue);
  };

  const ZZTextFieldEdit = () => (
    <TextInput
      defaultValue={value}
      //onEndEditing={handleChange}
      onChangeText={handleChange}
    />
  );

  const ZZTextFieldView = () => (
    <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{value}</Text>
  );

  return <>{editing ? <ZZTextFieldEdit /> : <ZZTextFieldView />}</>;
};
export default ZZTextField;
