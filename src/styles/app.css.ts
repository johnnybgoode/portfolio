import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from './theme.css';
import { space } from './utils';

export const appStyle = style({
  ...space('padding', '2rem'),
  ...space('margin', '0 auto'),
  maxWidth: '1280px',
});

globalStyle(':root', {
  fontFamily: vars.font.body,
  lineHeight: 1.5,
  fontWeight: 400,

  color: vars.color.sand,
  backgroundColor: vars.color.dusk,

  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'antialiased',
});

globalStyle('#root', {
  ...space('padding', '2rem'),
  ...space('margin', '0 auto'),
  maxWidth: '1280px',
  width: '100%',
});

globalStyle('html, body', {
  display: 'flex',
  placeItems: 'center',
  minWidth: '320px',
  minHeight: '100vh',
  margin: 0,
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

globalStyle('button', {
  ...space('padding', '0.6em 1.2em'),
  fontFamily: 'inherit',
  fontSize: '1em',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#1a1a1a',
  border: '1px solid transparent',
  borderRadius: '8px',
  transition: 'border-color 0.25s',
});

globalStyle('button:hover', {
  borderColor: '#646cff',
});

globalStyle('button:focus', {
  outline: '4px auto webkit-focus-ring-color',
});

globalStyle('button:focus-visible', {
  outline: '4px auto webkit-focus-ring-color',
});
