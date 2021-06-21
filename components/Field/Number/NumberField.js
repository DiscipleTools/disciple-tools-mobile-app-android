import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Label, Icon, Input } from 'native-base';

const NumberField = ({ value }) => {
  console.log('*** NUMBER FIELD RENDER ***');

  const editing = useSelector((state) => state.appReducer.editing);
  //const editing = true;
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  const NumberFieldEdit = () => {
    return (
      <Input
        value={value}
        keyboardType="numeric"
        onChangeText={(value) => {
          // TODO:
          //setContactCustomFieldValue(field.name, value)
          //setGroupCustomFieldValue(field.name, value)}
        }}
        style={[styles.contactTextField, isRTL ? { textAlign: 'left', flex: 1 } : {}]}
      />
    );
  };

  const NumberFieldView = () => {
    return <Text style={isRTL ? { textAlign: 'left', flex: 1 } : {}}>{value.toString()}</Text>;
  };
  return <>{editing ? <NumberFieldEdit /> : <NumberFieldView />}</>;
};
export default NumberField;
