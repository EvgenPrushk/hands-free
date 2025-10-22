import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';
import { LocationCoordinates, GeolocationError } from '../../entities/shift/model/types';

class GeolocationService {
  async getCurrentPosition(): Promise<LocationCoordinates> {
    // Request permissions first
    const hasPermission = await this.requestLocationPermission();

    if (!hasPermission) {
      throw {
        code: 1,
        message: 'Location permission denied'
      } as GeolocationError;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject({
            code: error.code,
            message: this.getErrorMessage(error.code)
          } as GeolocationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );
    });
  }

  private async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs location access to find work shifts near you.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    }

    // For iOS, permissions are handled in Info.plist and the first call to getCurrentPosition
    return true;
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location permission denied. Please enable location access in app settings.';
      case 2:
        return 'Location unavailable. Please check your device settings.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'Unknown location error occurred.';
    }
  }

  watchPosition(
    onSuccess: (coordinates: LocationCoordinates) => void,
    onError: (error: GeolocationError) => void
  ): number {
    return Geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        onError({
          code: error.code,
          message: this.getErrorMessage(error.code)
        });
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 100, // Update only if moved 100 meters
        interval: 30000, // Update every 30 seconds
        fastestInterval: 10000 // But not faster than 10 seconds
      }
    );
  }

  clearWatch(watchId: number): void {
    Geolocation.clearWatch(watchId);
  }
}

export const geolocationService = new GeolocationService();