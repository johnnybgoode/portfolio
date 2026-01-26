import { srOnlyClass } from '../../styles/common.css';
import { icons } from '../../styles/icons.css';
import type {
  ColorProps,
  SizeProps,
  SpaceProps,
  Sprinkles,
  TypeProps,
} from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type IconProps = {
  name: keyof typeof icons;
  size?: Sprinkles['fontSize'];
} & BoxElementWithStyles<'i', ColorProps | SizeProps | SpaceProps | TypeProps>;

export const Icon = ({ as: _as, name, size, ...rest }: IconProps) => {
  return (
    <Box as="i" className={icons[name]} fontSize={size} {...rest}>
      <span className={srOnlyClass}>{`${name}-icon`}</span>
    </Box>
  );
};
