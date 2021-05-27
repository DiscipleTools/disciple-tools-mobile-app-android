import useRequest from 'hooks/useRequest';
import utils from 'utils';

const useList = (moduleType, filter) => {
  // TODO: merge mapContacts and mapGroups?
  const mapRecords = (records) => {
    if (moduleType === 'groups') {
      return utils.mapGroups(records);
    } else {
      return utils.mapContacts(records);
    }
  };

  //const url = `/dt-posts/v2/${moduleType}${utils.recursivelyMapFilterOnQueryParams(
  const url = `/dt-posts/v2/${moduleType}`;
  const initialData = null;
  const { data: records, error } = useRequest({ url }, { initialData });
  return {
    records: records?.posts ? mapRecords(records.posts) : null,
    error,
  };
};
export default useList;
