import { style } from '@vanilla-extract/css';

export const headerClass = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

export const landingPageClass = style({
  display: 'flex',
  height: '100vh',
  placeItems: 'center',
});
