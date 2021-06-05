import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import colors from '../constants/Colors';
import CenterView from '../storybook/stories/CenterView';
import TextField from './TextField';

const styles = StyleSheet.create({
  basicContainer: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  customContainer: {
    margin: 20,
    backgroundColor: colors.tintColor,
  },
  errorContainer: {
    margin: 20,
    backgroundColor: '#FFE6E6',
    borderWidth: 2,
    borderColor: 'red',
  },
  customIcon: {
    color: colors.accent,
  },
  customLabel: {},
  customLabelText: {
    color: '#ffffff',
  },
  customInput: {
    color: '#ffffff',
  },
  customPlaceholder: {
    color: '#ccc',
  },
});

storiesOf('Text Field', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .add('Basic', () => (
    <TextField
      label="Basic Form Field"
      placeholder="Enter a value"
      containerStyle={styles.basicContainer}
    />
  ))
  .add('with Icon', () => (
    <TextField
      label="Icon Field"
      placeholder="Enter a value"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={styles.basicContainer}
    />
  ))
  .add('Custom Styles', () => (
    <TextField
      label="Custom Styles"
      placeholder="Enter a value"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={styles.customContainer}
      iconStyle={styles.customIcon}
      labelStyle={styles.customLabel}
      labelTextStyle={styles.customLabelText}
      textInputStyle={styles.customInput}
      placeholderTextColor="#aaccaa"
    />
  ))
  .add('with Error Styles', () => (
    <TextField
      label="Error Styles"
      placeholder="Enter a value"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={styles.errorContainer}
    />
  ));
