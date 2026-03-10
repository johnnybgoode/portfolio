import type { ColorProps, TypeProps } from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type AllowedTags = 'aside' | 'div' | 'p' | 'span';
type TextProps<T extends AllowedTags> = BoxElementWithStyles<
  T,
  ColorProps | TypeProps
>;

export const TextBox = <T extends AllowedTags>({
  children,
  ...rest
}: TextProps<T>) => {
  return <Box {...rest}>{children}</Box>;
};
