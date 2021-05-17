import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  BackHandler,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Swiper from 'react-native-swiper';
import {
  Body,
  Button,
  Input,
  Label,
  Left,
  ListItem,
  Item,
  CheckBox,
  Icon,
  Radio,
  Right,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import { Col, Row, Grid } from 'react-native-easy-grid';
import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import i18n from '../../languages';
import { saveComment as saveGroupComment } from '../../store/actions/groups.actions';
import { saveComment as saveContactComment } from '../../store/actions/contacts.actions';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

import { styles } from './AttendanceScreen.styles';

const Attendance = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const q_id = route.params?.q_id ?? null;
  const userData = route.params?.userData ?? null;
  const groupData = route.params?.group ?? null;
  const domain = userData?.domain ?? null;
  const token = userData?.token ?? null;
  const user_id = userData?.id ?? null;
  const group_id = groupData?.ID ?? null;
  const group_name = groupData?.title ?? null;

  const isRTL = useSelector((state) => state.i18nReducer.isRTL);
  const [groupComment, setGroupComment] = useState('');
  const [attendees, setAttendees] = useState(
    groupData.members.values.map((member, idx) => {
      return {
        id: member.value,
        name: member.name,
        comment: '',
        checked: true,
        displayComment: false,
      };
    }),
  );
  attendees.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  const attendeesCount = attendees.filter((attendee) => attendee.checked).length;
  const membersCount = groupData.members.values.length;

  const NextButton = ({ hasQuestionnaire, onSubmit }) => {
    return (
      <View>
        {hasQuestionnaire ? (
          <Button style={styles.nextButton} onPress={goToQuestionnaireScreen} block>
            <Text style={styles.nextButtonText}>Next</Text>
          </Button>
        ) : (
          <Button style={styles.nextButton} onPress={onSubmit} block>
            <Text style={styles.nextButtonText}>{i18n.t('global.submit')}</Text>
          </Button>
        )}
      </View>
    );
  };

  const onSubmit = () => {
    // TODO: confirm required fields are selected, or give error feedback
    const attendedList = [];
    attendees.map((attendee) => {
      const id = attendee.id;
      const name = attendee.name;
      var comment = '';
      const attended = attendee.checked;
      if (attended) {
        comment =
          i18n.t('groupDetailScreen.attendance.didAttendComment') + ':\n"' + group_name + '"\n\n';
        attendedList.push(`@[${name}](${id})`);
      } else {
        comment =
          i18n.t('groupDetailScreen.attendance.didNotAttendComment') +
          ':\n"' +
          group_name +
          '"\n\n';
      }
      if (comment.length > 1) {
        comment += attendee.comment;
      }
      dispatch(saveContactComment(domain, token, id, { comment }));
    });
    var comment =
      i18n.t('groupDetailScreen.attendance.groupComment') +
      '\n\n' +
      i18n.t('groupDetailScreen.attendance.header') +
      ' (' +
      attendeesCount +
      '/' +
      membersCount +
      '):\n' +
      attendedList.join('\n') +
      '\n\n' +
      groupComment;
    dispatch(saveGroupComment(domain, token, group_id, { comment }));
    goToGroupDetailScreen(navigation);
  };

  const setAttendee = (attendee) => {
    const updatedAttendees = attendees.map((existing) => {
      if (attendee.id !== existing.id) return existing;
      return attendee;
    });
    setAttendees(updatedAttendees);
  };

  /* NOTE: React was re-rendering on each Comment key type due to issues with nested functional components
  const Member = ({ member, setAttendee }) => {
  ...
  */

  const setChecked = (member, checked) => {
    setAttendee({
      ...member,
      checked,
    });
  };
  const setDisplayComment = (member, displayed) => {
    setAttendee({
      ...member,
      displayComment: displayed,
    });
  };
  const setComment = (member, comment) => {
    setAttendee({
      ...member,
      comment,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subHeader}>
        {i18n.t('groupDetailScreen.attendance.header')} ({attendeesCount}/{membersCount})
      </Text>
      <KeyboardAwareScrollView
        enableAutomaticScroll
        enableOnAndroid
        keyboardOpeningTime={0}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}>
        {attendees.map((member) => (
          <ListItem
            key={member.id}
            style={styles.listItem}
            onPress={() => {
              setChecked(member, !member.checked);
            }}>
            <View style={styles.listItemView}>
              <CheckBox
                onPress={() => {
                  setChecked(member, !member.checked);
                }}
                color={Colors.tintColor}
                checked={member.checked}
              />
              <Body style={{ marginLeft: 25 }}>
                <TouchableOpacity
                  onPress={() => {
                    setChecked(member, !member.checked);
                  }}>
                  {<Text style={[isRTL ? { textAlign: 'left', flex: 1 } : {}]}>{member.name}</Text>}
                </TouchableOpacity>
              </Body>
              <Icon
                key={member.id}
                type="MaterialCommunityIcons"
                name="pencil"
                style={{ color: Colors.tintColor }}
                onPress={() => {
                  setDisplayComment(member, !member.displayComment);
                }}
              />
            </View>
            {member.displayComment && (
              <View style={{ marginBottom: 50 }}>
                <Input
                  multiline
                  defaultValue={member.comment}
                  onChangeText={(value) => {
                    setComment(member, value);
                  }}
                  style={styles.groupTextField}
                />
              </View>
            )}
          </ListItem>
        ))}
        <View style={styles.meetingCommentsView}>
          <Text style={[{ fontWeight: 'bold' }, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {i18n.t('groupDetailScreen.attendance.groupCommentLabel')}
          </Text>
          <Input
            multiline
            defaultValue={groupComment}
            onChangeText={(value) => {
              setGroupComment(value);
            }}
            style={styles.meetingCommentsInput}
          />
        </View>
        <View style={styles.nextButtonView}>
          <NextButton hasQuestionnaire={false} onSubmit={onSubmit} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const goToQuestionnaireScreen = (navigation) => {
  this.props.navigation.navigate(
    NavigationActions.navigate({
      routeName: 'Questionnaire',
      action: NavigationActions.navigate({
        routeName: 'Question',
        params: {
          userData: this.props.userData,
          group: this.state.group,
          q_id,
        },
      }),
    }),
  );
};

const goToGroupDetailScreen = (navigation) => {
  const groupData = navigation.getParam('group');
  navigation.navigate('GroupDetail', {
    groupId: groupData.ID,
    onlyView: true,
    contactName: groupData.title,
    previousList: [],
    onGoBack: null,
  });
};

Attendance.navigationOptions = ({ navigation }) => {
  let headerLeft = () => (
    <Icon
      type="Feather"
      name="arrow-left"
      onPress={() => {
        goToGroupDetailScreen(navigation);
      }}
      style={{ paddingLeft: 16, color: '#FFFFFF', paddingRight: 16 }}
    />
  );
  return {
    title: navigation.getParam('group').title,
    headerLeft,
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
};

export default Attendance;
