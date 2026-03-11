'use client';

import type { PropsWithChildren } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import { appWrapper } from '../styles/app.css';
import { darkThemeClass, lightThemeClass } from '../styles/theme.css';

export const ThemeWrapper = ({ children }: PropsWithChildren) => {
  const [colorScheme] = useColorScheme();
  const colorSchemeClass =
    colorScheme === 'dark' ? darkThemeClass : lightThemeClass;

  return (
    <div className={[appWrapper, colorSchemeClass].join(' ')}>{children}</div>
  );
};
