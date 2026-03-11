import type {
  FlexProps as FlexStyleProps,
  SizeProps,
  SpaceProps,
} from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type FlexProps = BoxElementWithStyles<
  'div',
  FlexStyleProps | SpaceProps | SizeProps
> & {
  display?: 'flex' | 'inline-flex';
};

export const Flex = ({ as: __as, children, display, ...rest }: FlexProps) => {
  const flexDisplay = display || 'flex';
  return (
    <Box as="div" display={flexDisplay} {...rest}>
      {children}
    </Box>
  );
};
