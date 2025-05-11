import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lightTheme, darkTheme } from './theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme structure interfaces
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  white: string;
  black: string;
  text: {
    primary: string;
    secondary: string;
  };
}

interface ThemeState {
  isDark: boolean;
  colors: ThemeColors;
}

// Define context interface with both state and methods
interface ThemeContextType extends ThemeState {
  toggleTheme: () => Promise<void>;
  updateThemeColor: (path: string, value: string) => void;
  resetTheme: () => Promise<void>;
}

// Create context with appropriate type
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define props interface for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme hook for easy access in components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme state with proper type
  const [theme, setTheme] = useState<ThemeState>({
    isDark: false,
    colors: lightTheme.colors,
  });

  // Load saved theme preference on startup
  useEffect(() => {
    const loadTheme = async (): Promise<void> => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          const { isDark } = JSON.parse(savedTheme);
          setTheme(prev => ({
            ...prev,
            isDark,
            colors: isDark ? darkTheme.colors : lightTheme.colors,
          }));
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = async (): Promise<void> => {
    const newIsDark = !theme.isDark;
    const newTheme: ThemeState = {
      isDark: newIsDark,
      colors: newIsDark ? darkTheme.colors : lightTheme.colors,
    };
    
    setTheme(newTheme);
    
    // Save theme preference
    try {
      await AsyncStorage.setItem('themePreference', JSON.stringify({
        isDark: newIsDark
      }));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  // Context value with theme state and functions
  const contextValue: ThemeContextType = {
    ...theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}; 