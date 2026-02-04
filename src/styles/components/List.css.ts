import { globalStyle, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const listWrapper = styleVariants({
  block: {
    listStyleType: 'disc',
    listStylePosition: 'outside',
  },
  inline: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyleType: 'none',
  },
});

globalStyle(`${listWrapper['block']} > li`, {
  marginBlockEnd: vars.space[300],
  marginInlineStart: vars.space[350],
});

globalStyle(`${listWrapper['block']} > li:last-of-type`, {
  marginBlockEnd: vars.space[0],
});

globalStyle(`${listWrapper['block']} > li::marker`, {
  fontSize: '10px',
});

globalStyle(`${listWrapper['inline']} > li`, {
  display: 'inline-flex',
  lineHeight: 1.55,
  marginBlockEnd: vars.space[200],
  marginInlineEnd: vars.space[250],
  marginInlineStart: 0,
});

globalStyle(`${listWrapper['inline']} > li::before`, {
  alignSelf: 'center',
  content: '• ',
  fontSize: vars.typography.size[50],
  paddingInlineEnd: vars.space[250],
  opacity: 0.8,
});

globalStyle(`${listWrapper['inline']} > li:nth-of-type(8n)`, {
  '@media': {
    print: {
      flexBasis: '51%',
    },
  },
});

globalStyle(`${listWrapper['inline']} > li:nth-of-type(24)`, {
  flexBasis: 'min-content',
});
