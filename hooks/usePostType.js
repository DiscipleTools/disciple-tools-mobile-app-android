import { useRoute } from '@react-navigation/native';

// TODO: use constants
const usePostType = () => {
  const route = useRoute();

  const postType = route?.name?.toLowerCase().replace('detail', '') ?? 'contacts';

  return {
    isContact: postType === 'contacts',
    isGroup: postType === 'groups',
    postType,
  };
};
export default usePostType;
