import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { storage } from '~/shared/api';
import { AuthState, User, STORAGE_KEYS } from '~/shared/lib/types';

// Action types
type AuthAction =
  | { type: 'LOADING_START' }
  | { type: 'LOADING_END' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading to check persisted auth
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, isLoading: true, error: null };

    case 'LOADING_END':
      return { ...state, isLoading: false };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// Context type
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check auth status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated (from storage)
  const checkAuthStatus = async (): Promise<void> => {
    try {
      dispatch({ type: 'LOADING_START' });

      const [storedUser, storedToken] = await Promise.all([
        storage.getItem<User>(STORAGE_KEYS.USER),
        storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN),
      ]);

      if (storedUser && storedToken) {
        // Validate token here (API call)
        // For now, just trust stored data
        dispatch({ type: 'LOGIN_SUCCESS', payload: storedUser });
      } else {
        dispatch({ type: 'LOADING_END' });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: 'LOADING_END' });
    }
  };

  // Login function
  const login = async (email: string, _password: string): Promise<void> => {
    try {
      dispatch({ type: 'LOADING_START' });

      // Simulate API call
      // In real app, replace with actual API call
      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: email,
        avatar: 'https://via.placeholder.com/100',
        preferences: {
          theme: 'system',
          language: 'en',
          notifications: true,
        },
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Store user data and token
      await Promise.all([
        storage.setItem(STORAGE_KEYS.USER, mockUser),
        storage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken),
      ]);

      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'LOADING_START' });

      // Clear stored data
      await Promise.all([
        storage.removeItem(STORAGE_KEYS.USER),
        storage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      ]);

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still logout locally even if storage fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!state.user) return;

      const updatedUser = { ...state.user, ...userData };

      // Store updated user data
      await storage.setItem(STORAGE_KEYS.USER, updatedUser);

      dispatch({ type: 'UPDATE_USER', payload: userData });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};