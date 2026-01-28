import { globalStyle, style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';
import { dividerVariants } from './Divider.css';

const timelineDot = style({
  fill: colorVars.body,
  width: '6px',
});

const timelineSegment = style({
  position: 'absolute',
  left: '-3px',
  top: '11px',
  bottom: '-11px',
  selectors: {
    '&:last-of-type': {
      bottom: '11px',
    },
  },
});

const experienceItem = style({
  paddingInlineStart: vars.space[400],
  paddingBlockEnd: vars.space[400],
  position: 'relative',
});

export default {
  timelineDot,
  timelineSegment,
  experienceItem,
} as const;

globalStyle(`${experienceItem}:last-of-type > ${timelineSegment}`, {
  bottom: '11px',
});

globalStyle(`${timelineSegment} > ${dividerVariants['vertical']}`, {
  height: '100%',
  marginLeft: 'calc(50% - 0.5px)',
});
