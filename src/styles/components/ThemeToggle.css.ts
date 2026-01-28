import { style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';

const themeToggle = style({
  // Invert colors
  color: colorVars.background,
  background: colorVars.body,
  padding: vars.space[300],
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  lineHeight: 1,
  position: 'fixed',
  bottom: '50px',
  right: '50px',
  opacity: '0.6',
  transform: 'scale(1.2)',
  '@media': {
    print: {
      display: 'none',
    },
  },
  selectors: {
    ['&:hover']: {
      opacity: '0.9',
    },
  },
});

const themeToggleLabel = style({
  color: colorVars.background,
  background: colorVars.body,
  border: `0.5px solid ${colorVars.background}`,
  borderRadius: '2px',
  position: 'absolute',
  bottom: '-20%',
  left: '-190%',
  paddingBlock: vars.space[100],
  paddingInline: vars.space[200],
  fontSize: '0.75rem',
  textWrap: 'nowrap',
  opacity: '0.7',
});

export default {
  themeToggle,
  themeToggleLabel,
} as const;
