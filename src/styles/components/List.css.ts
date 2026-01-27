import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const ListClass = style({
  listStyleType: 'disc',
});

globalStyle(`${ListClass} > li`, {
  marginBlockEnd: vars.space[200],
});

globalStyle(`${ListClass} > li::last-of-type`, {
  marginBlockEnd: vars.space[0],
});

globalStyle(`${ListClass} > li::marker`, {
  fontSize: '10px',
});
