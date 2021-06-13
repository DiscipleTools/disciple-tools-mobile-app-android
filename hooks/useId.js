import { useRoute } from '@react-navigation/native';

const useId = () => {
  const route = useRoute();
  const id = route?.params?.id ?? null;
  return id;
};
export default useId;
