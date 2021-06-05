import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  contactTextField: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.gray,
    height: 50,
    fontSize: 15,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    marginLeft: '10%',
    width: '80%',
  },
  formRow: {
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
  },
  formIconLabel: {
    marginLeft: 10,
    width: 'auto',
  },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formParentLabel: {
    width: 'auto',
  },
  formLabel: {
    color: Colors.tintColor,
    fontSize: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formDivider: {
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 60,
  },
  nextButton: {
    width: 100,
    backgroundColor: Colors.tintColor,
    borderRadius: 2,
  },
  nextButtonText: {
    color: 'white',
  },
});
