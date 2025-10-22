// Shared types for the entire application

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ru';
  notifications: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  userPreference: 'light' | 'dark' | 'system';
  isLoading: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number };
  Profile: undefined;
  Settings: undefined;
};

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Storage keys
export const STORAGE_KEYS = {
  USER: '@hands_free/user',
  AUTH_TOKEN: '@hands_free/auth_token',
  THEME: '@hands_free/theme',
  PREFERENCES: '@hands_free/preferences',
  CACHE: '@hands_free/cache',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];