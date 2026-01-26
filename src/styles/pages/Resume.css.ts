import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const ResumeClass = style({
  maxWidth: '1024px',
  margin: '0 auto',
  paddingBlockStart: vars.space[500],
});
