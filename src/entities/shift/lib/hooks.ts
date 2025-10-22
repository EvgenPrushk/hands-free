import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { shiftStore } from '../model/store';

export const useShiftStore = () => {
  return shiftStore;
};

export const useShifts = () => {
  const store = useShiftStore();

  useEffect(() => {
    // Auto-request location on first mount if not already available
    if (store.shouldShowLocationPrompt) {
      store.requestLocation();
    }
  }, [store]);

  return {
    shifts: store.shifts,
    isLoading: store.isLoading,
    isLocationLoading: store.isLocationLoading,
    error: store.error,
    locationError: store.locationError,
    hasShifts: store.hasShifts,
    isLocationAvailable: store.isLocationAvailable,
    shouldShowLocationPrompt: store.shouldShowLocationPrompt,
    userLocation: store.userLocation,
    loadShifts: store.loadShifts.bind(store),
    requestLocation: store.requestLocation.bind(store),
    selectShift: store.selectShift.bind(store),
    reset: store.reset.bind(store),
  };
};

export const useSelectedShift = () => {
  const store = useShiftStore();

  return {
    selectedShift: store.selectedShift,
    selectShift: store.selectShift.bind(store),
    clearSelectedShift: store.clearSelectedShift.bind(store),
  };
};

// HOC for automatically observing MobX store changes
export const withShiftObserver = <P extends object>(Component: React.FunctionComponent<P>) => {
  return observer(Component);
};