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
      lineHeight: 1.1,
      vars: {
        [colorVars.background]: 'white',
        [colorVars.body]: 'black',
        [vars.typography.h1.size]: '2.75rem',
        [vars.typography.h2.size]: '1.8rem',
        [vars.typography.h3.size]: '1.4rem',
        [vars.typography.h4.size]: '1.2rem',
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
      fontSize: '12px',
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
