import { makeAutoObservable, runInAction } from 'mobx';
import { Shift, LocationCoordinates, ShiftFilterParams, GeolocationError } from './types';
import { geolocationService } from '../../../shared/services/geolocation';

export class ShiftStore {
  shifts: Shift[] = [];
  selectedShift: Shift | null = null;
  isLoading = false;
  isLocationLoading = false;
  error: string | null = null;
  locationError: GeolocationError | null = null;
  userLocation: LocationCoordinates | null = null;
  hasLocationPermission = false;

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

  // Actions for geolocation
  async requestLocation() {
    this.setLocationLoading(true);
    this.setLocationError(null);

    try {
      const location = await geolocationService.getCurrentPosition();
      runInAction(() => {
        this.userLocation = location;
        this.hasLocationPermission = true;
      });

      // Automatically load shifts once we have location
      if (location) {
        await this.loadShifts({
          latitude: location.latitude,
          longitude: location.longitude
        });
      }
    } catch (error) {
      runInAction(() => {
        if (error && typeof error === 'object' && 'code' in error) {
          this.setLocationError(error as GeolocationError);
        } else {
          this.setLocationError({
            code: -1,
            message: error instanceof Error ? error.message : 'Unknown location error'
          });
        }
      });
    } finally {
      runInAction(() => {
        this.setLocationLoading(false);
      });
    }
  }

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

  setLocationLoading(loading: boolean) {
    this.isLocationLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setLocationError(error: GeolocationError | null) {
    this.locationError = error;
  }

  // Computed values
  get hasShifts() {
    return this.shifts.length > 0;
  }

  get isLocationAvailable() {
    return this.userLocation !== null && this.hasLocationPermission;
  }

  get shouldShowLocationPrompt() {
    return !this.hasLocationPermission && !this.isLocationLoading && !this.locationError;
  }

  // Reset store
  reset() {
    this.shifts = [];
    this.selectedShift = null;
    this.isLoading = false;
    this.isLocationLoading = false;
    this.error = null;
    this.locationError = null;
    this.userLocation = null;
    this.hasLocationPermission = false;
  }
}

export const shiftStore = new ShiftStore();