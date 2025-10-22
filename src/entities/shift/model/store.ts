import { makeAutoObservable, runInAction } from 'mobx';
import { Shift, ShiftFilterParams } from './types';

export class ShiftStore {
  shifts: Shift[] = [];
  selectedShift: Shift | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Actions for loading shifts
  async loadShifts(params: ShiftFilterParams) {
    this.setLoading(true);
    this.setError(null);

    try {
      const { shiftApi } = await import('../api/shift-api');
      const response = await shiftApi.fetchShifts(params);
      runInAction(() => {
        this.shifts = response.shifts;
      });
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Failed to load shifts');
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  // Geolocation is now managed by GeolocationProvider

  // Actions for shift selection
  selectShift(shift: Shift) {
    this.selectedShift = shift;
  }

  clearSelectedShift() {
    this.selectedShift = null;
  }

  // Helper actions
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // Computed values
  get hasShifts() {
    return this.shifts.length > 0;
  }

  // Reset store
  reset() {
    this.shifts = [];
    this.selectedShift = null;
    this.isLoading = false;
    this.error = null;
  }
}

export const shiftStore = new ShiftStore();