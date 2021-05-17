import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Colors from 'constants/Colors';
import i18n from 'languages';

const HeaderLeft = ({ label, onPress }) => {
  // TODO: use label to distinguish Contact/Group/etc...
  const route = useRoute();
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  if (route?.params?.onlyView) {
    return (
      <Icon
        type="Feather"
        name="arrow-left"
        onPress={onPress}
        style={{ paddingLeft: 16, color: Colors.headerTintColor, paddingRight: 16 }}
      />
    );
  }
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
};
/*
const HeaderLeft = ({ isLeft, isEditMode, onPress }) => {
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  return(
    <Row onPress={onPress}>
      <Icon
        type={ isEditMode ? "AntDesign" : "Feather" }
        name={ isEditMode ? "close" : (isRTL ? "arrow-right" : "arrow-left") }
        style={[
          { color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' },
          isRTL ? { paddingRight: 16 } : { paddingLeft: 16 },
        ]}
      />
      { isEditMode && (
        <Text
          style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
          {i18n.t('global.cancel')}
        </Text>
      )}
    </Row>
  );
};
*/
export default HeaderLeft;
