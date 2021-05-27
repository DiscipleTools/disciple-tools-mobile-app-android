import React, { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(false);

  const online = () => {
    setStatus(true);
  };
  const offline = () => {
    setStatus(false);
  };

  useEffect(() => {
    // TODO: implement for React Native
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
    //}, [setIsOnline]);
  }, []);
  return isOnline;
};
export default useNetworkStatus;
