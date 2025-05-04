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
    const theme = isDark ? darkTheme : lightTheme;

    return {
      isDark,
      colors: theme.colors,
      fonts: theme.fonts,
      font: 'PoppinsRegular400',
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
        font: 'PoppinsRegular400',
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
