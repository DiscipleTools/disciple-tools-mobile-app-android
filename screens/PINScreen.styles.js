import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.tintColor,
    //backgroundColor: "#272E2E",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '40%',
  },
  logo: {
    height: 60,
    resizeMode: 'contain',
  },
  text: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  icon: {
    color: '#FFF',
    fontSize: 32,
    marginBottom: 20,
  },
  cellStyle: {
    borderWidth: 2,
    borderRadius: 24,
    borderColor: Colors.accent,
    backgroundColor: 'azure',
    //backgroundColor: 'white',
  },
  cellStyleFocused: {
    borderColor: Colors.accent,
    backgroundColor: 'lightcyan',
    //backgroundColor: Colors.grayLight,
  },
  textStyle: {
    fontSize: 24,
    //color: 'salmon'
    color: Colors.tintColor,
    //color: "#272E2E",
  },
  textStyleFocused: {
    color: Colors.tintColor,
  },
});
