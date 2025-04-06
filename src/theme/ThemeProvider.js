import React, {createContext, useContext, useState, useEffect} from 'react';
import {selectCurrentUser} from '../../store/authSlice';
import {useSelector} from 'react-redux';
import {lightTheme, darkTheme} from './theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({children}) => {
  const user = useSelector(selectCurrentUser);
  const [customTheme, setCustomTheme] = useState(() => {
    const userTheme = user?.theme?.lightTheme || lightTheme;
    const isDark = user?.theme?.isDark || false;

    return {
      isDark,
      colors: {
        background: isDark
          ? (user?.theme?.darkTheme || darkTheme).colors.background
          : userTheme.colors.background,
        surface: isDark
          ? (user?.theme?.darkTheme || darkTheme).colors.surface
          : userTheme.colors.surface,
        primary: isDark
          ? (user?.theme?.darkTheme || darkTheme).colors.primary
          : userTheme.colors.primary,
        secondary: isDark
          ? (user?.theme?.darkTheme || darkTheme).colors.secondary
          : userTheme.colors.secondary,
        error: isDark
          ? (user?.theme?.darkTheme || darkTheme).colors.error
          : userTheme.colors.error,
        text: {
          primary: isDark
            ? (user?.theme?.darkTheme || darkTheme).colors.text.primary
            : userTheme.colors.text.primary,
          secondary: isDark
            ? (user?.theme?.darkTheme || darkTheme).colors.text.secondary
            : userTheme.colors.text.secondary,
        },
      },
      fonts: isDark
        ? (user?.theme?.darkTheme || darkTheme).fonts
        : userTheme.fonts,
      font: isDark
        ? (user?.theme?.darkTheme || darkTheme).font
        : userTheme.font,
    };
  });

  // Update theme when user changes
  useEffect(() => {
    if (user?.theme) {
      const userTheme = user.theme.isDark
        ? user.theme.darkTheme || darkTheme
        : user.theme.lightTheme || lightTheme;
      setCustomTheme(prev => ({
        ...prev,
        isDark: user.theme.isDark || false,
        colors: userTheme.colors,
        fonts: userTheme.fonts,
        font: userTheme.font,
      }));
    }
  }, [user]);

  const toggleTheme = () => {
    const userLightTheme = user?.theme?.lightTheme || lightTheme;
    const userDarkTheme = user?.theme?.darkTheme || darkTheme;
    setCustomTheme(
      customTheme.isDark
        ? {isDark: false, ...userLightTheme}
        : {isDark: true, ...userDarkTheme},
    );
  };

  return (
    <ThemeContext.Provider
      value={{...customTheme, setCustomTheme, toggleTheme, customTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
