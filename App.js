import React, { useCallback, useEffect, useRef, useState } from 'react';

import { enableScreens } from 'react-native-screens';
enableScreens();

import { LogBox, Platform, StatusBar, View } from 'react-native';
import { SWRConfig } from 'swr';

// React Native Community
import NetInfo from '@react-native-community/netinfo';

// Expo
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

// Component Library
import { Root } from 'native-base';

// Helpers
import AppNavigator from 'navigation/AppNavigator';
import { store, persistor } from 'store/store';
import utils from 'utils';
import axios from 'services/axios';

// Third-party components
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import {
  setNetworkStatus,
  setNetworkConnectivity,
} from 'store/actions/networkConnectivity.actions';

// TODO: re-introduce Sentry? something else? remove crash analytics for privacy?
/*
Sentry.init({
  dsn: 'https://aaa9d833ba5942d59c69e290ffbd3f36@o424480.ingest.sentry.io/5356329',
  enableInExpoDevelopment: true,
  debug: true,
});
*/

import { styles } from './App.styles';

const App = () => {
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$$$$          APP.JS                         $$$$$');
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('...');
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Push Notification Listeners
  useEffect(() => {
    // Show incoming notifications when the app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    // Notification is received while the app is running
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('********** NOTIFICATION RECEIVED **********');
      console.log(notification);
      setNotification(notification);
    });
    // User interacted with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('********** NOTIFICATION RESPONSE **********');
      console.log(response);
      // TODO: Navigate to the appropriate screen on Notification click
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  // Network Connectivity Listeners
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      handleConnectivityChange(state.isConnected);
    });
    // TODO: describe what this is doing
    unsubscribe = NetInfo.addEventListener((state) =>
      utils.onlyExecuteLastCall(state.isConnected, handleConnectivityChange, 1000),
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (isConnected) => {
    if (isConnected) {
      // check if the phone has internet
      fetch('https://8.8.8.8')
        .then(() => {
          store.dispatch(setNetworkConnectivity(true));
          store.dispatch(setNetworkStatus(true));
        })
        .catch(() => {
          store.dispatch(setNetworkConnectivity(false));
          store.dispatch(setNetworkStatus(false));
        });
    } else {
      store.dispatch(setNetworkConnectivity(false));
      store.dispatch(setNetworkStatus(false));
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        //await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow load
        //await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
      }
    };
    init();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SWRConfig
          value={{
            focusThrottleInterval: 5000,
            refreshInterval: 0,
            dedupingInterval: 2000,
            loadingTimeout: 15000,
            fetcher: async (...args) => axios(...args).then((res) => res.data),
          }}>
          <Root>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
            </View>
          </Root>
        </SWRConfig>
      </PersistGate>
    </Provider>
  );
};
export default App;

LogBox.ignoreLogs(['Warning:', 'Animated:', 'VirtualizedLists', 'console.disableYellowBox']);
