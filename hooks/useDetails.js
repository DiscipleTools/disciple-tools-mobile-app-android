import useRequest from 'hooks/useRequest';
import utils from 'utils';

const useDetails = (moduleType, id) => {
  const mapRecord = (record) => {
    if (moduleType === 'groups') {
      return utils.mapGroup(record);
    } else {
      return utils.mapContact(record);
    }
  };

  const url = `/dt-posts/v2/${moduleType}/${id}`;
  const initialData = null;
  const { data: record, error } = useRequest({ url }, { initialData });
  return {
    record: record ? mapRecord(record) : null,
    error,
  };
};
export default useDetails;
