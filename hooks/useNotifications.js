import useRequest from 'hooks/useRequest';

const useNotifications = () => {
  const url = 'dt/v1/notifications/get_notifications';
  // TODO: useSWRInfinity: https://swr.vercel.app/examples/infinite-loading
  const req = {
    method: 'post',
    url,
    data: {
      all: true,
      limit: 20,
      page: 0,
    },
  };

  const { data, error, isLoading, isValidating, mutate } = useRequest(req);

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
    notifications: data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useNotifications;
