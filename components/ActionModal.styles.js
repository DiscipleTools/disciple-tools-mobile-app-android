import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    paddingTop: 15,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    position: 'absolute',
    right: 10,
  },
  modalHeader: {
    flexDirection: 'row',
  },
  textHeader: {
    //textAlign: 'center',
    top: 10,
    left: 25,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    paddingTop: 10,
    paddingBottom: 5,
    //width: '100%',
    maxHeight: '95%',
  },
});
