import React, { useState, useRef } from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons } from '@expo/vector-icons';
import i18n from 'languages';
import { showToast } from 'helpers';

import { styles } from './PINScreen.styles';

import { setPIN, deletePIN, generatePINCNonce } from 'store/actions/user.actions';

const PINScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    code: '',
    tmpCode: null,
  });

  const type = route.params.type ? route.params.type : null;
  const isValidate = type === 'validate' ? true : false;
  const isDelete = type === 'delete' ? true : false;
  const isSet = type === 'set' ? true : false;

  const pinInput = useRef();

  const getPIN = async () => {
    // TODO: Constants for value
    return await SecureStore.getItemAsync('pinCode');
  };

  const _isRepeating = (code) => {
    return [
      '111111',
      '222222',
      '333333',
      '444444',
      '555555',
      '666666',
      '777777',
      '888888',
      '999999',
      '000000',
    ].includes(code);
  };

  const _isSequential = (code) => {
    return [
      '012345',
      '123456',
      '234567',
      '345678',
      '456789',
      '567890',
      '678901',
      '789012',
      '890123',
      '901234',
    ].includes(code);
  };

  const handleFulfill = (code) => {
    if (isValidate) {
      // TODO: Support for DISTRESS PIN (also solves for when "pinCode" is unavailable)
      getPIN().then((secretCode) => {
        if (secretCode === null) {
          showToast(
            'Error: Unable to retrieve existing PIN. Please contact your Disciple Tools Administrator for assistance',
            true,
          );
          pinInput.current.shake().then(() => setState({ ...state, code: '' }));
        } else if (code === secretCode) {
          dispatch(generatePINCNonce());
          setState({ ...state, code: '' });
        } else {
          pinInput.current.shake().then(() => setState({ ...state, code: '' }));
        }
      });
    } else if (isDelete) {
      console.log('*** GET PIN ***');
      getPIN().then((secretCode) => {
        console.log('*** GOT PIN ***');
        if (code === secretCode) {
          dispatch(deletePIN());
          setState({ ...state, code: '' });
          navigation.goBack();
          showToast(i18n.t('settingsScreen.removedPinCode'));
        } else {
          pinInput.current.shake().then(() =>
            setState({
              ...state,
              code: '',
            }),
          );
        }
      });
    } else if (isSet && state.tmpCode === null) {
      const isRepeating = _isRepeating(code);
      const isSequential = _isSequential(code);
      const isCompliant = !isRepeating && !isSequential;
      if (isCompliant) {
        setState({
          ...state,
          code: '',
          tmpCode: code,
        });
      } else if (isRepeating || isSequential) {
        pinInput.current.shake().then(() =>
          setState({
            ...state,
            code: '',
          }),
        );
        // TODO: translate
        showToast(
          'Error: Repeating (i.e., 444444) or Sequential (i.e., 234567) values are not permitted',
          true,
        );
      } else {
        // unknown issue: retry
        pinInput.current.shake().then(() =>
          setState({
            ...state,
            code: '',
          }),
        );
      }
    } else if (isSet && state.tmpCode !== null) {
      if (code === state.tmpCode) {
        dispatch(setPIN(code));
        navigation.goBack();
        setState({ code: '', tmpCode: null });
        showToast(i18n.t('settingsScreen.savedPinCode'));
      } else {
        pinInput.current.shake().then(() =>
          setState({
            ...state,
            code: '',
          }),
        );
      }
    } else {
      console.warn(`Unknown PINScreen type: ${type}`);
      navigation.goBack();
    }
  };

  const getDisplayText = () => {
    if (isValidate || isDelete || (isSet && state.tmpCode !== null)) {
      return i18n.t('settingsScreen.confirmPin');
    } else if (isSet) {
      return i18n.t('settingsScreen.enterPin');
    } else {
      return '';
    }
  };

  const displayText = getDisplayText();
  //<ImageBackground source={require('assets/images/splash.png')} style={{width: '100%', height: '100%'}}>
  // TODO: better way to import images than 'require'?
  return (
    <View style={styles.container}>
      <Image source={require('assets/images/dt-icon.png')} style={styles.logo} />
      <Text style={styles.text}>{displayText}</Text>
      <MaterialIcons name="lock-outline" style={styles.icon} />
      <SmoothPinCodeInput
        ref={pinInput}
        autoFocus
        password
        mask="﹡"
        codeLength={6}
        restrictToNumbers
        cellStyle={styles.cellStyle}
        cellStyleFocused={styles.cellStyleFocused}
        textStyle={styles.textStyle}
        textStyleFocused={styles.textStyleFocused}
        value={state.code}
        onTextChange={(code) => {
          setState({
            ...state,
            code,
          });
        }}
        onFulfill={handleFulfill}
      />
    </View>
  );
};
export default PINScreen;
