import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Chip, Selectize } from 'react-native-material-selectize';

import { styles } from './MultiSelect.styles';

const MultiSelect = ({ items, selectedItems, onChange }) => {
  console.log(`items: ${JSON.stringify(items)}`);
  console.log(`selectedItems: ${JSON.stringify(selectedItems)}`);

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

  const addSelection = (newValue) => {
    // TODO: peopleGroup format:
    //{"ID":30,"name":"Algerian, Arabic-speaking","label":"Algerian, Arabic-speaking","id":30}
    const exists = selectedItems.find((value) => value?.value === newValue?.value);
    if (!exists)
      onChange({
        values: [...selectedItems, newValue],
      });
  };

  const removeSelection = (deletedValue) => {
    const idx = selectedItems.findIndex((value) => value?.value === deletedValue?.value);
    if (idx > -1) {
      const copied = [...selectedItems];
      const removed = copied.splice(idx, 1);
      onChange({
        values: copied,
      });
    }
  };

  return (
    <Selectize
      itemId={'id'}
      items={mappedItems}
      selectedItems={mappedSelectedItems}
      textInputProps={{
        onSubmitEditing: addSelection,
        // TODO:
        placeholder: '',
      }}
      renderRow={(id, onPress, item) => (
        <TouchableOpacity
          activeOpacity={0.6}
          key={id}
          onPress={() => addSelection(item)}
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
              {item?.name || item?.label}
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
          onClose={() => removeSelection(item)}
          text={item?.name || item?.label}
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
