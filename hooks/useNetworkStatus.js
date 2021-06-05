import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';

const useNetworkStatus = () => {
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected.toString() === 'true';
  // user specified offline in settings
  const isConnectedUser = useSelector((state) => state.networkConnectivityReducer.isConnected);
  return isConnected && isConnectedUser;
};
export default useNetworkStatus;
