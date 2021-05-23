import useSWR, { cache } from 'swr';
import axios from 'services/axios';

const useRequest = (request, { initialData, ...config } = {}) => {
  // TODO: is the [request, id] correct?
  console.log(`*** REQ: ${JSON.stringify(request)} ***`);
  return useSWR(
    request && JSON.stringify(request),
    () => axios(request || {}).then((response) => response.data),
    {
      ...config,
      initialData: initialData && {
        status: 200,
        statusText: 'InitialData',
        headers: {},
        data: initialData,
      },
    },
  );
  /*
  axios(request).then(res => {
    console.log("*** AXIOS RES ***");
    console.log(res);
  }).catch(err => {
    console.log("*** AXIOS ERR ***");
    console.log(err);
  });
  return {
    data: { posts: [] },
    error: null 
  }
*/
};
export default useRequest;
