import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

// Component Library (Native Base)
import { Container } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';

// 3rd-Party Components
import { Html5Entities } from 'html-entities';

// Custom Components
import FilterList from 'components/FilterList';
import OfflineBar from 'components/OfflineBar';

// Custom Hooks
import useNetworkStatus from 'hooks/useNetworkStatus';
import useI18N from 'hooks/useI18N';
import useNotifications from 'hooks/useNotifications.js';
import useMyUser from 'hooks/useMyUser.js';

// Styles, Constants, Icons, Assets, etc...
import { styles } from './NotificationsScreen.styles';
import Colors from 'constants/Colors';

// TODO: resolve screen flickering
const NotificationsScreen = ({ navigation }) => {
  const DEFAULT_LIMIT = 10;

  const isConnected = useNetworkStatus();
  const { i18n, isRTL, moment } = useI18N();
  const {
    notifications,
    error: notificationsError,
    isLoading,
    isValidating,
    mutate,
  } = useNotifications();
  const { userData, error: userError } = useMyUser();

  const unreadNotifications = notifications?.filter((notification) => {
    if (notification.is_new === '1') return notification;
  });

  const [isAll, setIsAll] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10); // fails: useState(DEFAULT_LIMIT);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    mutate();
  });

  /*
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // something onFocus
    });
    return unsubscribe;
  }, [navigation]);
  */

  const renderRow = (notification) => {
    //console.log('*** RENDER ROW ***');
    //console.log(JSON.stringify(notification));
    const str1 = notification.notification_note.search('<');
    const str2 = notification.notification_note.search('>');
    const str3 = notification.notification_note.length - 4;
    const newNotificationNoteA = notification.notification_note.substr(0, str1);
    const newNotificationNoteB = notification.notification_note.substr(str2, str3);
    const str4 = newNotificationNoteB.search('<') - 1;
    const newNotificationNoteC = newNotificationNoteB.substr(1, str4);
    let entityLink = notification.notification_note.substring(
      notification.notification_note.lastIndexOf('href="') + 6,
      notification.notification_note.lastIndexOf('">'),
    );
    let entityId = entityLink.split('/')[4];
    let entityName = entityLink.split('/')[3];
    const entities = new Html5Entities();
    const isNew = notification.is_new === '1' ? true : false;
    return (
      <View
        style={
          isNew
            ? { backgroundColor: 'rgba(63, 114, 155, 0.19)' }
            : { backgroundColor: Colors.mainBackgroundColor }
        }>
        <View style={[styles.notificationContainer, { flex: 1, flexDirection: 'row' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[isRTL ? { textAlign: 'left' } : {}]}>
              <Text>{entities.decode(newNotificationNoteA)}</Text>
              <Text
                style={{ color: Colors.primary }}
                onPress={() => redirectToDetailView(entityName, entityId, newNotificationNoteC)}>
                {entities.decode(newNotificationNoteC)}
              </Text>
            </Text>
            <Text style={[styles.prettyTime, isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
              {moment(notification.date_notified).fromNow() +
                ' ~ ' +
                moment(notification.date_notified).format('L')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              markAsReadUnread(notification, isNew);
            }}>
            <View style={styles.buttonContainer}>
              <View
                style={isNew ? styles.notificationUnreadButton : styles.notificationReadButton}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const markAsReadUnread = (notification, isNew) => {
    if (isNew) {
      //dispatch(markViewed(notification.id));
    } else {
      //dispatch(markUnread(notification.id));
    }
  };

  const redirectToDetailView = (viewName, entityId, entityTitle) => {
    let view, prop;
    switch (viewName) {
      case 'contacts':
        view = 'ContactDetail';
        prop = 'contact';
        break;
      case 'groups':
        view = 'GroupDetail';
        prop = 'group';
        break;
      default:
    }
    navigation.push(view, {
      [`${prop}Id`]: entityId,
      onlyView: true,
      [`${prop}Name`]: entityTitle,
      fromNotificationView: true,
    });
  };

  const renderFooter = () => {
    return (
      <View style={styles.loadMoreFooterText}>
        <TouchableOpacity
          onPress={() => {
            onRefresh(true);
          }}>
          <Text style={styles.loadMoreFooterText}>{i18n.t('notificationsScreen.loadMore')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const NotificationsPlaceholder = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.dontHaveNotificationsText}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}>
        {isAll && (
          <Text style={styles.dontHaveNotificationsText}>
            {i18n.t('notificationsScreen.dontHaveNotifications')}
          </Text>
        )}
        {!isAll && (
          <Text style={styles.dontHaveNotificationsText}>
            {i18n.t('notificationsScreen.dontHaveNotificationsUnread')}
          </Text>
        )}
      </ScrollView>
    );
  };

  if (!notifications) return null;
  /*
  return(
    <Text>{ JSON.stringify(notifications) } </Text>
  )
  */
  // TODO: Filter All or Unread :-)
  return (
    <Container style={styles.container}>
      {!isConnected && <OfflineBar />}
      {notifications.length > 0 ? (
        <FilterList
          posts={notifications}
          loading={isLoading || isValidating}
          renderRow={renderRow}
          //footer={list.length >= DEFAULT_LIMIT ? renderFooter : null}
          //style={{ backgroundColor: Colors.mainBackgroundColor }}
        />
      ) : (
        <NotificationsPlaceholder />
      )}
    </Container>
  );
};
NotificationsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};
export default NotificationsScreen;
