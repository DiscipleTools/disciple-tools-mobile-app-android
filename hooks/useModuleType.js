import { useRoute } from '@react-navigation/native';

// TODO: use constants
const useModuleType = () => {
  const route = useRoute();

  const moduleType = route?.name?.toLowerCase().replace('detail', '') ?? 'contacts';

  return {
    isContact: moduleType === 'contacts',
    isGroup: moduleType === 'groups',
    moduleType,
  };
};
export default useModuleType;
