import { style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';

export const errorWrapper = style({
  color: colorVars.stone,
  background: `rgba(${colorVars.rgb.red}, 0.5)`,
  borderRadius: '2px',
  padding: `${vars.space[400]} ${vars.space[500]} ${vars.space[500]}`,
  margin: '0 auto',
  maxWidth: '400px',
  textAlign: 'center',
});
