import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
// TODO: move to useNetworkStatus
import { toggleNetworkConnectivity } from 'store/actions/networkConnectivity.actions';

// Component Library (Native Base)
import {
  Body,
  Button as NbButton,
  Container,
  Icon,
  Left,
  ListItem,
  Picker,
  Right,
  Switch,
  Thumbnail,
} from 'native-base';

// Expo
import Constants from 'expo-constants';
import * as MailComposer from 'expo-mail-composer';
//import * as Updates from 'expo-updates';

// Custom Hooks
import useNetworkStatus from 'hooks/useNetworkStatus';
import useI18N from 'hooks/useI18N';
import useAuth from 'hooks/useAuth';
import useMyUser from 'hooks/useMyUser';
import useDevice from 'hooks/useDevice';
import useToast from 'hooks/useToast';

// Custom Components
import OfflineBar from 'components/OfflineBar';
import Locale from 'components/Locale';

// Styles, Constants, Icons, Assets, etc...
import { styles } from './SettingsScreen.styles';
import gravatar from 'assets/images/gravatar-default.png';

const SettingsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const isConnected = useNetworkStatus();
  const { i18n, isRTL, locale, LanguagePickerItems } = useI18N();
  const { hasPIN, isAutoLogin, rememberLoginDetails, toggleAutoLogin, toggleRememberLoginDetails } =
    useAuth();

  const { isIOS } = useDevice();
  const toast = useToast();

  const { userData, error: userError, logout } = useMyUser();
  if (!userData) return null;

  const [state, setState] = useState({
    locale,
  });

  // update local state any time 'hasPIN' changes globally
  useEffect(() => {
    setState({
      ...state,
      hasPIN,
    });
  }, [hasPIN]);

  /*
  // display error toast on global 'userReducerError'
  useEffect(() => {
    if (userReducerError !== null && userReducerError.length() > 0) {
      toast(userReducerError, true);
    }
  }, [userReducerError]);

  if (!userData) return null;
  */

  const Header = () => {
    const username = userData?.display_name ?? null;
    // TODO: get from Redux
    const domain = userData?.domain ?? null;
    return (
      <ListItem itemHeader first avatar style={styles.header}>
        <Left>
          <Thumbnail source={gravatar} />
        </Left>
        <Body style={styles.headerBody}>
          <Text
            style={[
              {
                writingDirection: isRTL ? 'rtl' : 'ltr',
                textAlign: isRTL ? 'right' : 'left',
              },
              styles.username,
            ]}>
            {username}
          </Text>
          <Text
            style={[
              {
                writingDirection: isRTL ? 'rtl' : 'ltr',
                textAlign: isRTL ? 'right' : 'left',
              },
              styles.domain,
            ]}>
            {domain}
          </Text>
        </Body>
      </ListItem>
    );
  };

  const StorybookButton = () => {
    return (
      <ListItem icon onPress={() => navigation.navigate('Storybook')}>
        <Left>
          <NbButton style={styles.button}>
            <Icon active name="flask" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('settingsScreen.storybook')}
          </Text>
        </Body>
        <Right>
          <Icon active name={isRTL ? 'arrow-back' : 'arrow-forward'} />
        </Right>
      </ListItem>
    );
  };

  const OnlineToggle = () => {
    const toggleOnline = () => {
      const toastMsg = isConnected
        ? i18n.t('settingsScreen.networkUnavailable')
        : i18n.t('settingsScreen.networkAvailable');
      toast(toastMsg, isConnected);
      // TODO: move to useNetworkStatus hook
      dispatch(toggleNetworkConnectivity());
    };
    return (
      <ListItem icon>
        <Left>
          <NbButton style={styles.button}>
            <Icon name="ios-flash" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('global.online')}
          </Text>
        </Body>
        <Right>
          <Switch value={isConnected} onChange={toggleOnline} disabled={false} />
        </Right>
      </ListItem>
    );
  };

  const LanguageOption = () => {
    return (
      <ListItem icon>
        <Left>
          <NbButton style={styles.button}>
            <Icon active type="FontAwesome" name="language" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('global.language')}
          </Text>
        </Body>
        <Right>
          <Picker
            iosIcon={<Icon style={styles.pickerIosIcon} name="caret-down" />}
            style={isIOS ? null : { width: 150 }}
            selectedValue={state.locale}
            onValueChange={(value) => {
              setState({
                ...state,
                locale: value,
              });
            }}>
            <LanguagePickerItems />
          </Picker>
        </Right>
      </ListItem>
    );
  };

  const AutoLoginToggle = () => {
    return (
      <ListItem icon>
        <Left>
          <NbButton style={styles.button}>
            <Icon active type="MaterialCommunityIcons" name="login-variant" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('settingsScreen.autoLogin')}
          </Text>
        </Body>
        <Right>
          <Switch
            value={isAutoLogin}
            onChange={() => {
              toggleAuthLogin();
            }}
          />
        </Right>
      </ListItem>
    );
  };

  // TODO: add translations for 'rememberLoginDetails'
  const RememberLoginDetailsToggle = () => {
    return (
      <ListItem icon>
        <Left>
          <NbButton style={styles.button}>
            <Icon active type="MaterialCommunityIcons" name="onepassword" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('settingsScreen.rememberLoginDetails')}
          </Text>
        </Body>
        <Right>
          <Switch
            value={rememberLoginDetails}
            onChange={() => {
              toggleRememberLoginDetails();
            }}
          />
        </Right>
      </ListItem>
    );
  };

  const PINCodeToggle = () => {
    const togglePIN = () => {
      const type = hasPIN ? 'delete' : 'set';
      navigation.navigate('PIN', {
        screen: 'PIN',
        params: { type, code: null },
      });
    };
    return (
      <ListItem icon>
        <Left>
          <NbButton style={styles.button}>
            <Icon active type="MaterialCommunityIcons" name="security" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('settingsScreen.pinCode')}
          </Text>
        </Body>
        <Right>
          <Switch
            value={hasPIN}
            onChange={() => {
              togglePIN();
            }}
          />
        </Right>
      </ListItem>
    );
  };

  const HelpSupportButton = () => {
    const draftNewSupportEmail = () => {
      MailComposer.composeAsync({
        recipients: ['appsupport@disciple.tools'],
        subject: `DT App Support: v${Constants.manifest.version}`,
        body: '',
      }).catch((onrejected) => {
        const message = onrejected.toString();
        toast(message, true);
      });
    };
    return (
      <ListItem icon onPress={draftNewSupportEmail}>
        <Left>
          <NbButton style={styles.button}>
            <Icon active name="help-circle" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('settingsScreen.helpSupport')}
          </Text>
        </Body>
      </ListItem>
    );
  };

  const AppVersionText = () => {
    return <Text style={styles.versionText}>{Constants.manifest.version}</Text>;
  };

  const LogoutButton = () => {
    return (
      <ListItem
        icon
        onPress={() => {
          logout();
        }}>
        <Left>
          <NbButton style={styles.button}>
            <Icon active name="log-out" />
          </NbButton>
        </Left>
        <Body style={styles.body}>
          <Text
            style={{
              writingDirection: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left',
            }}>
            {i18n.t('settingsScreen.logout')}
          </Text>
        </Body>
        <Right>
          <Icon active name={isRTL ? 'arrow-back' : 'arrow-forward'} />
        </Right>
      </ListItem>
    );
  };

  return (
    <Container style={styles.container}>
      {!isConnected && <OfflineBar />}
      <Header />
      {__DEV__ && <StorybookButton />}
      <OnlineToggle />
      <LanguageOption />
      <AutoLoginToggle />
      <RememberLoginDetailsToggle />
      <PINCodeToggle />
      <HelpSupportButton />
      <LogoutButton />
      <AppVersionText />
      <Locale state={state} setState={setState} />
    </Container>
  );
};
SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
export default SettingsScreen;
