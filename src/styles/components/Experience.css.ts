import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const ExperienceClass = style({
  paddingInlineStart: vars.space[400],
  paddingBlockEnd: vars.space[400],
  position: 'relative',
  selectors: {
    '&:before': {
      content: ' ',
      display: 'list-item',
      listStylePosition: 'inside',
      listStyleType: 'none',
      listStyleImage:
        'url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjRUNFMUQ3Ij48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgLz48L3N2Zz4=)',
      position: 'absolute',
      left: '-3px',
      top: '3px',
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
