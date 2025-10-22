import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '~/shared/api';
import { STORAGE_KEYS } from '~/shared/lib/types';
import {
  ThemeState,
  THEME_COLORS,
  THEME_SPACING,
  THEME_BORDER_RADIUS,
  THEME_TYPOGRAPHY
} from './types';

// Action types
type ThemeAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_SYSTEM_THEME'; payload: 'light' | 'dark' }
  | { type: 'LOAD_THEME_FROM_STORAGE'; payload: 'light' | 'dark' | 'system' };

// Initial state
const initialState: ThemeState = {
  theme: 'light',
  userPreference: 'system',
  isLoading: true,
};

// Theme reducer
function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload, isLoading: false };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    case 'SET_SYSTEM_THEME':
      return { ...state, theme: action.payload, isLoading: false };

    case 'LOAD_THEME_FROM_STORAGE':
      // If system theme, use the current system preference
      if (action.payload === 'system') {
        return state; // Keep current theme, will be updated by system
      }
      return { ...state, theme: action.payload as 'light' | 'dark', isLoading: false };

    default:
      return state;
  }
}

// Context type
interface ThemeContextType extends ThemeState {
  colors: typeof THEME_COLORS.light | typeof THEME_COLORS.dark;
  spacing: typeof THEME_SPACING;
  borderRadius: typeof THEME_BORDER_RADIUS;
  typography: typeof THEME_TYPOGRAPHY;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  toggleTheme: () => Promise<void>;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme Provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const systemColorScheme = useColorScheme();
  const [userThemePreference, setUserThemePreference] = React.useState<'light' | 'dark' | 'system'>('system');

  // Load theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen to system theme changes
  useEffect(() => {
    if (userThemePreference === 'system' && systemColorScheme && systemColorScheme !== 'unspecified') {
      dispatch({ type: 'SET_SYSTEM_THEME', payload: systemColorScheme });
    }
  }, [systemColorScheme, userThemePreference]);

  // Load theme preference from storage
  const loadThemePreference = async (): Promise<void> => {
    try {
      const storedTheme = await storage.getItem<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME);

      if (storedTheme) {
        setUserThemePreference(storedTheme);

        if (storedTheme === 'system') {
          const currentSystemTheme = (systemColorScheme && systemColorScheme !== 'unspecified') ? systemColorScheme : 'light';
          dispatch({ type: 'SET_SYSTEM_THEME', payload: currentSystemTheme });
        } else {
          dispatch({ type: 'LOAD_THEME_FROM_STORAGE', payload: storedTheme });
        }
      } else {
        // Default to system theme
        const currentSystemTheme = (systemColorScheme && systemColorScheme !== 'unspecified') ? systemColorScheme : 'light';
        dispatch({ type: 'SET_SYSTEM_THEME', payload: currentSystemTheme });
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      // Fallback to system theme
      const currentSystemTheme = (systemColorScheme && systemColorScheme !== 'unspecified') ? systemColorScheme : 'light';
      dispatch({ type: 'SET_SYSTEM_THEME', payload: currentSystemTheme });
    }
  };

  // Set theme function
  const setTheme = async (theme: 'light' | 'dark' | 'system'): Promise<void> => {
    try {
      setUserThemePreference(theme);

      // Store preference
      await storage.setItem(STORAGE_KEYS.THEME, theme);

      if (theme === 'system') {
        const currentSystemTheme = (systemColorScheme && systemColorScheme !== 'unspecified') ? systemColorScheme : 'light';
        dispatch({ type: 'SET_SYSTEM_THEME', payload: currentSystemTheme });
      } else {
        dispatch({ type: 'SET_THEME', payload: theme });
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  // Toggle theme function (between light and dark)
  const toggleTheme = async (): Promise<void> => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  // Get current colors based on theme
  const colors = THEME_COLORS[state.theme];

  const value: ThemeContextType = {
    ...state,
    colors,
    spacing: THEME_SPACING,
    borderRadius: THEME_BORDER_RADIUS,
    typography: THEME_TYPOGRAPHY,
    setTheme,
    toggleTheme,
    userPreference: userThemePreference,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};