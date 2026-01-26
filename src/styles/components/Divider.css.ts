import { style, styleVariants } from '@vanilla-extract/css';

const base = style({
  borderWidth: '0px',
  borderStyle: 'solid',
  opacity: '0.6',
});

export const DividerClasses = styleVariants({
  horizontal: [
    base,
    {
      borderBottomWidth: '1px',
      display: 'block',
      height: 0,
      width: '100%',
    },
  ],
  vertical: [
    base,
    {
      borderLeftWidth: '1px',
      display: 'inline-block',
      minHeight: '1em',
      width: '1px',
    },
  ],
});
