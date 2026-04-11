import { style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: vars.space['600'],
  paddingBlock: vars.space['500'],
  borderBottom: `1px solid ${colorVars.body}1a`,
});

export const navLogo = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  fontWeight: vars.typography.weight['500'],
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: colorVars.body,
  textDecoration: 'none',
  opacity: 0.9,
});

export const navLinks = style({
  display: 'flex',
  gap: vars.space['600'],
  listStyle: 'none',
});

export const navLink = style({
  fontFamily: vars.typography.font.heading,
  fontSize: vars.typography.size['50'],
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: colorVars.body,
  opacity: 0.45,
  textDecoration: 'none',
  transition: 'opacity 0.15s',
  selectors: {
    '&:hover': { opacity: 0.9 },
  },
});
