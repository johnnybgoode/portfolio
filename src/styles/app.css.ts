import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { space } from './utils';

export const AppClass = style({
  display: 'flex',
  placeItems: 'center',
  minWidth: '320px',
  minHeight: '100vh',
  margin: 0,
  width: '100%',
});

globalStyle(':root', {
  fontFamily: vars.typography.font.body,
  fontSize: vars.typography.size[100],
  fontWeight: vars.typography.weight[400],

  color: vars.color.sand,
  backgroundColor: vars.color.dusk,
});

globalStyle('#root', {
  ...space('padding', '2rem'),
  ...space('margin', '0 auto'),
  maxWidth: '1280px',
  width: '100%',
});

globalStyle('a', {
  fontWeight: 500,
  textDecoration: 'inherit',
  color: vars.color.foam,
});

globalStyle('a:hover', {
  textDecoration: 'underline',
});
