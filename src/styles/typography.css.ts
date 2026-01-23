import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { space } from './utils';

const h1Class = style({
  fontSize: vars.typography.h1.size,
  lineHeight: '1.1',
  letterSpacing: '0.125em',
  ...space('margin', '0.5em 0'),
});

const h2Class = style({
  fontSize: vars.typography.h2.size,
  lineHeight: '1.1',
  letterSpacing: '0.125em',
  ...space('margin', '0.4em 0'),
});

const h3Class = style({
  fontSize: vars.typography.h3.size,
  lineHeight: '1.1',
  letterSpacing: '0.125em',
  ...space('margin', '0.3em 0'),
});

const h4Class = style({
  fontSize: vars.typography.h4.size,
  letterSpacing: '0.125em',
  ...space('margin', '0.2em 0'),
});

const h5Class = style({
  fontSize: vars.typography.h5.size,
  letterSpacing: '0.125em',
  ...space('margin', '0.1em 0'),
});

export const headingClasses = {
  h1Class,
  h2Class,
  h3Class,
  h4Class,
  h5Class,
} as const;

export const paragraphClass = style({
  letterSpacing: '0.125em',
});

export const linkClass = style({
  fontWeight: 400,
  textDecoration: 'inherit',
  color: vars.color.foam,
  ':hover': {
    textDecoration: 'underline',
  },
});
