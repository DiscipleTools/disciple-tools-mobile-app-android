import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

const listItemHeight = 80;
const swipeBtnWidth = 80;
export const styles = StyleSheet.create({
  flatListItem: {
    height: 40,
    margin: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
  rowFront: {
    padding: 15,
    backgroundColor: Colors.grayLight,
    height: listItemHeight,
  },
  rowBack: {
    backgroundColor: Colors.grayLight,
    flexDirection: 'row',
    height: listItemHeight,
  },
  backBtn: {
    backgroundColor: Colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: listItemHeight,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  backBtnIcon: {
    color: '#FFF',
    fontSize: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  backBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  backBtn1: {
    backgroundColor: Colors.tintColor,
  },
  backBtn2: {
    backgroundColor: Colors.colorYes,
  },
  backBtn3: {
    backgroundColor: Colors.tintColor,
  },
  backBtn4: {
    backgroundColor: Colors.colorYes,
  },
  contactSubtitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 6,
    fontWeight: '200',
    color: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    textAlign: 'center',
    height: 100,
    padding: 20,
    color: 'rgba(0,0,0,0.4)',
  },
  contactFABIcon: {
    color: 'white',
    fontSize: 20,
  },
  offlineBar: {
    height: 20,
    backgroundColor: '#FCAB10',
  },
  offlineBarText: {
    fontSize: 14,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  loadMoreFooterText: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f729b',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '95%',
    width: '95%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
