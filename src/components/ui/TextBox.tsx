import type {
  ColorProps,
  Sprinkles,
  TypeProps,
} from '../../styles/sprinkles.css';
import { Box, type BoxProps } from './Box';

type AllowedTags = 'div' | 'p' | 'span';
type TextProps<T extends AllowedTags> = Pick<
  Sprinkles,
  ColorProps | TypeProps
> &
  Omit<BoxProps<T>, 'as'> &
  Omit<BoxProps<T>, keyof Sprinkles>;

export const TextBox = <T extends AllowedTags>({
  as,
  children,
  ...rest
}: TextProps<T>) => {
  return (
    <Box as={as} {...rest}>
      {children}
    </Box>
  );
};
