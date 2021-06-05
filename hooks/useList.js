import useResource from 'hooks/useResource';
import utils from 'utils';

const useList = (moduleType, filter) => {
  // TODO: merge mapContacts and mapGroups?
  const mapPosts = (posts) => {
    // TODO: use constant
    if (moduleType === 'groups') {
      return utils.mapGroups(posts);
    } else {
      return utils.mapContacts(posts);
    }
  };

  // getAll

  //const url = `/dt-posts/v2/${moduleType}${utils.recursivelyMapFilterOnQueryParams(
  const url = `/dt-posts/v2/${moduleType}`;
  // TODO: useSelect for initialData?
  //const initialData = null;

  let { data, error } = useResource(url);

  return {
    posts: data?.posts ? mapPosts(data.posts) : null,
    error,
  };
};
export default useList;
