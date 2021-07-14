import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  BackHandler,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  Body,
  Button,
  Input,
  Label,
  Left,
  ListItem,
  CheckBox,
  Icon,
  Radio,
  Right,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import PropTypes from 'prop-types';
import Colors from 'constants/Colors';

import useI18N from '../../hooks/useI18N';

/*
import {
  getQuestionnaireById,
  resetState,
  setQuestion,
  submitQuestionnaire,
} from 'store/actions/questionnaire.actions';
*/

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

import { styles } from './QuestionnaireScreen.styles';

const Questionnaire = ({ navigation }) => {
  const { i18n } = useI18N();
  const q_id = navigation.getParam('q_id');
  const userData = navigation.getParam('userData');
  const domain = userData.domain;
  const token = userData.token;
  const user_id = userData.id;
  const contact_id = navigation.getParam('contact').ID;

  // TODO: useDetails(id, "questionnaire"/postType);
  const questionnaireState = useSelector((state) => state.questionnaireReducer);
  const questionnaire = questionnaireState.questionnaire;
  const save = questionnaireState.save;
  const error = questionnaireState.error;
  if (questionnaire != null) {
    questionnaire.forms.sort(
      (a, b) => parseInt(a.seq.replace('.', '')) - parseInt(b.seq.replace('.', '')),
    );
  }

  /*
  useEffect(() => {
    dispatch(getQuestionnaireById(domain, token, q_id));
  }, []);
  */
  useEffect(() => {
    if (save != null) {
      toastSaveRef.current.show(
        <View>
          <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
        </View>,
        1000,
        () => {
          //dispatch(resetState());
          goToContactDetailScreen(navigation);
        },
      );
    }
  }, [save]);

  useEffect(() => {
    if (error != null) {
      toastErrorRef.current.show(
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.code')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.code}</Text>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.message')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.message}</Text>
        </View>,
        3000,
        () => {
          //dispatch(resetState());
        },
      );
    }
  }, [error]);

  /*
  let toastSuccess;
  const successToast = (
    <Toast
      ref={(toast) => {
        toastSuccess = toast;
      }}
      style={{ backgroundColor: Colors.successBackground }}
      positionValue={250}
    />
  );

  let toastError;
  const errorToast = (
    <Toast
      ref={(toast) => {
        toastError = toast;
      }}
      style={{ backgroundColor: Colors.errorBackground }}
      positionValue={300}
    />
  );
*/

  const QuestionHeader = ({ question }) => {
    return (
      <Text>
        <Text style={{ fontWeight: 'bold' }}>{question.title + ' '}</Text>
        {question.required && question.required == true ? (
          <Text style={{ marginLeft: 10, color: Colors.grayDark }}>(required)</Text>
        ) : (
          <Text style={{ color: Colors.grayDark }}>
            {question.type && question.type == 'radio' ? '(optional)' : '(optional, 0 or more)'}
          </Text>
        )}
      </Text>
    );
  };

  const Question = ({ question }) => {
    //const dispatch = useDispatch();
    const options = question.options;
    const isMutuallyExclusive = question && question.type == 'radio' ? true : false;
    const handleOptionSelect = (option) => {
      const options_p = options.map((existing_option) => {
        if (existing_option === option) {
          const updatedOption = {
            ...option,
            selected: isMutuallyExclusive ? true : !option.selected,
          };
          return updatedOption;
        } else {
          const updatedOption = {
            ...existing_option,
            selected: isMutuallyExclusive ? false : existing_option.selected,
          };
          return updatedOption;
        }
        return existing_option;
      });
      /*
    dispatch(
      setQuestion({
        ...question,
        options: options_p,
      }),
    );
    */
    };
    return (
      <React.Fragment>
        <QuestionHeader question={question} />
        {question.type && question.type == 'input' ? (
          <Input
            value={question.value}
            onChangeText={(value) => {
              /*
            dispatch(
              setQuestion({
                ...question,
                value,
              }),
            );
            */
            }}
            style={styles.contactTextField}
          />
        ) : (
          options &&
          options.map((option, idx) => (
            <View key={idx}>
              <ListItem
                onPress={() => {
                  handleOptionSelect(option);
                }}>
                <Checkbox
                  option={option}
                  handleOptionSelect={handleOptionSelect}
                  isMutuallyExclusive={isMutuallyExclusive}
                />
              </ListItem>
              {option.questions &&
                option.selected &&
                option.questions.map((subquestion, subidx) => (
                  <View key={subidx} style={{ marginTop: 20, marginBottom: 20, marginLeft: 40 }}>
                    <Question question={subquestion} />
                  </View>
                ))}
            </View>
          ))
        )}
      </React.Fragment>
    );
  };

  const Checkbox = ({ option, handleOptionSelect, isMutuallyExclusive }) => {
    return (
      <React.Fragment>
        {isMutuallyExclusive ? (
          <Radio
            onPress={() => {
              handleOptionSelect(option);
            }}
            selectedColor={Colors.tintColor}
            selected={option.selected}
          />
        ) : (
          <CheckBox
            onPress={() => {
              handleOptionSelect(option);
            }}
            color={Colors.tintColor}
            checked={option.selected}
          />
        )}
        <Text style={{ marginLeft: 10 }}>{option.title}</Text>
      </React.Fragment>
    );
  };

  const NextButton = ({ currIdx, lastIdx, swipeRight, onSubmit }) => {
    return (
      <View style={styles.bottomView}>
        {currIdx == lastIdx ? (
          <Button style={styles.nextButton} onPress={onSubmit} block>
            <Text style={styles.nextButtonText}>Submit {/*i18n.t('loginScreen.logIn')*/}</Text>
          </Button>
        ) : (
          <Button style={styles.nextButton} onPress={swipeRight} block>
            <Text style={styles.nextButtonText}>Next</Text>
          </Button>
        )}
      </View>
    );
  };

  const onSubmit = () => {
    // TODO: confirm required fields are selected, or give error feedback
    /*
    dispatch(
      submitQuestionnaire(domain, token, {
        fields: {
          q_id,
          user_id,
          contact_id,
          data: JSON.stringify({ questionnaire: questionnaire }),
        },
      }),
    );
    */
  };
  const swiperRef = useRef(null);
  const swipeRight = () => {
    // TODO: confirm required fields are selected, or give error feedback
    swiperRef.current.scrollBy(1, true);
  };
  const toastSaveRef = useRef();
  const toastErrorRef = useRef();
  return (
    <Swiper
      ref={swiperRef}
      dot={
        <View
          style={{
            backgroundColor: Colors.gray,
            width: 10,
            height: 10,
            borderRadius: 5,
            marginLeft: 5,
            marginRight: 5,
          }}
        />
      }
      activeDot={
        <View
          style={{
            backgroundColor: Colors.tintColor,
            width: 11,
            height: 11,
            borderRadius: 7,
            marginLeft: 7,
            marginRight: 7,
          }}
        />
      }
      paginationStyle={{ bottom: 30 }}
      loop={false}>
      {questionnaire != null && questionnaire.forms ? (
        questionnaire.forms.map((form, idx) => (
          <View key={idx} style={styles.formContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 30, marginBottom: 30 }}>
              {idx + 1 + '. ' + form.title}
            </Text>
            <ScrollView style={{ marginBottom: 150 }}>
              {form.questions ? (
                form.questions.map((question, idx) => (
                  <View key={idx} style={{ marginTop: 20, marginBottom: 20 }}>
                    <Question question={question} />
                  </View>
                ))
              ) : (
                <View key={idx}>
                  <Text>No Questions</Text>
                </View>
              )}
            </ScrollView>
            <NextButton
              currIdx={idx}
              lastIdx={questionnaire.forms.length - 1}
              swipeRight={swipeRight}
              onSubmit={onSubmit}
            />
            {/*
            <Toast
              ref={toastSaveRef}
              style={{ backgroundColor: Colors.successBackground }}
              positionValue={250}
            />
            <Toast
              ref={toastErrorRef}
              style={{ backgroundColor: Colors.errorBackground }}
              positionValue={300}
            />
            */}
          </View>
        ))
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={true} />}>
          <Text></Text>
        </ScrollView>
      )}
    </Swiper>
  );
};

const goToContactDetailScreen = (navigation) => {
  const contactData = navigation.getParam('contact');
  navigation.navigate('ContactDetail', {
    contactId: contactData.ID,
    onlyView: true,
    contactName: contactData.title,
    previousList: [],
    onGoBack: null,
  });
};

Questionnaire.navigationOptions = ({ navigation }) => {
  let headerLeft = () => (
    <Icon
      type="Feather"
      name="arrow-left"
      onPress={() => {
        goToContactDetailScreen(navigation);
      }}
      style={{ paddingLeft: 16, color: '#FFFFFF', paddingRight: 16 }}
    />
  );
  return {
    title: navigation.getParam('contact').title,
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

export default Questionnaire;
