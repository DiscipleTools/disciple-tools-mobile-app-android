import { useRoute } from '@react-navigation/native';

// TODO: use constants
const usePostType = (postType) => {
  const route = useRoute();
  if (!postType) postType = route?.params?.type;
  return {
    isContact: postType === 'contacts',
    isGroup: postType === 'groups',
    //isTraining: postType === 'training',
    postType,
  };
};
export default usePostType;
