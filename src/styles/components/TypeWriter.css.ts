import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';
import { space } from '../utils';

export const TypeWriterClass = style({
  fontFamily: vars.font.mono,
  fontSize: vars.typography.h5.size,
  ...space('margin', '0.25em 0'),
  textAlign: 'left',
  width: '100%',
});

export const CursorClass = style({
  fontSize: '0.9em',
  paddingInlineStart: '2px',
  verticalAlign: 'top',
});
