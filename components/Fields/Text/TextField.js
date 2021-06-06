import React from 'react';
import { View, Text, StyleSheet, TextInput, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import * as Icon from '@expo/vector-icons';

import i18n from 'languages';

const styles = StyleSheet.create({
  inputContainer: {
    alignSelf: 'stretch',
    marginVertical: 10,
    padding: 5,
    alignItems: 'flex-start',
  },
  inputLabel: {
    margin: 5,
  },
  inputLabelText: {
    color: '#555555',
  },
  inputRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  inputRowIcon: {
    marginHorizontal: 5,
  },
  inputRowTextInput: {
    textAlign: i18n.isRTL ? 'right' : 'left',
    padding: 5,
    flexGrow: 1,
  },
});

function TextField(props) {
  const {
    containerStyle,
    labelStyle,
    labelTextStyle,
    iconStyle,
    textInputStyle,
    iconName,
    label,
  } = props;

  const icon = iconName ? (
    <Icon.Ionicons name={iconName} size={25} style={[styles.inputRowIcon, iconStyle]} />
  ) : null;

  return (
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
}

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
export default TextField;
