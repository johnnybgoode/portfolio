import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const pageWrapper = style({
  minHeight: '100vh',
  maxWidth: '1072px',
  margin: '0 auto',
  paddingBlockStart: vars.space[500],
  paddingInline: vars.space[500],
});
