import { type PropsWithChildren, useState } from 'react';
import { type ThemeContext, themeContext } from '../context/themeContext';

export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
  const [colorScheme, setColorScheme] =
    useState<ThemeContext['colorScheme']>('dark');

  return (
    <themeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </themeContext.Provider>
  );
};
