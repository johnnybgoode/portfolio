import type {
  FlexProps as FlexStyleProps,
  SizeProps,
  SpaceProps,
  Sprinkles,
} from '../../styles/sprinkles.css';
import { Box, type BoxProps } from './Box';

type FlexProps = Omit<BoxProps<'div'>, keyof Sprinkles> &
  Pick<Sprinkles, FlexStyleProps | SpaceProps | SizeProps>;

export const Flex = ({ as: __as, children, ...rest }: FlexProps) => {
  return (
    <Box as="div" display="flex" {...rest}>
      {children}
    </Box>
  );
};
