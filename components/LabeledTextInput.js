import React from 'react';
import { View, Text, TextInput, ViewPropTypes } from 'react-native';
import { Icon } from 'native-base';
//import PropTypes from 'prop-types';
//import * as Icon from '@expo/vector-icons';

import useI18N from 'hooks/useI18N';

import { styles } from './LabeledTextInput.styles';

const LabeledTextInput = (props) => {
  const {
    containerStyle,
    labelStyle,
    labelTextStyle,
    iconStyle,
    textInputStyle,
    iconName,
    label,
    value,
    editing,
  } = props;

  const { i18n, isRTL } = useI18N();

  /*
  const inputRef = useRef(null);

  const handleChange = (newValue) => {
    inputRef.current.value = newValue;
  };

  const handleEditingEnd = () => {
    const newValue = inputRef.current.value;
    if (newValue !== value) onChange(newValue);
  }

  const TextFieldEdit = () => {
    return(
      <TextInput
        ref={inputRef}
        //style={styles.input}
        onChangeText={handleChange}
        onEndEditing={handleEditingEnd}
        //defaultValue={value}
        value={value}
      />
    )
  };
  */

  const icon = iconName ? (
    <Icon
      type={'Ionicons'}
      name={iconName}
      style={[
        styles.inputRowIcon,
        iconStyle,
        i18n.isRTL ? { textAlign: 'right' } : { textAlign: 'left' },
      ]}
    />
  ) : null;

  const TextFieldEdit = () => (
    <View style={[styles.inputContainer, containerStyle]}>
      <View style={[styles.inputLabel, labelStyle]}>
        <Text style={[styles.inputLabelText, labelTextStyle]}>{label}</Text>
      </View>
      <View style={styles.inputRow}>
        {icon}
        <TextInput style={[styles.inputRowTextInput, textInputStyle]} {...props} />
      </View>
    </View>
  );

  const TextFieldView = () => (
    <View style={[styles.inputContainer, containerStyle]}>
      <View style={[styles.inputLabel, labelStyle]}>
        <Text style={[styles.inputLabelText, labelTextStyle]}>{label}</Text>
      </View>
      <View style={styles.inputRow}>
        {icon}
        <Text style={[styles.inputRowTextInput, textInputStyle]}>{value}</Text>
      </View>
    </View>
  );

  return <>{editing ? <TextFieldEdit /> : <TextFieldView />}</>;
};

/*
TextField.propTypes = {
  // Styles
  containerStyle: ViewPropTypes.style,
  labelStyle: ViewPropTypes.style,
  labelTextStyle: Text.propTypes.style,
  iconStyle: Text.propTypes.style,
  textInputStyle: Text.propTypes.style,
  // Config
  iconName: PropTypes.string,
  label: PropTypes.string.isRequired,
};
TextField.defaultProps = {
  containerStyle: null,
  labelStyle: null,
  labelTextStyle: null,
  iconStyle: null,
  textInputStyle: null,
  iconName: null,
};
*/
export default LabeledTextInput;
