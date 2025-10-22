import { QueryClient } from '@tanstack/react-query';
import { storage } from './storage';
import { STORAGE_KEYS } from '../lib/types';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - data is fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time - data is kept in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay function (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus in mobile
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default (can be overridden per query)
      refetchOnReconnect: 'always',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Persist cache to AsyncStorage
export const persistQueryClient = async (): Promise<void> => {
  try {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();

    const persistableQueries = queries
      .filter((query) => {
        // Only persist successful queries that are not stale
        return query.state.status === 'success' && query.isStale() === false;
      })
      .map((query) => ({
        queryKey: query.queryKey,
        queryHash: query.queryHash,
        state: query.state,
      }));

    await storage.setItem(STORAGE_KEYS.CACHE, {
      queries: persistableQueries,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error persisting query cache:', error);
  }
};

// Restore cache from AsyncStorage
export const restoreQueryClient = async (): Promise<void> => {
  try {
    const cachedData = await storage.getItem<{
      queries: any[];
      timestamp: number;
    }>(STORAGE_KEYS.CACHE);

    if (!cachedData) return;

    // Check if cache is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - cachedData.timestamp > maxAge) {
      await storage.removeItem(STORAGE_KEYS.CACHE);
      return;
    }

    // Restore queries to cache
    cachedData.queries.forEach((queryData) => {
      queryClient.setQueryData(queryData.queryKey, queryData.state.data);
    });
  } catch (error) {
    console.error('Error restoring query cache:', error);
  }
};

// Query keys factory for consistent key management
export const queryKeys = {
  // User-related queries
  user: {
    all: ['user'] as const,
    profile: (userId: number) => ['user', 'profile', userId] as const,
    preferences: (userId: number) => ['user', 'preferences', userId] as const,
  },

  // App data queries
  items: {
    all: ['items'] as const,
    list: (filters?: Record<string, any>) => ['items', 'list', filters] as const,
    detail: (id: number) => ['items', 'detail', id] as const,
  },

  // Settings and config
  settings: {
    all: ['settings'] as const,
    app: () => ['settings', 'app'] as const,
    notifications: () => ['settings', 'notifications'] as const,
  },
} as const;