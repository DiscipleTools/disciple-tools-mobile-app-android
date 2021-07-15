import { useSelector, useDispatch } from 'react-redux';
//import { queueRequest as _queueRequest } from 'store/actions/requests.actions';

const useRequestQueue = () => {
  const pendingRequests = useSelector((state) => state.appReducer.pendingRequests);

  const queueRequest = (request, type) => {
    console.log('*** QUEUE REQUEST ***');
    //dispatch(_queueRequest(request, type));
  };

  return {
    pendingRequests: pendingRequests ? pendingRequests : [],
    queueRequest,
  };
};
export default useRequestQueue;
