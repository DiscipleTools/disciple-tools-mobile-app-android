import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

import { storiesOf } from '@storybook/react-native';
import colors from '../constants/Colors';
import CenterView from '../storybook/stories/CenterView';
import TextFieldMultiple from './Fields/Text/TextFieldMultiple';
import FormField from './FormField';

const styles = StyleSheet.create({
  basicContainer: {
    margin: 10,
    borderBottomWidth: 1,
    borderColor: '#7a7a7a',
    marginLeft: 40,
    marginRight: 40,
  },
  customContainer: {
    margin: 20,
  },
  customIcon: {
    color: colors.tintColor,
  },
  customLabel: {},
  customInput: {
    color: '#ffffff',
  },
});

storiesOf('Form Field', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)

  .add('Inline', () => (
    <FormField
      label="Assigned to"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={styles.customContainer}
      iconStyle={styles.customIcon}
      inline>
      <Text>1, 2, 3</Text>
    </FormField>
  ))

  .add('Block', () => (
    <FormField label="Assigned to" iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}>
      <TextFieldMultiple
        placeholder="Agent name"
        textInputValue={[
          {
            key: 999,
            value: 'my sample value',
          },
          {
            key: 998,
            value: 'you should not see this',
            delete: true,
          },
        ]}
        onChange={() => {}}
      />
    </FormField>
  ))

  .add('Block Custom Styles', () => (
    <FormField
      label="Assigned to"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={styles.customContainer}
      iconStyle={styles.customIcon}>
      <TextFieldMultiple
        placeholder="Agent name"
        textInputValue={[
          {
            key: 999,
            value: 'my sample value',
          },
          {
            key: 998,
            value: 'you should not see this',
            delete: true,
          },
        ]}
        textInputStyle={{ color: 'green' }}
        onChange={() => {}}
      />
    </FormField>
  ));
