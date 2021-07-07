import { Dimensions, Platform, StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

const containerPadding = 20;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  tabBarUnderline: {
    backgroundColor: Colors.tintColor,
  },
  tabStyle: {
    backgroundColor: '#FFFFFF',
  },
  tabHeading: {
    //color: Colors.tintColor,
    color: '#000',
  },
  fieldsIcons: {
    height: 22,
    width: 22,
  },
  addRemoveIcons: {
    fontSize: 30,
    marginRight: 0,
    color: Colors.addRemoveIcons,
  },
  addIcons: { color: 'green' },
  removeIcons: { color: 'red' },
  // Form
  formContainer: {
    paddingTop: 10,
    paddingBottom: 100,
    //paddingLeft: containerPadding,
    //paddingRight: containerPadding,
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
  formIcon: {
    color: Colors.tintColor,
    fontSize: 22,
    marginTop: 'auto',
    marginBottom: 'auto',
    width: 25,
  },
  formParentLabel: {
    width: 'auto',
    maxWidth: 100,
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
  },
  formIconLabelCol: {
    width: 35,
  },
  formIconLabelView: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formFieldMargin: {
    marginTop: 20,
    marginBottom: 10,
  },
  // Progress Section
  progressIcon: { height: '100%', width: '100%' },
  progressIconActive: {
    opacity: 1,
  },
  progressIconInactive: {
    opacity: 0.15,
  },
  progressIconText: {
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
  },
  // Comments Section
  background: {
    backgroundColor: Colors.mainBackgroundColor,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.mainBackgroundColor,
  },
  avatar: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  image: {
    height: 16,
    marginTop: 10,
    width: 16,
  },
  content: {
    backgroundColor: Colors.contentBackgroundColor,
    borderRadius: 5,
    flex: 1,
    marginLeft: 16,
    padding: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: 'bold',
  },
  time: {
    color: Colors.tintColor,
    fontSize: 10,
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
  noCommentsContainer: {
    padding: 20,
    height: '90%',
    transform: [{ scaleY: -1 }],
  },
  noCommentsImage: {
    opacity: 0.5,
    height: 70,
    width: 70,
    padding: 10,
  },
  noCommentsText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#A8A8A8',
    marginTop: 10,
  },
  contactTextField: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    height: 50,
    fontSize: 15,
  },
  contactTextRoundField: {
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    height: 50,
    fontSize: 15,
  },
  selectizeField: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    borderBottomWidth: 1.5,
    borderBottomColor: '#B4B4B4',
    borderRadius: 5,
    minHeight: 50,
    marginTop: -15,
    padding: 10,
  },
  linkingText: {
    paddingTop: 4,
    paddingBottom: 8,
    textDecorationLine: 'underline',
  },
  statusFieldContainer: Platform.select({
    default: {
      borderStyle: 'solid',
      borderWidth: 2,
      borderRadius: 3,
    },
    ios: {},
  }),
  validationErrorMessage: {
    color: Colors.errorBackground,
  },
  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tintColor,
  },
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  // Edit/Delete comment dialog
  dialogBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dialogBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: windowHeight - windowHeight * 0.55,
    width: windowWidth - windowWidth * 0.1,
    marginTop: windowHeight * 0.1,
  },
  dialogButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    width: 100,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dialogContent: {
    height: '100%',
    width: '100%',
    fontSize: 20,
    textAlign: 'center',
    color: Colors.grayDark,
    marginBottom: 5,
  },
  commentsActionButtons: {
    borderRadius: 80,
    height: 40,
    width: 40,
    marginBottom: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  pickerIcon: {
    color: Colors.gray,
    fontSize: 22,
    right: 18,
    top: 10,
    position: 'absolute',
  },
});
