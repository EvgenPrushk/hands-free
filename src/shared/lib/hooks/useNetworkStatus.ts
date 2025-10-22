import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

/**
 * Hook to track network connectivity status
 */
export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(setNetworkState);

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(setNetworkState);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    networkState,
    isConnected: networkState?.isConnected ?? true,
    isInternetReachable: networkState?.isInternetReachable ?? true,
    type: networkState?.type,
    details: networkState?.details,
  };
};