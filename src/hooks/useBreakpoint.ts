import { useCallback, useEffect, useState } from 'react';
import { breakpoints } from '../styles/theme.css';
import { objectEntries, throttle } from '../utils';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] =
    useState<keyof typeof breakpoints>('mobile');

  const handleResize = useCallback(() => {
    const currentBreakpoint = objectEntries(breakpoints)
      .reverse()
      .find(([, value]) => window.innerWidth >= value.width);

    if (currentBreakpoint) {
      setBreakpoint(currentBreakpoint[0]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', throttle(handleResize));
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return breakpoint;
};
