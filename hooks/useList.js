import usePostType from 'hooks/usePostType.js';
import useResource from 'hooks/useResource';

import helpers from 'helpers';

const useList = (filter) => {
  const { isContact, isGroup, postType } = usePostType();

  const mapPosts = (posts) => {
    if (isContact) return helpers.mapContacts(posts);
    if (isGroup) return helpers.mapGroups(posts);
    return null;
  };

  const mapFilterOnQueryParams = (filter, userData) => {
    let queryParams = '?';
    Object.keys(filter).forEach((key) => {
      let filterValue = filter[key];
      let filterValueType = Object.prototype.toString.call(filterValue);
      if (filterValueType === '[object Array]') {
        filterValue.forEach((value) => {
          queryParams = `${queryParams}${queryParams === '?' ? '' : '&'}${key}%5B%5D=${
            value === userData.displayName ? 'me' : value
          }`;
        });
      } else if (filterValueType === '[object Object]') {
        // TODO: implement?
        //mapFilterOnQueryParams(filterValue, null, userData);
      } else {
        if (filterValue?.length > 0) {
          queryParams = `${queryParams}${queryParams === '?' ? '' : '&'}${key}=${
            filterValue === userData.displayName ? 'me' : filterValue
          }`;
        }
      }
    });
    console.log(`queryParams: ${queryParams}`);
    return queryParams;
  };

  // TODO: useMyUser() hook
  const userData = { displayName: 'zzadmin' };
  let url = `/dt-posts/v2/${postType}`;
  if (filter) url += mapFilterOnQueryParams(filter, userData);

  // TODO: useSelector for initialData if OFFLINE
  //const initialData = null;

  let { data, error, isLoading, isValidating, mutate } = useResource(url);

  return {
    posts: data?.posts ? mapPosts(data.posts) : null,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useList;
