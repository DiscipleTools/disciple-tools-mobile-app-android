import useRequest from 'hooks/useRequest';

const useNotifications = () => {
  const url = 'dt/v1/notifications/get_notifications';
  /* TODO: useSWRInfinity?
  const req = {
    url,
    body: {
      all: allNotifications,
      page: offset,
      limit,
    }
  };
  */

  const { data, error, isLoading, isValidating, mutate } = useRequest(url);

  // TODO:

  const markAllViewed = async (userId) => {
    // try, catch, toast
    // POST: const url = dt/v1/notifications/mark_all_viewed/${userId}`,
    // mutate();
  };

  const markViewed = async (notificationId) => {
    // try, catch, toast
    // POST: const url = dt/v1/notifications/mark_viewed/${notificationId}`,
    // mutate();
  };

  const markUnread = async (notificationId) => {
    // try, catch, toast
    // POST: const url = dt/v1/notifications/mark_unread/${notificationId}`,
    // mutate();
  };

  return {
    myUser: data,
    error,
    isLoading,
    isValidating,
  };
};
export default useNotifications;
