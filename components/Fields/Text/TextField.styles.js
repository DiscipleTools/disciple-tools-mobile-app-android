import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    alignSelf: 'stretch',
    marginVertical: 10,
    padding: 5,
    alignItems: 'flex-start',
  },
  inputLabel: {
    margin: 5,
  },
  inputLabelText: {
    color: '#555555',
  },
  inputRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  inputRowIcon: {
    marginHorizontal: 5,
  },
  inputRowTextInput: {
    // TODO
    //textAlign: i18n.isRTL ? 'right' : 'left',
    padding: 5,
    flexGrow: 1,
  },
});
