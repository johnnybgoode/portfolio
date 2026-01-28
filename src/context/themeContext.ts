import { createContext } from 'react';

export type ThemeContext = {
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
};
export const themeContext = createContext<ThemeContext>({} as ThemeContext);
