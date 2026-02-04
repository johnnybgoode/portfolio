import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';
import { dividerVariants } from './Divider.css';

const dotSize = createVar();

const timelineSegment = style({
  position: 'absolute',
  left: `calc(${dotSize} / 2 * -1)`,
  top: '11px',
  bottom: '-11px',
  selectors: {
    '&:last-of-type': {
      bottom: '11px',
    },
  },
  vars: {
    [dotSize]: '6px',
  },
  '@media': {
    print: {
      vars: {
        [dotSize]: '5px',
      },
    },
  },
});

const timelineDot = style({
  fill: colorVars.body,
  opacity: 0.7,
  width: dotSize,
  '@media': {
    print: {
      width: dotSize,
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

globalStyle(`${experienceItem}:last-of-type`, {
  paddingBlockEnd: 0,
});

globalStyle(`${experienceItem}:last-of-type > ${timelineSegment}`, {
  bottom: vars.space[250],
});

globalStyle(`${timelineSegment} > ${dividerVariants['vertical']}`, {
  height: `calc(100% - ${dotSize})`,
  marginInlineStart: 'calc(50% - 0.5px)',
  '@media': {
    print: {
      marginInlineStart: '2px',
    },
  },
});
