import { globalStyle, style } from '@vanilla-extract/css';
import { breakpoints, colorVars, vars } from './theme.css';

export const appWrapper = style({
  minWidth: '320px',
  minHeight: '100vh',
  width: '100%',
  color: colorVars.body,
  backgroundColor: colorVars.background,
  lineHeight: 1.5,
  '@media': {
    print: {
      background: 'white',
      color: 'black',
      lineHeight: 1.2,
      vars: {
        [colorVars.background]: 'white',
        [colorVars.body]: 'black',
        [vars.typography.h1.size]: '3rem',
        [vars.typography.h2.size]: '2rem',
        [vars.typography.h3.size]: '1.45rem',
      },
    },
  },
});

globalStyle(':root', {
  fontFamily: vars.typography.font.body,
  fontSize: breakpoints.mobile.fontSize,
  fontWeight: vars.typography.weight[300],

  '@media': {
    [breakpoints.tablet.mediaQuery]: {
      fontSize: breakpoints.tablet.fontSize,
    },
    print: {
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
