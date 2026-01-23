import { Box, type BoxProps } from './ui/Box';

type MastheadProps = BoxProps<'div'>;
export const Masthead = ({ as: __as, children, ...rest }: MastheadProps) => (
  <Box as="div" {...rest}>
    {children}
  </Box>
);
