import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Linking,
  Picker,
  Platform,
  ScrollView,
  Text,
  //TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
// component library (native base)
import { Button, Icon } from 'native-base';
// expo
import Constants from 'expo-constants';
import * as Localization from 'expo-localization';
// TODO: move to StyleSheet
import Colors from 'constants/Colors';

// custom hooks
import useI18N from 'hooks/useI18N';
import useMyUser from 'hooks/useMyUser';
import useToast from 'hooks/useToast';

// custom components
import Locale from 'components/Locale';
import LabeledTextInput from 'components/LabeledTextInput';
// third-party components
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// styles/assets
import { styles } from './LoginScreen.styles';

const LoginScreen = ({ navigation, route }) => {
  const { i18n, isRTL, locale, LanguagePickerItems } = useI18N();
  const { userData, login } = useMyUser();
  const toast = useToast();

  const [state, setState] = useState({
    loading: false,
    domain: userData?.domain || '',
    username: userData?.username || '',
    password: '',
    hidePassword: true,
    domainValidation: null,
    userValidation: null,
    passwordValidation: null,
    locale,
  });

  useEffect(() => {
    if (locale === null) {
      // use device settings
      const deviceLocale = Localization.locale;
      setState({
        ...state,
        locale: deviceLocale,
      });
    }
  }, []);

  /*
  useEffect(() => {
    console.log('***** Login Screen - useEffect - LOCALE CHANGED *****');
    console.log(userData.locale);
    setState({
      ...state,
      locale: userData.locale,
    });
  }, [userData]);
  */

  const setPasswordVisibility = () => {
    setState({
      ...state,
      hidePassword: !state.hidePassword,
    });
  };

  const cleanDomain = (domain) => {
    // trim leading/trailing whitespace and remove protocol
    return domain.trim().replace('http://', '').replace('https://', '');
  };

  const onLoginPress = () => {
    Keyboard.dismiss();
    if (state.domain && state.username && state.password) {
      const cleanedDomain = cleanDomain(state.domain);
      login(cleanedDomain, state.username, state.password);
    } else {
      // if any of the required fields are not set, then update state to show error
      setState({
        ...state,
        domainValidation: !state.domain,
        userValidation: !state.username,
        passwordValidation: !state.password,
      });
    }
  };

  const openDocsLink = () => {
    Linking.openURL(`https://disciple-tools.readthedocs.io/en/latest/app`);
  };

  const goToForgotPassword = () => {
    if (state.domain !== '') {
      Linking.openURL(`https://${state.domain}/wp-login.php?action=lostpassword`);
    } else {
      toast(i18n.t('loginScreen.domain.errorForgotPass', { locale }), true);
    }
  };

  // TODO: simplify? put into a method?
  const { domainValidation, userValidation, passwordValidation } = state;
  const domainStyle = state.domainValidation
    ? [styles.textField, styles.validationErrorInput]
    : styles.textField;
  const userStyle = state.userValidation
    ? [styles.textField, styles.validationErrorInput]
    : styles.textField;
  const passwordStyle = state.passwordValidation
    ? [styles.textField, styles.validationErrorInput]
    : styles.textField;
  const domainErrorMessage = state.domainValidation ? (
    <Text style={styles.validationErrorMessage}>
      {i18n.t('loginScreen.domain.error', { locale })}
    </Text>
  ) : null;
  const userErrorMessage = state.userValidation ? (
    <Text style={styles.validationErrorMessage}>
      {i18n.t('loginScreen.username.error', { locale })}
    </Text>
  ) : null;
  const passwordErrorMessage = state.passwordValidation ? (
    <Text style={styles.validationErrorMessage}>
      {i18n.t('loginScreen.password.error', { locale })}
    </Text>
  ) : null;

  const Header = () => {
    return (
      <View style={styles.header}>
        <Image source={require('assets/images/dt-icon.png')} style={styles.welcomeImage} />
      </View>
    );
  };

  const MobileAppPluginRequired = () => {
    return (
      <TouchableOpacity activeOpacity={0.8} style={{}} onPress={openDocsLink}>
        <View
          style={{
            borderColor: '#c2e0ff',
            borderWidth: 1,
            backgroundColor: '#ecf5fc',
            borderRadius: 2,
            padding: 10,
          }}>
          <Text>{i18n.t('loginScreen.errors.mobileAppPluginRequiredOne', { locale })}</Text>
          <Text style={{ fontWeight: 'bold' }}>
            {i18n.t('loginScreen.errors.mobileAppPluginRequiredTwo', { locale })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const LoginButton = () => {
    return (
      <View>
        <Button
          accessibilityLabel={i18n.t('loginScreen.logIn', { locale })}
          style={styles.signInButton}
          onPress={onLoginPress}
          block>
          <Text style={styles.signInButtonText}>{i18n.t('loginScreen.logIn', { locale })}</Text>
        </Button>
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={goToForgotPassword}
          disabled={state.loading}>
          <Text style={styles.forgotButtonText}>
            {i18n.t('loginScreen.forgotPassword', { locale })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const LanguagePicker = () => {
    return (
      <View style={styles.languagePickerContainer}>
        <Icon type="FontAwesome" name="language" style={styles.languageIcon} />
        <Picker
          selectedValue={state.locale}
          style={styles.languagePicker}
          onValueChange={(value) => {
            setState({
              ...state,
              locale: value,
            });
          }}>
          <LanguagePickerItems />
        </Picker>
      </View>
    );
  };

  const LoadingSpinner = () => {
    return <ActivityIndicator color={Colors.tintColor} style={{ margin: 20 }} size="small" />;
  };

  const AppVersion = () => {
    return <Text style={styles.versionText}>{Constants.manifest.version}</Text>;
  };

  // NOTE: if we try to componentize <DomainField/>, <UsernameField/>, etc... the 'KeyboardAwareScrollView' breaks (and does not yet support UseRef). (A similar issue occurs with the React Native core 'KeyboardAvoidingView' component).
  return (
    <KeyboardAwareScrollView
      enableAutomaticScroll
      enableOnAndroid
      keyboardOpeningTime={0}
      extraScrollHeight={0}
      keyboardShouldPersistTaps={'always'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={'always'}>
        <Header />
        <View style={styles.formContainer}>
          {state.mobileAppRequired && <MobileAppPluginRequired />}
          <LabeledTextInput
            accessibilityLabel={i18n.t('loginScreen.domain.label', { locale })}
            label={i18n.t('loginScreen.domain.label', { locale })}
            containerStyle={domainStyle}
            iconName="ios-globe"
            onChangeText={(text) => {
              setState({
                ...state,
                domain: text,
              });
            }}
            textAlign={isRTL ? 'right' : 'left'}
            autoCapitalize="none"
            autoCorrect={false}
            value={state.domain}
            returnKeyType="next"
            textContentType="URL"
            keyboardType="url"
            disabled={state.loading}
            placeholder={i18n.t('loginScreen.domain.placeholder', { locale })}
          />
          {domainErrorMessage}
          <LabeledTextInput
            accessibilityLabel={i18n.t('loginScreen.username.label', { locale })}
            label={i18n.t('loginScreen.username.label', { locale })}
            containerStyle={userStyle}
            iconName={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
            onChangeText={(text) => {
              setState({
                ...state,
                username: text,
              });
            }}
            textAlign={isRTL ? 'right' : 'left'}
            autoCapitalize="none"
            autoCorrect={false}
            value={state.username}
            returnKeyType="next"
            textContentType="emailAddress"
            keyboardType="email-address"
            disabled={state.loading}
          />
          {userErrorMessage}
          <View style={[passwordStyle]}>
            <View style={{ margin: 10 }}>
              <Text style={{ textAlign: 'left', color: '#555555' }}>
                {i18n.t('loginScreen.password.label', { locale })}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  type="Ionicons"
                  name="md-key"
                  style={{ marginBottom: 'auto', marginTop: 'auto' }}
                />
                <LabeledTextInput
                  value={state.password} // TODO: remove
                  accessibilityLabel={i18n.t('loginScreen.password.label', { locale })}
                  underlineColorAndroid="transparent"
                  secureTextEntry={state.hidePassword}
                  style={styles.textBox}
                  onChangeText={(text) => {
                    setState({
                      ...state,
                      password: text,
                    });
                  }}
                  textAlign={isRTL ? 'right' : 'left'}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.touachableButton}
                  onPress={setPasswordVisibility}>
                  {state.hidePassword ? (
                    <Icon
                      type="FontAwesome"
                      name="eye"
                      style={{
                        marginBottom: 'auto',
                        marginTop: 'auto',
                        opacity: 0.3,
                        fontSize: 22,
                      }}
                    />
                  ) : (
                    <Icon
                      type="FontAwesome"
                      name="eye"
                      style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: 22 }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {passwordErrorMessage}
          {state.loading ? <LoadingSpinner /> : <LoginButton />}
          <AppVersion />
        </View>
        <LanguagePicker />
      </ScrollView>
      <Locale state={state} setState={setState} />
    </KeyboardAwareScrollView>
  );
};
LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
export default LoginScreen;
