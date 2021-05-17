import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.canvas,
    height: 100,
  },
  header: {
    borderBottomWidth: 1,
    backgroundColor: Colors.tabBar,
    paddingBottom: 10,
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  headerBody: {
    borderBottomWidth: 0,
    alignItems: 'flex-start',
  },
  username: {
    fontSize: 24,
    fontWeight: '500',
  },
  domain: {
    fontStyle: 'italic',
    color: '#888',
  },
  body: {
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: Colors.tintColor,
  },
  versionText: {
    color: Colors.grayDark,
    fontSize: 12,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  dialogBackground: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
  },
  dialogBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  dialogButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    width: 150,
    alignSelf: 'center',
    marginTop: 20,
  },
  dialogContent: {
    fontSize: 20,
    textAlign: 'center',
    color: Colors.grayDark,
    marginBottom: 5,
  },
  pickerIosIcon: {
    color: Colors.grayDark,
  },
});
