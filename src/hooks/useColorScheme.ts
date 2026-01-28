import { useContext } from 'react';
import { themeContext } from '../context/themeContext';

export const useColorScheme = () => {
  const contextValue = useContext(themeContext);
  if (!contextValue) {
    throw new Error('useColorScheme called outside ThemeContext.');
  }

  return [contextValue.colorScheme, contextValue.setColorScheme] as const;
};
