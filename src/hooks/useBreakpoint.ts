import { useCallback, useEffect, useState } from 'react';
import { breakpoints } from '../styles/theme.css';
import { objectEntries, throttle } from '../utils';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] =
    useState<keyof typeof breakpoints>('mobile');

  const breakpointEntries = objectEntries(breakpoints);

  const handleResize = useCallback(() => {
    const winWidth = window.innerWidth;
    const currentBreakpoint = breakpointEntries
      .reverse()
      .find(([, value]) => winWidth >= value.width);

    if (currentBreakpoint) {
      setBreakpoint(currentBreakpoint[0]);
    }
  }, [breakpointEntries]);

  useEffect(() => {
    window.addEventListener('resize', throttle(handleResize));
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return breakpoint;
};
