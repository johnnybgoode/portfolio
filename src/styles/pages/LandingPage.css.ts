import { style } from '@vanilla-extract/css';

export const headerClass = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export const landingPageClass = style({
  height: '100vh',
  maxWidth: '1280px',
  margin: '0 auto',
});
