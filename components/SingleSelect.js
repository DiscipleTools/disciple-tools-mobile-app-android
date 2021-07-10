import React from 'react';
import { useSelector } from 'react-redux';
import { Icon, Picker } from 'native-base';

import { styles } from 'components/Field/Field.styles';

const SingleSelect = ({ items, selectedItem, onChange }) => {
  // TODO:
  //const isRTL = useSelector((state) => state.i18nReducer.isRTL);

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
