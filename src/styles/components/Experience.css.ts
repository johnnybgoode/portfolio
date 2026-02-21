import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { colorVars, vars } from '../theme.css';
import { dividerVariants } from './Divider.css';
import { listWrapper } from './List.css';

const dotSize = createVar();

const timelineSegment = style({
  position: 'absolute',
  left: `calc(${ dotSize } / 2 * -1)`,
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
      top: '9px',
      bottom: '-9px',
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
  '@media': {
    print: {
      paddingInlineStart: vars.space[350],
      paddingBlockEnd: vars.space[350],
    },
  },
});

export default {
  timelineDot,
  timelineSegment,
  experienceItem,
} as const;

globalStyle(`${ experienceItem }:last-of-type`, {
  paddingBlockEnd: 0,
});

globalStyle(`${ experienceItem }:last-of-type > ${ timelineSegment }`, {
  bottom: vars.space[200],
});

globalStyle(`${ timelineSegment } > ${ dividerVariants['vertical'] }`, {
  height: `calc(100% - ${ dotSize })`,
  marginInlineStart: 'calc(50% - 0.5px)',
  '@media': {
    print: {
      marginInlineStart: '2.125px',
    },
  },
});

globalStyle(`${ experienceItem } ${ listWrapper['block'] } li`, {
  '@media': {
    print: {
      lineHeight: '1.25',
      marginBlockEnd: vars.space[250],
    },
  },
});

globalStyle(`${ experienceItem } ${ listWrapper['block'] } li:last-of-type`, {
  '@media': {
    print: {
      marginBlockEnd: 0,
    },
  },
});