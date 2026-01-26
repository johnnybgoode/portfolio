import { style, styleVariants } from '@vanilla-extract/css';

const base = style({
  opacity: '0.5',
});

export const DividerClasses = styleVariants({
  horizontal: [
    base,
    {
      borderBottomStyle: 'solid',
      display: 'block',
      height: 0,
      width: '100%',
    },
  ],
  vertical: [
    base,
    {
      borderLeftStyle: 'solid',
      display: 'inline-block',
      minHeight: '1em',
      width: '1px',
    },
  ],
});
