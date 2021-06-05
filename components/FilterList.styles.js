import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  listItemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#dddddd',
  },
  background: {
    backgroundColor: Colors.mainBackgroundColor,
    height: '100%',
  },
  placeholder: {
    padding: 20,
    fontWeight: 'bold',
  },
});
