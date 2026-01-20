import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { space } from './utils';

export const headingStyle1 = style({
  fontSize: vars.typography.h1.size,
  lineHeight: '1.1',
  letterSpacing: '0.125em',
  ...space('margin', '0.5em 0'),
});

export const headingStyle2 = style({
  fontSize: vars.typography.h2.size,
  lineHeight: '1.1',
  letterSpacing: '0.125em',
  ...space('margin', '0.4em 0'),
});

export const headingStyle3 = style({
  fontSize: vars.typography.h3.size,
  lineHeight: '1.1',
  letterSpacing: '0.125em',
  ...space('margin', '0.3em 0'),
});

export const paragraphStyle = style({
  letterSpacing: '0.125em',
});

export const linkStyle = style({
  fontWeight: 400,
  textDecoration: 'inherit',
  color: vars.color.foam,
  ':hover': {
    textDecoration: 'underline',
  },
});
