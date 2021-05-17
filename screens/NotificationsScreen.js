import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
// component library (native base)
import { Container } from 'native-base';
// recommended by native base
import { Col, Row } from 'react-native-easy-grid';
// expo
// redux
import { useSelector, useDispatch } from 'react-redux';
// actions
import { getAll, markViewed, markUnread, markAllAsRead } from 'store/actions/notifications.actions';
// helpers/utils
import Colors from 'constants/Colors';
import i18n from 'languages';
import moment from 'languages/moment';
// custom components
import FilterList from 'components/FilterList';
import OfflineBar from 'components/OfflineBar';
// third-party components
import { Html5Entities } from 'html-entities';
// styles/assets
import { styles } from './NotificationsScreen.styles';

const NotificationsScreen = ({ navigation }) => {
  const DEFAULT_LIMIT = 10;

  const dispatch = useDispatch();

  const userData = useSelector((state) => state.userReducer.userData);
  const notifications = useSelector((state) => state.notificationsReducer.notifications);
  const loading = useSelector((state) => state.notificationsReducer.loading);
  const error = useSelector((state) => state.notificationsReducer.error);
  const isConnected = useSelector((state) => state.networkConnectivityReducer.isConnected);
  const isRTL = useSelector((state) => state.i18nReducer.isRTL);

  let unreadNotifications = [];
  if (notifications !== undefined) {
    unreadNotifications = notifications?.filter((notification) => {
      if (notification.is_new === '1') return notification;
    });
  }

  const [isAll, setIsAll] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10); // fails: useState(DEFAULT_LIMIT);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    dispatch(getAll(true, 0, DEFAULT_LIMIT));
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      onRefresh();
    });
    return unsubscribe;
  }, [navigation]);

  /*
  useEffect(() => {
    onRefresh();
  }, []);
  */

  /*
  const onRefresh = (loadMore = false) => {
    // NOTE: not actually paginating, only increasing limit (like an infinite scroll)
    //const offset_p = paginate ? (offset + DEFAULT_LIMIT) : 0;
    const limit_p = loadMore ? limit + DEFAULT_LIMIT : limit;
    const isAll = true;
    dispatch(getAll(isAll, offset, limit_p));
    //setOffset(offset_p);
    setLimit(limit_p);
  };
  */
  const Header = () => {
    const getAllReadUnread = () => {
      setIsAll(true);
    };
    const getUnread = () => {
      setIsAll(false);
    };
    const markAll = () => {
      dispatch(markAllAsRead(userData.id));
    };
    return (
      <Row style={{ height: 60, margin: 15 }}>
        <Col size={2}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {unreadNotifications && unreadNotifications.length > 0 && (
              <>
                <Text style={styles.newHeaderNumber}> {unreadNotifications.length} </Text>
                <Text style={styles.newHeader}>{i18n.t('notificationsScreen.new')}</Text>
              </>
            )}
          </View>
        </Col>
        <Col size={3}>
          <TouchableOpacity onPress={getAllReadUnread}>
            <View style={[isAll ? styles.marketButton : styles.unmarketButton, { marginRight: 1 }]}>
              <Text style={isAll ? styles.marketButtonText : styles.unmarketButtonText}>
                {i18n.t('notificationsScreen.all')}
              </Text>
            </View>
          </TouchableOpacity>
        </Col>
        <Col size={3}>
          <TouchableOpacity onPress={getUnread}>
            <View style={[isAll ? styles.unmarketButton : styles.marketButton, { marginLeft: 1 }]}>
              <Text style={isAll ? styles.unmarketButtonText : styles.marketButtonText}>
                {i18n.t('notificationsScreen.unRead')}
              </Text>
            </View>
          </TouchableOpacity>
        </Col>
        <Col size={2}>
          {unreadNotifications.length > 0 && (
            <TouchableOpacity onPress={markAll}>
              <View>
                <Text style={[styles.markAllHeader, { marginRight: 1 }]}>
                  {i18n.t('notificationsScreen.markAll')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Col>
      </Row>
    );
  };

  const NotificationsList = ({ list }) => {
    const markAsReadUnread = (notification, isNew) => {
      if (isNew) {
        dispatch(markViewed(notification.id));
      } else {
        dispatch(markUnread(notification.id));
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
    const renderRow = (notification) => {
      console.log('*** RENDER ROW ***');
      console.log(JSON.stringify(notification));
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
    // TODO: replace with FilterList and filter is All or Unread :-)
    return (
      <FilterList
        onRefresh={onRefresh}
        selectOptionFilter={null}
        filterByText={null}
        data={list}
        renderRow={renderRow}
        footer={list.length >= DEFAULT_LIMIT ? renderFooter : null}
        style={{ backgroundColor: Colors.mainBackgroundColor }}
      />
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

  /*
      {<Header />}
      {isAll && notifications && notifications.length > 0 ? (
        <NotificationsList list={notifications} />
      ) : unreadNotifications && unreadNotifications.length > 0 ? (
        <NotificationsList list={unreadNotifications} />
      ) : (
        <NotificationsPlaceholder />
      )}
*/
  return (
    <Container style={styles.container}>
      {!isConnected && <OfflineBar />}
      {notifications && notifications.length > 0 ? (
        <NotificationsList list={notifications} />
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
