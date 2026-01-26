import { DividerClasses } from '../../styles/components/Divider.css';
import type {
  BorderProps,
  SpaceProps,
  Sprinkles,
} from '../../styles/sprinkles.css';
import { Box, type BoxProps } from './Box';

type DividerProps = Omit<BoxProps<'div'>, keyof Sprinkles> &
  Pick<Sprinkles, BorderProps | SpaceProps> & {
    direction?: keyof typeof DividerClasses;
  };

export const Divider = ({
  as: __as,
  borderWidth,
  direction,
  ...rest
}: DividerProps) => {
  const borderBottomWidth = borderWidth || '100';
  const borderDirection = direction || 'horizontal';

  return (
    <Box
      as="div"
      borderBottomWidth={borderBottomWidth}
      className={DividerClasses[borderDirection]}
      {...rest}
    >
      &nbsp;
    </Box>
  );
};
