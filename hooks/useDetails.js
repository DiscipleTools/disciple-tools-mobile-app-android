import useId from 'hooks/useId';
import usePostType from 'hooks/usePostType';
import useResource from 'hooks/useResource';
import useToast from 'hooks/useToast';

const useDetails = () => {
  const id = useId();
  const { isContact, isGroup, postType, mapContact, mapGroup } = usePostType();

  const toast = useToast();

  const mapPost = (post) => {
    if (isContact) {
      return mapContact(post);
    } else {
      return mapGroup(post);
    }
  };

  // getById
  // saveComment

  const baseUrl = `/dt-posts/v2/${postType}`;
  const url = `${baseUrl}/${id}`;
  // TODO: useSelect for initialData?
  //const initialData = null;
  const { data, error, isLoading, isValidating, mutate, write } = useResource(url);

  const save = async (field, value) => {
    console.log(`*** SAVE!  id: ${id},  field: ${JSON.stringify({ field, value })} ***`);
    const data = {};
    data[field] = value;
    try {
      let res = null;
      if (!id) {
        //res = await create({
        res = await write({
          url: baseUrl,
          method: 'POST',
          data,
        });
      } else {
        //res = await update({
        res = await write({
          url,
          //method: "PUT",
          method: 'POST',
          data,
        });
      }
      mutate();
      console.log(`res: ${JSON.stringify(res)}`);
      if (res) {
        if (res?.status === 200) {
          // TODO: translation
          toast('Saved successfully');
        } else {
          // TODO: translation
          toast('Unable to save', true);
        }
      }
    } catch (err) {
      console.log(`err: ${JSON.stringify(err)}`);
      // TODO: translation
      toast('GENERIC ERROR GOES HERE', true);
    }
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
