import useRequest from 'hooks/useRequest';

const useUsers = (searchString) => {
  let url = 'dt/v1/users/get_users?get_all=1';
  if (searchString) url += `&s=${searchString}`;

  const { data, error, isLoading, isValidating } = useRequest(url);

  return {
    users: data,
    error,
    isLoading,
    isValidating,
  };
};
export default useUsers;
