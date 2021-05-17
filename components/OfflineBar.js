import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  //useWindowDimensions
} from 'react-native';
import i18n from 'languages';

import { styles } from './OfflineBar.styles';

const OfflineBar = () => {
  //const width = useWindowDimensions().width;
  return (
    <View style={styles.offlineBar}>
      <Text style={styles.offlineBarText}>{i18n.t('global.offline')}</Text>
    </View>
  );
};
export default OfflineBar;
