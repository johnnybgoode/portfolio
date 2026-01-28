import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, colorVars, vars } from './theme.css';

export const appWrapper = style({
  // placeItems: 'center',
  minWidth: '320px',
  minHeight: '100vh',
  width: '100%',
  color: colorVars.body,
  backgroundColor: colorVars.background,
});

globalStyle(':root', {
  fontFamily: vars.typography.font.body,
  fontSize: breakpoints.mobile.fontSize,
  fontWeight: vars.typography.weight[300],

  '@media': {
    [breakpoints.tablet.mediaQuery]: {
      fontSize: breakpoints.tablet.fontSize,
    },
  },
});

globalStyle('a', {
  fontWeight: vars.typography.weight[400],
  textDecoration: 'inherit',
  color: colorVars.body,
});

globalStyle('a:hover', {
  color: colorVars.primary,
});
