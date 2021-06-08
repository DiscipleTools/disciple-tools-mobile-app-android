import useRequest from 'hooks/useRequest';

const useUsers = (searchString) => {
  //let url = "dt/v1/users/get_users";
  let url = 'dt/v1/users/get_users?get_all=1';
  if (searchString) url += `&s=${searchString}`;

  const { data, error, isLoading, isValidating, mutate } = useRequest(url);

  // TODO:
  const setServerLocale = async (locale) => {
    // try, catch, toast
    // POST: const url = `dt/v1/user/my?locale=${locale}`;
    // mutate();
  };

  return {
    myUser: data,
    error,
    isLoading,
    isValidating,
    setServerLocale,
  };
};
export default useUsers;
