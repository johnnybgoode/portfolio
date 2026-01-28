import { style, styleVariants } from '@vanilla-extract/css';
import { colorVars } from '../theme.css';

const base = style({
  borderColor: colorVars.body,
  flexShrink: 1,
  opacity: '0.5',
});

export const dividerVariants = styleVariants({
  horizontal: [
    base,
    {
      borderBottomStyle: 'solid',
      display: 'block',
      height: 0,
      width: '100%',
    },
  ],
  vertical: [
    base,
    {
      borderLeftStyle: 'solid',
      display: 'inline-block',
      minHeight: '1em',
      width: '1px',
    },
  ],
});
