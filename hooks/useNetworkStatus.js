//import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';

const useNetworkStatus = () => {
  // TODO: useNetInfo() causes flickering re-render
  //const netInfo = useNetInfo();
  //const isConnected = netInfo.isConnected.toString() === 'true';
  const isConnected = true;
  // user specified offline in settings
  const isConnectedUser = useSelector((state) => state.networkConnectivityReducer.isConnected);
  return isConnected && isConnectedUser;
};
export default useNetworkStatus;
