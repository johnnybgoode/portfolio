import { fontFace, style, styleVariants } from '@vanilla-extract/css';

const faIconFont = fontFace({
  src: "url('/fonts/fa-icons.woff2?55abcg') format('woff2')",
  fontDisplay: 'block',
  fontStyle: 'normal',
  fontWeight: 'normal',
});

const iconFontBase = style({
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontVariant: 'normal',
  textTransform: 'none',
  lineHeight: 1,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  verticalAlign: 'middle',
});

const iconBase = style([
  iconFontBase,
  {
    fontFamily: `${faIconFont} !important`,
    '@media': {
      print: {
        opacity: '0.5',
      },
    },
  },
]);

export const icons = styleVariants({
  code: [iconBase, { ':before': { content: '\\f121' } }],
  console: [iconBase, { ':before': { content: '\\f120' } }],
  github: [iconBase, { ':before': { content: '\\f09b' } }],
  link: [iconBase, { ':before': { content: '\\f0c1' } }],
  linkedin: [iconBase, { ':before': { content: '\\f08c' } }],
  mail: [iconBase, { ':before': { content: '\\f0e0' } }],
  phone: [iconBase, { ':before': { content: '\\f095' } }],
  pin: [iconBase, { ':before': { content: '\\f041' } }],
  sun: [iconBase, { ':before': { content: '\\f185' } }],
});

// const iconFont = fontFace({
// src: "url('fonts/icons.woff2?lq7bkd') format('woff2')",
// fontDisplay: 'block',
// fontStyle: 'normal',
// fontWeight: 'normal',
// });

// const iconBase = style([
// iconFontBase,
// {
// fontFamily: `${iconFont} !important`,
// },
// ]);

// export const icons = styleVariants({
// code: [iconBase, { ':before': { content: "\\e904" } }],
// console: [iconBase, { ':before': { content: "\\e901" } }],
// github: [iconBase, { ':before': { content: "\\eab0" } }],
// link: [iconBase, { ':before': { content: "\\e9cb" } }],
// linkedin: [iconBase, { ':before': { content: "\\eac9" } }],
// mail: [iconBase, { ':before': { content: "\\e900" } }],
// phone: [iconBase, { ':before': { content: "\\e942" } }],
// 'phone-thin': [iconBase, { ':before': { content: "\\e903" } }],
// pin: [iconBase, { ':before': { content: "\\e902" } }],
// www: [iconBase, { ':before': { content: "\\e9c9" } }],
// });
