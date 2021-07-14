import React from 'react';
import { Icon, Picker } from 'native-base';

import useI18N from 'hooks/useI18N';

import { styles } from 'components/Field/Field.styles';

const SingleSelect = ({ items, selectedItem, onChange }) => {
  const { i18n, isRTL } = useI18N();

  const handleChange = (newValue) => {
    // this is how we enable the user to de-select a value
    if (newValue === -1) {
      onChange({
        key: -1,
        label: '',
      });
      return;
    }
    const newItem = items.find((existingItems) => existingItems.ID === newValue);
    if (newItem)
      onChange({
        key: newItem?.ID ?? null,
        label: newItem?.name ?? null,
      });
  };

  return (
    <>
      <Picker
        mode="dropdown"
        selectedValue={selectedItem?.key}
        onValueChange={handleChange}
        // TODO: confirm this on Android
        iosIcon={<Icon name="caret-down" size={10} style={styles.pickerIcon} />}
        textStyle={{ fontSize: 14 }}>
        <Picker.Item key={-1} label={''} value={-1} />
        {items.map((item) => {
          return (
            <Picker.Item
              key={item?.ID}
              label={item?.name + ' (#' + item?.ID + ')'}
              value={item?.ID}
            />
          );
        })}
      </Picker>
      {/*<Icon name="caret-down" size={10} style={styles.pickerIcon} />*/}
    </>
  );
};
export default SingleSelect;
