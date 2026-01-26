import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const AppClass = style({
  placeItems: 'center',
  minWidth: '320px',
  minHeight: '100vh',
  maxWidth: '1280px',
  margin: '0 auto',
  width: '100%',
});

globalStyle(':root', {
  fontFamily: vars.typography.font.body,
  fontSize: vars.typography.size[100],
  fontWeight: vars.typography.weight[400],

  color: vars.color.sand,
  backgroundColor: vars.color.dusk,
});

globalStyle('a', {
  fontWeight: 500,
  textDecoration: 'inherit',
  color: vars.color.foam,
});

globalStyle('a:hover', {
  textDecoration: 'underline',
});
