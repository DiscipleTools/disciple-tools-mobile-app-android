import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  linkingText: {
    paddingTop: 4,
    paddingBottom: 8,
    textDecorationLine: 'underline',
  },
  pickerIcon: {
    color: Colors.gray,
    fontSize: 22,
    right: 18,
    top: 10,
    position: 'absolute',
  },
});
