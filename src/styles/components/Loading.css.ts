import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

const loadingBase = style({
  paddingBlock: vars.space[400],
  width: '100%',
});

export const loadingVariants = styleVariants({
  base: [loadingBase],
  fullscreen: [
    loadingBase,
    {
      height: '100vh',
      placeContent: 'center',
    },
  ],
  overlay: [
    loadingBase,
    {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      placeItems: 'center',
    },
  ],
});

export const loadingContent = style({
  display: 'flex',
  placeItems: 'center',
  justifyContent: 'center',
  fontFamily: vars.typography.font.mono,
});

const chrs = keyframes({
  to: { clipPath: 'inset(0 -1ch 0 0)' },
});

export const loadingAnimation = style({
  width: 'fit-content',
  clipPath: 'inset(0 3ch 0 0)',
  animation: `${chrs} 1s steps(4) infinite`,
});
