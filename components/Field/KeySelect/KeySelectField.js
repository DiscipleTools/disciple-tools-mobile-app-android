import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon, Picker } from 'native-base';

// Custom Components
import SingleSelect from 'components/SingleSelect';

import { styles } from './KeySelectField.styles';

const KeySelectField = ({ field, value, editing, onChange }) => {
  // TODO: support RTL
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const handleChange = (newValue) => {
    if (newValue !== value) onChange(newValue);
  };

  const isStatusField = () => {
    if (field?.name === 'overall_status' || field?.name === 'group_status') return true;
    return false;
  };

  const backgroundColor = field?.default[value]?.color ?? null;
  return (
    <View
      style={[
        styles.statusFieldContainer,
        isStatusField(field?.name) ? { backgroundColor } : null,
        //Platform.select({
        //android: {
        //transparent?: state.overallStatusBackgroundColor,
        //},
        //ios: {
        //backgroundColor: state.groupStatusBackgroundColor,
        //},
        //}),
      ]}>
      <Picker
        mode="dropdown"
        enabled={editing}
        selectedValue={value}
        onValueChange={handleChange}
        textStyle={isStatusField() ? { color: '#FFF' } : null}
        //placeholder="Select"
      >
        {Object.keys(field?.default).map((key) => {
          const optionData = field.default[key];
          if (optionData) return <Picker.Item key={key} label={optionData?.label} value={key} />;
          return null;
        })}
      </Picker>
      {editing ? <Icon name="caret-down" size={10} style={styles.pickerIcon} /> : null}
    </View>
  );
};
export default KeySelectField;
