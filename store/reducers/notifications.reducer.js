import * as actions from '../actions/notifications.actions';
import * as userActions from '../actions/user.actions';
import { REHYDRATE } from 'redux-persist/lib/constants';

const initialState = {
  loading: false,
  error: null,
  notifications: [],
};

export default function notificationsReducer(state = initialState, action) {
  let idx = -1;
  let notifications = [];
  const newState = {
    ...state,
    error: null,
  };
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...newState,
        loading: false,
      };
    }
    case actions.NOTIFICATIONS_BY_USER_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.NOTIFICATIONS_BY_USER_SUCCESS:
      return {
        ...newState,
        notifications: action.notifications,
        loading: false,
      };
    case actions.NOTIFICATIONS_BY_USER_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.NOTIFICATIONS_COUNT_BY_USER_SUCCESS:
      return {
        ...newState,
      };
    case actions.NOTIFICATIONS_COUNTBY_USER_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.NOTIFICATIONS_MARK_AS_VIEWED:
      idx = state.notifications.findIndex(
        (notifications) => notifications.id === action.notificationId,
      );
      if (idx !== -1) state.notifications[idx].is_new = '0';
      // NOTE: copy notifications array to force component re-render
      return {
        ...state,
        notifications: [...state.notifications],
      };
    case actions.NOTIFICATIONS_MARK_AS_UNREAD:
      idx = state.notifications.findIndex(
        (notifications) => notifications.id === action.notificationId,
      );
      if (idx !== -1) state.notifications[idx].is_new = '1';
      return {
        ...state,
        notifications: [...state.notifications],
      };
    case actions.NOTIFICATIONS_MARK_ALL_AS_READ:
      notifications = state.notifications.map((notification) => {
        notification.is_new = '0';
        return notification;
      });
      return {
        ...state,
        notifications,
      };
    case userActions.USER_LOGOUT:
      return {
        ...newState,
      };
    default:
      return newState;
  }
}
