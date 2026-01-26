import { DividerClasses } from '../../styles/components/Divider.css';
import type { BorderProps, SpaceProps } from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type DividerProps = BoxElementWithStyles<'div', BorderProps | SpaceProps> & {
  direction?: keyof typeof DividerClasses;
};

export const Divider = ({
  as: __as,
  borderWidth,
  direction,
  ...rest
}: DividerProps) => {
  const borderBottomWidth = borderWidth || '50';
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
