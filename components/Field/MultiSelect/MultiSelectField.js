import React from 'react';
import { Text } from 'react-native';
//import PropTypes from 'prop-types';

import useI18N from 'hooks/useI18N';

import MultiSelect from 'components/MultiSelect';
import Milestones from 'components/Milestones';

import { styles } from './MultiSelectField.styles';

const MultiSelectField = ({ field, value, editing, onChange }) => {
  const { i18n, isRTL } = useI18N();

  const options = field?.default;
  const items = Object.keys(options).map((key) => {
    if (options[key].hasOwnProperty('key')) return options[key];
    // 'milestones' do not have a 'key' property, so we set one for consistency sake
    let option = options[key];
    option['key'] = key;
    return option;
  });

  const selectedItems = [];
  value?.values.forEach((selectedItem) => {
    items.find((option) => {
      if (option?.key === selectedItem?.value) {
        selectedItems.push(option);
      }
    });
  });

  const isMilestones = () => {
    return field?.name === 'milestones';
  };

  const MultiSelectFieldEdit = () => {
    const addSelection = (newValue) => {
      const exists = selectedItems.find((selectedItem) => selectedItem?.key === newValue?.key);
      if (!exists) {
        const apiValue = [...selectedItems, newValue].map((newValue) => {
          return { value: newValue?.key };
        });
        onChange({
          values: apiValue,
        });
      }
    };
    const removeSelection = (deletedValue) => {
      const idx = selectedItems.findIndex((value) => value?.key === deletedValue?.key);
      if (idx > -1) {
        const newValue = [...selectedItems];
        const removed = newValue.splice(idx, 1);
        const apiValue = newValue.map((newValue) => {
          return { value: newValue?.key };
        });
        onChange({
          values: apiValue,
          force_values: true,
        });
      }
    };
    console.log(`isMilestones? ${isMilestones()}`);
    if (isMilestones()) {
      return (
        <Milestones
          items={items}
          selectedItems={selectedItems}
          onChange={onChange}
          customAdd={addSelection}
          customRemove={removeSelection}
          // TODO
          postType={'contacts'}
          editing
        />
      );
    }
    return (
      <MultiSelect
        items={items}
        selectedItems={selectedItems}
        onChange={onChange}
        customAdd={addSelection}
        customRemove={removeSelection}
      />
    );
  };

  const MultiSelectFieldView = () => {
    if (isMilestones()) {
      return (
        <Milestones
          items={items}
          selectedItems={selectedItems}
          // TODO
          postType={'contacts'}
        />
      );
    }
    return (
      <>
        {selectedItems.map((selectedItem) => (
          <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{selectedItem?.label}</Text>
        ))}
      </>
    );
  };

  return <>{editing ? <MultiSelectFieldEdit /> : <MultiSelectFieldView />}</>;
};
/*
MultiSelect.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  placeholder: PropTypes.string,
};
MultiSelect.defaultProps = {
  items: [],
  selectedItems: [],
  placeholder: null,
};
*/
export default MultiSelectField;
