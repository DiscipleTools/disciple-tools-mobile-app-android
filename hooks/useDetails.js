import useRequest from 'hooks/useRequest';

const useDetails = (moduleType, id) => {
  const url = `/dt-posts/v2/${moduleType}/${id}`;
  const initialData = null;
  return useRequest({ url }, { initialData });
};
export default useDetails;
