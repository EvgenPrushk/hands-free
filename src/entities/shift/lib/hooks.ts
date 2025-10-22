import { observer } from 'mobx-react-lite';
import { shiftStore } from '../model/store';

export const useShiftStore = () => {
  return shiftStore;
};

export const useShifts = () => {
  const store = useShiftStore();

  return {
    shifts: store.shifts,
    isLoading: store.isLoading,
    error: store.error,
    hasShifts: store.hasShifts,
    loadShifts: store.loadShifts.bind(store),
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