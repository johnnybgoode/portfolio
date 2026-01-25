import { srOnlyClass } from '../../styles/common.css';
import { icons } from '../../styles/icons.css';
import {
  type ColorProps,
  type SizeProps,
  type SpaceProps,
  type Sprinkles,
  type TypeProps,
} from '../../styles/sprinkles.css';
import { Box, type BoxProps } from './Box';

type IconStyleProps = Pick<
  Sprinkles,
  ColorProps | SizeProps | SpaceProps | TypeProps
>;

type IconProps = {
  name: keyof typeof icons;
  size?: Sprinkles['fontSize'];
} & IconStyleProps &
  Omit<BoxProps<'i'>, keyof Sprinkles>;

export const Icon = ({ name, size, ...rest }: IconProps) => {
  return (
    <Box as="i" className={icons[name]} fontSize={size} {...rest}>
      <span className={srOnlyClass}>{`${name}-icon`}</span>
    </Box>
  );
};
