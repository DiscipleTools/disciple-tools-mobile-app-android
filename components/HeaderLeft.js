import React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Icon } from 'native-base';
import { Row } from 'react-native-easy-grid';

import useI18N from 'hooks/useI18N';

//TODO: move to StyleSheet
import Colors from 'constants/Colors';

const HeaderLeft = ({ label, editing, onPress }) => {
  const route = useRoute();
  const { i18n, locale, isRTL, moment } = useI18N();
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
