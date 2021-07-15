import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Button } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { SvgUri } from 'react-native-svg';

import useI18N from 'hooks/useI18N';

import { styles } from './Milestones.styles';
// TODO: move to StyleSheet
import Colors from 'constants/Colors';

const Milestones = ({
  items,
  selectedItems,
  onChange,
  customAdd,
  customRemove,
  postType,
  editing,
}) => {
  // TODO:
  const { i18n, isRTL } = useI18N();
  const add = (newValue) => {
    if (customAdd) customAdd(newValue);
    // TODO: debug why this is not working properly like 'MultiSelectField.addSelection' (does it have to do with 'selectedItems'?)
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
  const remove = (deletedValue) => {
    if (customRemove) customRemove(deletedValue);
    // TODO: debug why this is not working properly like 'MultiSelectField.removeSelection' (does it have to do with 'selectedItems'?)
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
  const handleChange = (item, selected) => {
    if (selected) {
      remove(item);
    } else {
      add(item);
    }
  };
  return (
    <>
      {items.map((item) => {
        const selected = selectedItems.find((selectedItem) => selectedItem.label === item.label)
          ? true
          : false;
        return (
          <Button
            disabled={!editing}
            bordered={!selected}
            onPress={() => handleChange(item, selected)}
            style={[styles.button, selected ? { backgroundColor: Colors.tintColor } : null]}>
            <Row>
              <SvgUri width="25" height="25" uri={item?.icon} />
              <Text style={[styles.buttonLabel, selected ? { color: '#fff' } : null]}>
                {item?.label}
              </Text>
            </Row>
          </Button>
        );
      })}
    </>
  );
};
export default Milestones;
