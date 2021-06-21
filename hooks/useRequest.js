import useSWR, { cache } from 'swr';

import axios from 'services/axios';

import useNetworkStatus from 'hooks/useNetworkStatus';

const useRequest = (request, { initialData, ...config } = {}) => {
  const isConnected = useNetworkStatus();

  // TODO: is the [request, id] correct?
  //console.log(`*** REQ: ${JSON.stringify(request)} ***`);

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

  if (!isConnected) {
    // TODO: useSelector
    /*
    if (cache.has(JSON.stringify(request))) {
      console.log("**** USING CACHED DATA ****");
      data = cache.get(JSON.stringify(request));
      error = null;
    }
    */
  }
  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};
export default useRequest;
