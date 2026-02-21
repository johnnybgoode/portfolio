import { globalStyle, style } from '@vanilla-extract/css';
import { listWrapper } from '#styles/components/List.css.ts';
import { vars } from '../theme.css';

export const resumeWrapper = style({
  maxWidth: '1072px',
  margin: '0 auto',
  paddingBlockStart: vars.space[500],
  paddingInline: vars.space[500],
  '@media': {
    print: {
      paddingBlockStart: vars.space[350],
      paddingInline: vars.space[450],
      position: 'relative',
      // width: "8.5in",
    },
  },
});

export const resumeRightCol = style({
  minWidth: '210px',
  maxWidth: '210px',
  '@media': {
    print: {
      minWidth: '180px',
      maxWidth: '180px',
    },
  },
});

export const lowerWrapper = style({});

export const skillsWrapper = style({});

globalStyle(`${skillsWrapper} li`, {
  '@media': {
    print: {
      fontSize: '12px',
    },
  },
});

globalStyle(`${skillsWrapper} ${listWrapper['block']} li`, {
  '@media': {
    print: {
      lineHeight: '1.25',
      marginBlockEnd: vars.space[200],
    },
  },
});

globalStyle(`${skillsWrapper} ${listWrapper['inline']} > li`, {
  '@media': {
    print: {
      lineHeight: '1.25',
      marginBlockEnd: vars.space[200],
    },
  },
});

globalStyle(`${resumeWrapper} h1`, {
  '@media': {
    print: {
      marginBlock: vars.space[200],
    },
  },
});

globalStyle(`${resumeWrapper} h2`, {
  '@media': {
    print: {
      marginBlock: vars.space[200],
    },
  },
});

globalStyle(`${resumeWrapper} h3`, {
  '@media': {
    print: {
      marginBlock: vars.space[250],
    },
  },
});

globalStyle(`${lowerWrapper} h3`, {
  '@media': {
    print: {
      marginBlockEnd: vars.space[200],
    },
  },
});

globalStyle(`${resumeWrapper} h4`, {
  '@media': {
    print: {
      marginBlockEnd: vars.space[100],
    },
  },
});

export const printPageBackground = style({
  display: 'none',
  background: '#eee',
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: 'calc(8.5in)',
  height: '11in',
  zIndex: '0',
  '@media': {
    print: {
      display: 'block',
      opacity: '0.8',
    },
  },
});
