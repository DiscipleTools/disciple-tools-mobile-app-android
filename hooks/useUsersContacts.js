import useUsers from 'hooks/useUsers';
import useList from 'hooks/useList';

const useUsersContacts = () => {
  const { users } = useUsers();
  const { posts: contacts } = useList(null, 'contacts');
  if (!users || !contacts) return null;
  const mergedUsersContacts = [...users];
  const mergedIndicies = [];
  contacts.forEach((contact) => {
    users.forEach((user) => {
      if (user?.contact_id !== contact?.ID && mergedIndicies.indexOf(contact?.ID) === -1) {
        mergedUsersContacts.push(contact);
        mergedIndicies.push(contact.ID);
      }
    });
  });
  return mergedUsersContacts;
};
export default useUsersContacts;
