import { Dimensions, StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: Colors.canvas,
    minHeight: Dimensions.get('window').height,
  },
  header: {
    backgroundColor: Colors.tintColor,
    width: '100%',
    padding: 35,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  welcomeImage: {
    height: 60,
    width: 250,
    resizeMode: 'contain',
    padding: 20,
  },
  formContainer: {
    alignSelf: 'stretch',
    flexGrow: 1,
    padding: 20,
  },
  signInButton: {
    marginTop: 10,
    backgroundColor: Colors.tintColor,
    borderRadius: 10,
  },
  signInButtonText: {
    color: 'white',
  },
  forgotButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  forgotButtonText: {
    color: Colors.tintColor,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textField: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  validationErrorInput: {
    backgroundColor: '#FFE6E6',
    borderWidth: 2,
    borderColor: Colors.errorBackground,
  },
  validationErrorMessage: {
    color: Colors.errorBackground,
  },
  languagePickerContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray,
    padding: 5,
    alignItems: 'center',
  },
  languagePicker: {
    flex: 1,
  },
  languageIcon: {
    marginHorizontal: 20,
  },
  versionText: {
    color: Colors.grayDark,
    fontSize: 12,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  headerText: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  textBoxContainer: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textBox: {
    fontSize: 16,
    paddingRight: 30,
    paddingLeft: 8,
    paddingVertical: 0,
    flex: 1,
  },
  touachableButton: {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 2,
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
});
