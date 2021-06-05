import React from 'react';
import { Platform } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../storybook/stories/CenterView';
import MultiSelect from './MultiSelect';
import FormField from './FormField';

storiesOf('Multi Select', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)

  .add('No selected items', () => (
    <MultiSelect
      items={[
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ]}
      placeholder="Select items"
    />
  ))

  .add('1 selected item', () => (
    <MultiSelect
      selectedItems={[{ value: 'item1', label: 'Item 1' }]}
      items={[
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ]}
      placeholder="Select items"
    />
  ))

  .add('2 selected items', () => (
    <MultiSelect
      selectedItems={[
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ]}
      items={[
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ]}
      placeholder="Select items"
    />
  ))

  .add('With form field', () => (
    <FormField label="Multi select" iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}>
      <MultiSelect
        selectedItems={[{ value: 'item1', label: 'Item 1' }]}
        items={[
          { value: 'item1', label: 'Item 1' },
          { value: 'item2', label: 'Item 2' },
        ]}
        placeholder="Select items"
      />
    </FormField>
  ));
