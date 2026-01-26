import { globalStyle } from '@vanilla-extract/css';
import { space } from './utils';

globalStyle('*', {
  boxSizing: 'border-box',
  margin: 0,
});

globalStyle('html, body', {
  height: '100%',
});

globalStyle('body', {
  lineHeight: 1.5,
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'antialiased',
});

globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
});

globalStyle('input, button, textarea, select', {
  font: 'inherit',
});

globalStyle('ol, ul', {
  listStylePosition: 'outside',
  ...space('margin', '0'),
  ...space('padding', '0'),
});

globalStyle('p, h1, h2, h3, h4, h5, h6', {
  overflowWrap: 'break-word',
});

globalStyle('#root', {
  isolation: 'isolate',
  width: '100%',
});
