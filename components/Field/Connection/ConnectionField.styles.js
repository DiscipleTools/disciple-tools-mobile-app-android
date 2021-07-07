import { Dimensions, StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

const containerPadding = 20;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const circleSideSize = windowWidth / 3 + 20;

export const styles = StyleSheet.create({
  linkingText: {
    paddingTop: 4,
    paddingBottom: 8,
    textDecorationLine: 'underline',
  },
  formContainer: {
    paddingTop: 10,
    paddingBottom: 100,
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
  },
  formRow: {
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
  },
  formIconLabel: { marginLeft: 10, width: 'auto' },
  formIconLabelMarginLeft: {
    marginLeft: containerPadding + 10,
  },
  formIconLabelMargin: {
    marginRight: containerPadding + 10,
    marginTop: 25,
    marginBottom: 15,
  },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formParentLabel: {
    width: 'auto',
    maxWidth: 75,
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
  formDivider2: {
    marginTop: 25,
    marginBottom: 15,
  },
  formDivider2Margin: {
    marginTop: 25,
    marginBottom: 15,
    marginLeft: containerPadding + 10,
    marginRight: containerPadding + 10,
  },
  formIconLabelCol: {
    width: 35,
    marginRight: 10,
  },
  formIconLabelView: {
    alignItems: 'center',
  },
  formFieldPadding: {
    paddingTop: 30,
  },
  formContainerNoPadding: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  },
  groupCircleParentContainer: {
    height: circleSideSize,
  },
  groupCircleContainer: {
    height: '100%',
    width: circleSideSize,
  },
  groupCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '85%',
    width: '85%',
    marginTop: '7.5%',
    marginRight: '7.5%',
    marginBottom: '7.5%',
    marginLeft: '7.5%',
  },
  groupCenterIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '40%',
    width: '40%',
    marginTop: '25%',
    resizeMode: 'contain',
  },
  groupCircleName: {
    justifyContent: 'center',
    marginTop: '20%',
    marginLeft: '20%',
    marginRight: '20%',
  },
  groupCircleNameText: { fontSize: 11, textAlign: 'center' },
  groupCircleCounter: {
    justifyContent: 'center',
    marginTop: '-5%',
  },
  groupIcons: {
    height: 30,
    width: 32,
  },
  progressIconText: {
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
  },
  membersIconActive: {
    opacity: 1,
  },
  membersIconInactive: {
    opacity: 0.15,
  },
  membersLeaderIcon: {
    height: 30,
    width: 18,
    marginLeft: 0,
  },
  membersCloseIcon: {
    color: Colors.grayDark,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});
