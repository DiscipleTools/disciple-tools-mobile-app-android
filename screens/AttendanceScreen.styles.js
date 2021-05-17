import { StyleSheet } from 'react-native';
import Colors from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    paddingTop: 10,
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    borderTopColor: Colors.gray,
    borderTopWidth: 1,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  listItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  listItemView: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  groupTextField: {
    borderWidth: 1,
    borderColor: Colors.gray,
    fontSize: 15,
    marginBottom: 10,
    minWidth: 375,
  },
  meetingCommentsView: {
    margin: 20,
    height: 100,
  },
  meetingCommentsInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    height: 100,
  },
  nextButtonView: {
    paddingTop: 10,
    marginBottom: 50,
  },
  nextButton: {
    alignSelf: 'center',
    width: 100,
    backgroundColor: Colors.tintColor,
    borderRadius: 2,
  },
  nextButtonText: {
    color: 'white',
  },
});
