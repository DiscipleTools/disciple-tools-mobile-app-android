import useUsers from 'hooks/useUsers';
import useList from 'hooks/useList';

const useUsersContacts = () => {
  const { users } = useUsers();
  const { posts: contacts } = useList(null, 'contacts');
  if (!users || !contacts) return null;
  const mergedUsersContacts = [...users];
  contacts.forEach((contact) => {
    users.forEach((user) => {
      if (user?.name !== contact?.title) mergedUsersContacts.push(contacts);
    });
  });
  return {
    mergedUsersContacts,
  };
};
export default useUsersContacts;
