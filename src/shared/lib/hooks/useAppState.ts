import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/**
 * Hook to track app state (active, background, inactive)
 */
export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: typeof AppState.currentState) => {
      setAppState(nextAppState);
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    appState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
    isInactive: appState === 'inactive',
  };
};