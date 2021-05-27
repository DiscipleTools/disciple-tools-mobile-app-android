import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from 'screens/HomeScreen';
import PINScreen from 'screens/PINScreen';
import ListScreen from 'screens/Modules/ListScreen';
import DetailsScreen from 'screens/Modules/DetailsScreen';
import QuestionnaireScreen from 'screens/QuestionnaireScreen';
import AttendanceScreen from 'screens/AttendanceScreen';
import NotificationsScreen from 'screens/NotificationsScreen';
import SettingsScreen from 'screens/SettingsScreen';
import Storybook from 'storybook';

import TabBarIcon from 'components/TabBarIcon';
import Colors from 'constants/Colors';
import i18n from 'languages';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import {
  getLocations,
  getPeopleGroups,
  getLocationListLastModifiedDate,
} from 'store/actions/groups.actions';
import { getUsers } from 'store/actions/users.actions';

const MainTabNavigator = ({ navigation }) => {
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  console.log('$$$$$          MAIN TAB NAVIGATOR             $$$$$');
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: batch?
    // TODO: caching?
    // TODO: get Contacts here since it is default/initial screen?
    dispatch(getUsers());
    dispatch(getLocations());
    dispatch(getPeopleGroups());
  }, []);

  const notifications = useSelector((state) => state.notificationsReducer.notifications);
  let unreadNotifications = [];
  if (notifications !== undefined) {
    unreadNotifications = notifications?.filter((notification) => {
      if (notification.is_new === '1') return notification;
    });
  }
  const notificationsCount = unreadNotifications?.length > 0 ? unreadNotifications.length : null;

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: Colors.headerTintColor,
    //headerBackTitle: ""
  };

  const ContactsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Contacts"
          component={ListScreen}
          options={{
            title: i18n.t('contactsScreen.contacts'),
          }}
        />
        <Stack.Screen
          name="ContactDetails"
          //component={ContactDetailScreen}
          component={DetailsScreen}
          options={{
            title: '',
          }}
        />
      </Stack.Navigator>
    );
  };

  const GroupsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Groups"
          component={ListScreen}
          options={{
            title: i18n.t('global.groups'),
          }}
        />
        <Stack.Screen
          name="GroupDetails"
          //component={GroupDetailScreen}
          component={DetailsScreen}
          //options={({ route }) => ({
          //  title: route.params.groupName
          //})}
        />
      </Stack.Navigator>
    );
  };

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            // TODO: translate
            title: 'Home',
          }}
        />
      </Stack.Navigator>
    );
  };

  // TODO: Dynamically generate Module/PostType Screens based on availablility
  // For anything non-Contact/Group, pass in Route param to identify the POST_TYPE
  const MoreStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="More"
          component={ContactsScreen}
          options={{
            title: '',
          }}
        />
      </Stack.Navigator>
    );
  };

  const NotificationsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: i18n.t('notificationsScreen.notifications'),
          }}
        />
      </Stack.Navigator>
    );
  };

  const SettingsStack = () => {
    return (
      <Stack.Navigator screenOptions={screenOptionStyle}>
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: i18n.t('settingsScreen.settings'),
          }}
        />
      </Stack.Navigator>
    );
  };

  const PINStack = () => {
    const navigation = useNavigation();
    const overrideScreenOptionStyle = { ...screenOptionStyle };
    overrideScreenOptionStyle['headerBackTitle'] = i18n.t('settingsScreen.settings');
    overrideScreenOptionStyle['title'] = '';
    overrideScreenOptionStyle['headerStyle'] = {
      ...screenOptionStyle.headerStyle,
      shadowColor: 'transparent',
    };
    return (
      <Stack.Navigator screenOptions={overrideScreenOptionStyle}>
        <Stack.Screen
          name="PIN"
          options={{
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate('Settings');
                }}
              />
            ),
          }}>
          {(props) => <PINScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  };

  const StorybookStack = () => {
    const navigation = useNavigation();
    const overrideScreenOptionStyle = { ...screenOptionStyle };
    overrideScreenOptionStyle['headerBackTitle'] = i18n.t('settingsScreen.settings');
    return (
      <Stack.Navigator screenOptions={overrideScreenOptionStyle}>
        <Stack.Screen
          name="Storybook"
          component={Storybook}
          options={{
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                onPress={() => {
                  navigation.navigate('Settings');
                }}
              />
            ),
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName={'Contacts'}
      tabBarOptions={{
        activeTintColor: Colors.tintColor,
      }}
      screenOptions={({ route }) => ({
        //tabBarButton: ['Notifications', 'Settings', 'PIN', 'Storybook'].includes(route.name)
        tabBarButton: ['PIN', 'Storybook'].includes(route.name)
          ? () => {
              return null;
            }
          : undefined,
      })}>
      {/*
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          // TODO: translate
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="MaterialCommunityIcons" name="home-analytics" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          // TODO: translate
          tabBarLabel: 'More',
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="Feather" name="more-horizontal" focused={focused} />
          ),
        }}
      />
      */}
      <Tab.Screen
        name="Contacts"
        component={ContactsStack}
        options={{
          tabBarLabel: i18n.t('contactsScreen.contacts'),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="user" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsStack}
        options={{
          tabBarLabel: i18n.t('global.groups'),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="users" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          tabBarLabel: i18n.t('notificationsScreen.notifications'),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="bell" focused={focused} />
          ),
          tabBarBadge: notificationsCount,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: i18n.t('settingsScreen.settings'),
          //tabBarLabel: ({ focused, color, size }) => (
          //  <Text style={{ color, fontSize: size }}>{i18n.t('settingsScreen.settings')}</Text>
          //),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="cog" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Storybook"
        component={StorybookStack}
        options={{
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="PIN"
        component={PINStack}
        options={{
          tabBarVisible: false,
        }}
      />
    </Tab.Navigator>
  );
};
/*
      <Tab.Screen
        name="Contacts"
        component={ContactsStack}
        options={{
          tabBarLabel: i18n.t('contactsScreen.contacts'),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="user" focused={focused} />
          )
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsStack}
        options={{
          tabBarLabel: i18n.t('global.groups'),
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon type="FontAwesome" name="users" focused={focused} />
          )
        }}
      />
*/
export default MainTabNavigator;
