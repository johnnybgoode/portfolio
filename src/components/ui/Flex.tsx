import type {
  FlexProps as FlexStyleProps,
  SizeProps,
  SpaceProps,
} from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type FlexProps = BoxElementWithStyles<
  'div',
  FlexStyleProps | SpaceProps | SizeProps
>;

export const Flex = ({ as: __as, children, ...rest }: FlexProps) => {
  return (
    <Box as="div" display="flex" {...rest}>
      {children}
    </Box>
  );
};
