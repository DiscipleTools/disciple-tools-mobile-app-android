import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Colors from 'constants/Colors';
import i18n from 'languages';

const HeaderLeft = ({ label, onPress }) => {
  const route = useRoute();
  const editing = useSelector((state) => state.appReducer.editing);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  if (editing) {
    return (
      <Row onPress={onPress}>
        <Icon
          type="AntDesign"
          name="close"
          style={[
            { color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' },
            isRTL ? { paddingRight: 16 } : { paddingLeft: 16 },
          ]}
        />
        <Text style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
          {i18n.t('global.cancel')}
        </Text>
      </Row>
    );
  }
  return (
    <Icon
      type="Feather"
      name="arrow-left"
      onPress={onPress}
      style={{ paddingLeft: 16, color: Colors.headerTintColor, paddingRight: 16 }}
    />
  );
};
export default HeaderLeft;
