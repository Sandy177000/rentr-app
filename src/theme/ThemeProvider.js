import React, {createContext, useContext, useState} from 'react';
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
  const userTheme = user?.theme?.lightTheme || lightTheme;
  const [customTheme, setCustomTheme] = useState({
    isDark: false,
    colors: {
      background: userTheme.colors.background,
      surface: userTheme.colors.surface,
      primary: userTheme.colors.primary,
      secondary: userTheme.colors.secondary,
      error: userTheme.colors.error,
      text: {
        primary: userTheme.colors.text.primary,
        secondary: userTheme.colors.text.secondary,
      },
    },
    fonts: userTheme.fonts,
    font: userTheme.font || 'Roboto-Regular',
  });
  console.log(user);
  const toggleTheme = () => {
    console.log("Changing theme to", customTheme.isDark);
    
    setCustomTheme(
      customTheme.isDark
        ? {isDark: false, ...userTheme.lightTheme || lightTheme}
        : {isDark: true, ...userTheme.darkTheme || darkTheme},
    );
  };

  return (
    <ThemeContext.Provider
      value={{ ...customTheme, setCustomTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
