import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Chip, Selectize } from 'react-native-material-selectize';

import { styles } from './MultiSelect.styles';

const MultiSelect = ({ items, selectedItems, placeholder, onChange }) => {
  console.log(`selectedItems: ${JSON.stringify(selectedItems)}`);

  /* TODO: check whether 'selectedItems' present in 'items' 
  // ensure postLocation is still a valid instanceLocation
  const getSelectizeItems = (selectedLocations, instanceLocations) => {
    const items = new Set(); // avoid duplicates
    selectedLocations?.forEach((selectedLocation) => {
      const foundItem = instanceLocations.find(
        (instanceLocation) => instanceLocation.value === selectedLocation.value,
      );
      if (foundItem) items.add(foundItem);
    });
    return [...items];
  };
  */

  const addSelection = (newValue) => {
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
      itemId="value"
      items={items}
      selectedItems={selectedItems}
      textInputProps={{
        onSubmitEditing: addSelection,
        placeholder,
        //onBlur: () => selectizeRef.current.submit(),
        /* TODO:
        switch (postType) {
          case 'contacts': {
            listItems = contacts //[...state.usersContacts];
            placeholder = i18n.t('global.searchContacts');
            break;
          }
          case 'groups': {
            listItems = [...state.groups];
            placeholder = i18n.t('groupDetailScreen.searchGroups');
            break;
          }
          case 'peoplegroups': {
            listItems = [...state.peopleGroups];
            placeholder = i18n.t('global.selectPeopleGroups');
            break;
          }
          default:
        }
        */
        //keyboardType: 'email-address'
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
            {item.avatarUri && <Image style={styles.avatar} source={{ uri: item.avatarUri }} />}
            <Text
              style={{
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: 14,
                lineHeight: 21,
              }}>
              {item.name}
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
          text={item.name}
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
