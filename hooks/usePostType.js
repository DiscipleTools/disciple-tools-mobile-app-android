import { useRoute } from '@react-navigation/native';

// TODO: use constants
const usePostType = () => {
  const route = useRoute();
  const postType = route?.params?.type;
  return {
    isContact: postType === 'contacts',
    isGroup: postType === 'groups',
    postType,
  };
};
export default usePostType;
