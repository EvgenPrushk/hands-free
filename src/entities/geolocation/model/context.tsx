import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { geolocationService } from '~/shared/services/geolocation';
import { LocationCoordinates, GeolocationError } from '~/entities/shift/model/types';

interface GeolocationContextType {
  location: LocationCoordinates | null;
  isLoading: boolean;
  error: GeolocationError | null;
  hasPermission: boolean;
  requestLocation: () => Promise<void>;
  retry: () => Promise<void>;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

interface GeolocationProviderProps {
  children: ReactNode;
}

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  const openDeviceSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Location Settings',
        'Please go to Settings > Privacy & Security > Location Services and enable location access for this app.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Location Settings',
        'Please go to Settings > Apps > Hands Free > Permissions and enable Location access.',
        [{ text: 'OK' }]
      );
    }
  }, []);

  const requestLocation = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await geolocationService.getCurrentPosition();
      setLocation(coordinates);
      setHasPermission(true);
      setError(null);
    } catch (err) {
      const geolocationError = err as GeolocationError;
      setError(geolocationError);
      setHasPermission(false);

      // Show user-friendly error dialog immediately
      let title = 'Location Access Required';
      let message = '';
      let showSettings = false;

      switch (geolocationError.code) {
        case 1: // Permission denied
          message = 'This app needs location access to find work shifts near you. Please enable location permissions in your device settings.';
          showSettings = true;
          break;
        case 2: // Position unavailable
          message = 'Unable to determine your location. Please check your device settings and try again.';
          break;
        case 3: // Timeout
          message = 'Location request timed out. Please try again.';
          break;
        default:
          message = 'Unable to access your location. Please try again or check your device settings.';
      }

      const buttons = [
        {
          text: 'Cancel',
          style: 'cancel' as const,
        },
        {
          text: showSettings ? 'Open Settings' : 'Retry',
          onPress: showSettings ? openDeviceSettings : () => {
            // Retry after a small delay to avoid infinite loops
            setTimeout(requestLocation, 100);
          },
        },
      ];

      Alert.alert(title, message, buttons);
    } finally {
      setIsLoading(false);
    }
  }, [openDeviceSettings]);


  const retry = async (): Promise<void> => {
    await requestLocation();
  };

  // Request location permission on app startup
  useEffect(() => {
    if (!hasPrompted) {
      setHasPrompted(true);

      // Show initial explanation dialog
      Alert.alert(
        'Welcome to Hands Free!',
        'To show you available work shifts near your location, we need access to your current position. This helps us find the most relevant opportunities for you.',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => {
              setError({
                code: 1,
                message: 'Location access is required to find shifts near you.'
              });
            }
          },
          {
            text: 'Enable Location',
            onPress: requestLocation,
          },
        ]
      );
    }
  }, [hasPrompted, requestLocation]);

  const contextValue: GeolocationContextType = {
    location,
    isLoading,
    error,
    hasPermission,
    requestLocation,
    retry,
  };

  return (
    <GeolocationContext.Provider value={contextValue}>
      {children}
    </GeolocationContext.Provider>
  );
};

export const useGeolocation = (): GeolocationContextType => {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
};