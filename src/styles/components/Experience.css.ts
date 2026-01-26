import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const ExperienceClass = style({
  paddingInlineStart: vars.space[400],
  paddingBlockEnd: vars.space[400],
  position: 'relative',
  selectors: {
    '&:before': {
      backgroundColor: vars.color.sand,
      borderRadius: '4px',
      content: ' ',
      display: 'block',
      position: 'absolute',
      left: '-4px',
      top: '11px',
      width: '8px',
      height: '8px',
    },
    '&:after': {
      content: ' ',
      position: 'absolute',
      borderLeft: '0.5px solid',
      bottom: '-11px',
      top: '11px',
      left: 0,
      opacity: '0.6',
    },
    '&:last-of-type:after': {
      bottom: 0,
    },
  },
});
