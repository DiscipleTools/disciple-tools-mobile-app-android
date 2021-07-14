import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Chip, Selectize } from 'react-native-material-selectize';

import { styles } from './MultiSelect.styles';

const MultiSelect = ({ items, selectedItems, onChange, placeholder, customAdd, customRemove }) => {
  /*
  Selectize component requires a consistent identifier,
  so we map any input to 'id' property
  */
  const mapItems = (itemsToMap) => {
    if (!itemsToMap || itemsToMap.length < 1) return itemsToMap;
    return itemsToMap.map((itemToMap) => {
      const mappedItem = { ...itemToMap };
      if (itemToMap?.value) mappedItem['id'] = itemToMap.value;
      if (itemToMap?.key) mappedItem['id'] = itemToMap.key;
      if (itemToMap?.ID) mappedItem['id'] = itemToMap.ID;
      return mappedItem;
    });
  };

  const mappedItems = mapItems(items);
  const mappedSelectedItems = mapItems(selectedItems);

  // TODO: milestones, sources
  //{"people_groups":{"values":[{"value":"23","name":"Arab Egyptian"},{"ID":33,"name":"Arab, Iraqi","label":"Arab, Iraqi"}]}}}
  // works:
  // -- connections,
  // -- locations,
  // -- tags
  const add = (newValue) => {
    console.log(`+++ addSelection: ${JSON.stringify(newValue)}`);
    // no longer need the 'id' (return original format)
    delete newValue['id'];
    if (customAdd) {
      customAdd(newValue);
      return;
    }
    const exists = selectedItems.find((value) => value?.value === newValue?.value);
    if (!exists)
      onChange({
        values: [...selectedItems, newValue],
      });
  };

  // TODO: milestones, sources
  // works:
  // -- connections,
  // -- locations,
  // -- tags
  const remove = (deletedValue) => {
    console.log(`--- removeSelection: ${JSON.stringify(deletedValue)}`);
    /*
    if (customRemove) {
      customRemove(deletedValue);
      return;
    }
    */
    const idx = selectedItems.findIndex((value) => value?.value === deletedValue?.value);
    if (idx > -1) {
      const newValues = [...selectedItems];
      const removed = newValues.splice(idx, 1);
      onChange({
        values: newValues,
        force_values: true,
      });
    }
  };

  return (
    <Selectize
      itemId={'id'}
      items={mappedItems}
      selectedItems={mappedSelectedItems}
      textInputProps={{
        onSubmitEditing: (text) => add({ value: text }),
        placeholder,
      }}
      renderRow={(id, onPress, item) => (
        <TouchableOpacity
          activeOpacity={0.6}
          key={id}
          onPress={() => add(item)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            {item?.avatar && <Image style={styles.avatar} source={{ uri: item?.avatar }} />}
            <Text
              style={{
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: 14,
                lineHeight: 21,
              }}>
              {item?.label || item?.name || item?.value}
            </Text>
            <Text
              style={{
                color: 'rgba(0, 0, 0, 0.54)',
                fontSize: 14,
                lineHeight: 21,
              }}>
              {' '}
              (#
              {id})
            </Text>
          </View>
        </TouchableOpacity>
      )}
      renderChip={(id, onClose, item, style, iconStyle) => (
        <Chip
          key={id}
          iconStyle={iconStyle}
          onClose={() => remove(item)}
          text={item?.label || item?.name || item?.value}
          style={style}
        />
      )}
      //keyboardShouldPersistTaps="handled"
      //filterOnKey="key"
      //onChangeSelectedItems={(selectedItems) => onSelectizeValueChange(field.name, selectedItems)}
      //inputContainerStyle={styles.selectizeField}
    />
  );
};
export default MultiSelect;
