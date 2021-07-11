import React, { useRef } from 'react';
import { Text, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
//import PropTypes from 'prop-types';

//import { styles } from './TextField.styles';

const TextField = ({ value, editing, onChange }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const inputRef = useRef(null);

  const handleChange = (newValue) => (inputRef.current.value = newValue);

  const handleEditingEnd = () => {
    const newValue = inputRef.current.value;
    if (newValue !== value) onChange(newValue);
  };

  const TextFieldEdit = () => (
    <TextInput
      ref={inputRef}
      defaultValue={value}
      onChangeText={handleChange}
      onEndEditing={handleEditingEnd}
      //value={value}
    />
  );

  const TextFieldView = () => (
    <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{value}</Text>
  );

  return <>{editing ? <TextFieldEdit /> : <TextFieldView />}</>;
};
export default TextField;
