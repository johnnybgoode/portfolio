'use client';

import { useBreakpoint } from '../hooks/useBreakpoint';
import { Divider } from './ui/Divider';

export const ResponsiveDivider = () => {
  const breakpoint = useBreakpoint();

  return (
    <Divider
      direction={breakpoint === 'mobile' ? 'horizontal' : 'vertical'}
      marginBlockEnd="300"
      marginBlockStart="350"
      marginX={['0', '400', '400']}
      paddingBlockStart={['300', '0']}
      width="50"
    />
  );
};
