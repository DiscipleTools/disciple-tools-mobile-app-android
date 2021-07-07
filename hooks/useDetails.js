import useId from 'hooks/useId';
import usePostType from 'hooks/usePostType';
import useResource from 'hooks/useResource';
import helpers from 'helpers';

const useDetails = () => {
  const id = useId();
  const { isContact, isGroup, postType } = usePostType();

  // TODO: merge mapContact and mapGroup?
  const mapPost = (post) => {
    if (isContact) {
      return helpers.mapContact(post);
    } else {
      return helpers.mapGroup(post);
    }
  };

  // save
  // getById
  // saveComment

  const url = `/dt-posts/v2/${postType}/${id}`;
  // TODO: useSelect for initialData?
  //const initialData = null;
  const { data, error, isLoading, isValidating, mutate, create, update, destroy } =
    useResource(url);

  const save = (field, value) => {
    // TODO:
    //create(); or
    //update();
    console.log(`*** SAVE!  id: ${id},  field: ${JSON.stringify({ field, value })} ***`);
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
    post: data ? mapPost(data) : null,
    error,
    isLoading,
    isValidating,
    mutate,
    save,
  };
};
export default useDetails;
