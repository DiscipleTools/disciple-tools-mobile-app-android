import useSWR, { cache } from 'swr';

import axios from 'services/axios';

import useNetworkStatus from 'hooks/useNetworkStatus';
import useRequestQueue from 'hooks/useRequestQueue';

const useResource = (request, { initialData, ...config } = {}) => {
  const isConnected = useNetworkStatus();
  const { pendingRequests, queueRequest } = useRequestQueue();

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

  // TODO: move this to useNetworkStatus where we can immediately detect when back online?
  if (!isConnected && pendingRequests.length > 0) {
    pendingRequests.forEach((pendingRequest) => {
      write(pendingRequest);
    });
  }

  const write = async (request) => {
    console.log(`^^^^ WRITE! ${JSON.stringify(request)}`);
    if (!isConnected) {
      queueRequest(request);
    } else {
      return axios(request);
    }
  };

  /*
  const create = async (request) => {
    console.log(`^^^^ CREATE! ${JSON.stringify(request)}`);
    if (!isConnected) {
      queueRequest(request, "create");
    } else {
      return axios(request);
    };
  };

  const update = async (request) => {
    console.log(`^^^^ UPDATE! ${JSON.stringify(request)}`);
    //axios.put?
    if (!isConnected) {
      queueRequest(request, "update");
    } else {
      return axios(request);
    };
  };

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
    write,
    //create,
    //update,
    //delet,
  };
};
export default useResource;
