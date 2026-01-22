import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import { vars } from './theme.css';

const responsiveProperties = defineProperties({
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    gap: {
      '0': 0,
      '100': 4,
      '200': 8,
      '300': 16,
    },
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    paddingBlockStart: vars.space,
    paddingBlockEnd: vars.space,
    paddingInlineStart: vars.space,
    paddingInlineEnd: vars.space,
    marginBlockStart: vars.space,
    marginBlockEnd: vars.space,
    marginInlineStart: vars.space,
    marginInlineEnd: vars.space,
    width: {
      '10': '10%',
      '20': '20%',
      '30': '30%',
      '40': '40%',
      '50': '50%',
      '60': '60%',
      '70': '70%',
      '80': '80%',
      '90': '90%',
      '100': '100%',
    },
    shorthands: {
      padding: [
        'paddingBlockStart',
        'paddingBlockEnd',
        'paddingInlineStart',
        'paddingInlineEnd',
      ],
      paddingX: ['paddingInlineStart', 'paddingInlineEnd'],
      paddingY: ['paddingBlockStart', 'paddingBlockEnd'],
      margin: [
        'marginBlockStart',
        'marginBlockEnd',
        'marginInlineStart',
        'marginInlineEnd',
      ],
      marginX: ['marginBlockStart', 'marginBlockEnd'],
      mariginY: ['marginInlineStart', 'marginInlineEnd'],
    },
  },
});

const colorProperties = defineProperties({
  properties: {
    color: vars.color,
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];
