import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { space } from './utils';

export const titleClass = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.title.size,
  fontWeight: vars.typography.h1.weight,
  lineHeight: vars.typography.title.lineHeight,
  ...space('margin', '0.5em 0'),
});

const h1Class = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.h1.size,
  fontWeight: vars.typography.h1.weight,
  lineHeight: vars.typography.h1.lineHeight,
  ...space('margin', '0.5em 0'),
});

const h2Class = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.h2.size,
  fontWeight: vars.typography.h2.weight,
  lineHeight: vars.typography.h2.lineHeight,
  ...space('margin', '0.5em 0'),
});

const h3Class = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.h3.size,
  fontWeight: vars.typography.h3.weight,
  lineHeight: vars.typography.h3.lineHeight,
  ...space('margin', '0.5em 0'),
});

const h4Class = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.h4.size,
  fontWeight: vars.typography.h4.weight,
  lineHeight: vars.typography.h4.lineHeight,
  ...space('margin', '0.5em 0'),
});

const h5Class = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.h5.size,
  fontWeight: vars.typography.h5.weight,
  lineHeight: vars.typography.h5.lineHeight,
  ...space('margin', '0.5em 0'),
});

export const headingClasses = {
  title: titleClass,
  h1: h1Class,
  h2: h2Class,
  h3: h3Class,
  h4: h4Class,
  h5: h5Class,
} as const;

export const paragraphClass = style({
  fontFamily: vars.typography.font.body,
  fontSize: vars.typography.size[200],
});

export const linkClass = style({
  fontWeight: vars.typography.weight[400],
  textDecoration: 'inherit',
  color: vars.color.foam,
  ':hover': {
    textDecoration: 'underline',
  },
});
