import useResource from 'hooks/useResource';
import utils from 'utils';

const useDetails = (moduleType, id) => {
  // TODO: merge mapContact and mapGroup?
  const mapPost = (post) => {
    // TODO: use constant
    if (moduleType === 'groups') {
      return utils.mapGroup(post);
    } else {
      return utils.mapContact(post);
    }
  };

  // save
  // getById
  // saveComment

  const url = `/dt-posts/v2/${moduleType}/${id}`;
  // TODO: useSelect for initialData?
  //const initialData = null;
  const { data, error, isLoading, isValidating, mutate, create, update, destroy } = useResource(
    url,
  );

  const save = (post) => {
    // TODO:
    //create(); or
    //update();
  };

  // TODO: useComment()
  const saveComment = (comment) => {
    // TODO:
    // update();
  };

  const getComments = (moduleType, pagination) => {
    // TODO:
    // read();
    // useRequest()?;
  };

  const deleteComment = (commentId) => {
    // TODO:
    /*
    url: `/dt-posts/v2/contacts/${contactId}/comments/${commentId}`,
    data: {
      method: 'DELETE',
    */
    //destroy();
  };

  // TODO: useComment()
  const getActivitiesByContact = (pagination) => {
    // TODO:
    // read();
  };

  // TODO: useShare() ?
  const getShareSettings = () => {
    // useSWR? useRequest?
    // read();
  };

  const addUserToShare = (userId) => {
    // TODO:
    // update();
  };

  const removeSharedUser = (userId) => {
    /*
    url: `https://${domain}/wp-json/dt-posts/v2/contacts/${contactId}/shares`,
      data: {
      method: 'DELETE',
    */
    // destroy();
  };

  return {
    mutate,
    post: post ? mapPost(post) : null,
    error,
    isLoading,
    isValidating,
    //save
  };
};
export default useDetails;
