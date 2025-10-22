import React, { ReactNode, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, restoreQueryClient, persistQueryClient } from '~/shared/api';
import { AuthProvider } from '~/features/auth';
import { ThemeProvider } from '~/entities/theme';
import { GeolocationProvider } from '~/entities/geolocation';
import { ErrorBoundary } from '~/shared/ui';
import { useAppState } from '~/shared/lib/hooks';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Component to handle app state changes and persist query cache
 */
const AppStateHandler: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { appState } = useAppState();

  useEffect(() => {
    // Restore query cache when app becomes active
    if (appState === 'active') {
      restoreQueryClient();
    }

    // Persist query cache when app goes to background
    if (appState === 'background') {
      persistQueryClient();
    }
  }, [appState]);

  return <>{children}</>;
};

/**
 * Root providers component that wraps the entire app
 * Sets up all necessary contexts and providers
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('App-level error:', error, errorInfo);
        // In production, log to crash reporting service
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <GeolocationProvider>
              <AppStateHandler>
                {children}
              </AppStateHandler>
            </GeolocationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};