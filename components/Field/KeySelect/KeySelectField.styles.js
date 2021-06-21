import { Platform, StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  fieldsIcons: {
    height: 22,
    width: 22,
  },
  formRow: {
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
  },
  formIconLabel: {
    marginLeft: 10,
    width: 'auto',
    marginBottom: 'auto',
  },
  statusFieldContainer: Platform.select({
    default: {
      borderStyle: 'solid',
      borderWidth: 2,
      borderRadius: 3,
    },
    ios: {},
  }),
  // Edit/Delete comment dialog
  pickerIcon: {
    color: Colors.gray,
    fontSize: 22,
    right: 18,
    top: 10,
    position: 'absolute',
  },
});
