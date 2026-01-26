import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const IconLinkClass = style({
  marginBlockEnd: vars.space[200],
  selectors: {
    '&:last-of-type': {
      marginBlockEnd: vars.space[0],
    },
  },
});
