import { dividerVariants } from '../../styles/components/Divider.css';
import type {
  BorderProps,
  SpaceProps,
  Sprinkles,
} from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type DividerProps = BoxElementWithStyles<'div', BorderProps | SpaceProps> & {
  direction?: keyof typeof dividerVariants;
  width?: Sprinkles['borderWidth'];
};

export const Divider = ({
  as: __as,
  direction,
  width,
  ...rest
}: DividerProps) => {
  const borderWidth = width || '50';
  const borderDirection = direction || 'horizontal';
  const borderStyles =
    borderDirection === 'horizontal'
      ? {
          borderBottomWidth: borderWidth,
        }
      : {
          borderLeftWidth: borderWidth,
        };

  return (
    <Box
      as="div"
      className={dividerVariants[borderDirection]}
      {...borderStyles}
      {...rest}
    >
      &nbsp;
    </Box>
  );
};
