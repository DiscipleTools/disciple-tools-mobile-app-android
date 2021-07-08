import useSWR, { cache } from 'swr';

import axios from 'services/axios';

import useNetworkStatus from 'hooks/useNetworkStatus';

const useResource = (request, { initialData, ...config } = {}) => {
  const isConnected = useNetworkStatus();

  // TODO: is the [request, id] correct?

  let { data, error, isLoading, isValidating, mutate } = useSWR(
    isConnected ? request && JSON.stringify(request) : null,
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
  if (!isConnected) {
    // TODO: useSelector
    if (cache.has(JSON.stringify(request))) {
      console.log("**** USING CACHED DATA ****");
      data = cache.get(JSON.stringify(request));
      error = null;
    }
  }
  */

  const create = async (request) => {
    console.log(`^^^^ CREATE! ${JSON.stringify(request)}`);
    //if (!isConnected) dispatch(request);
    return axios(request);
  };

  const update = async (request) => {
    console.log(`^^^^ UPDATE! ${JSON.stringify(request)}`);
    //axios.put?
    //if (!isConnected) dispatch(request);
    return axios(request);
  };

  /*
  const delet = async(request) => {
    //if (!isConnected) dispatch(request);
    return axios.delete(request);
  };
  */

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    create,
    update,
    //delet,
  };
};
export default useResource;
