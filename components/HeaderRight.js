import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Colors from 'constants/Colors';
import i18n from 'languages';

const HeaderRight = ({ menu, menuRef, label, onPress }) => {
  const route = useRoute();
  const editing = useSelector((state) => state.appReducer.editing);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  if (editing) {
    return (
      <Row onPress={onPress}>
        <Text style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
          {i18n.t('global.save')}
        </Text>
        <Icon
          type="Feather"
          name="check"
          style={[
            { color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' },
            isRTL ? { paddingLeft: 16 } : { paddingRight: 16 },
          ]}
        />
      </Row>
    );
  }
  return (
    <Row>
      <Row onPress={onPress}>
        <Text style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
          {i18n.t('global.edit')}
        </Text>
        <Icon
          type="MaterialCommunityIcons"
          name="pencil"
          style={{
            color: Colors.headerTintColor,
            marginTop: 'auto',
            marginBottom: 'auto',
            fontSize: 24,
          }}
        />
      </Row>
      {menu && (
        <Row
          onPress={() => {
            menuRef.current.show();
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 12,
              paddingRight: 12,
            }}>
            {menu}
          </View>
        </Row>
      )}
    </Row>
  );
};
export default HeaderRight;
