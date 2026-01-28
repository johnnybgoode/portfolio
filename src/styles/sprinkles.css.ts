import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import { keyOf } from '../utils';
import { breakpoints, colorVars, vars } from './theme.css';

export type BorderProps = typeof borderProps;
export type ColorProps = typeof colorProps;
export type DisplayProps = typeof displayProps;
export type FlexProps = typeof flexProps;
export type ListProps = typeof listProps;
export type SpaceProps = typeof spaceProps;
export type SizeProps = typeof sizeProps;
export type TypeProps = typeof typeProps;

export type Sprinkles = Parameters<typeof sprinkles>[0];

const borderWidth = {
  '0': '0',
  '50': '0.5px',
  '100': '1px',
  '200': '2px',
  '300': '3px',
};
const borderProperties = defineProperties({
  properties: {
    borderBottomWidth: borderWidth,
    borderLeftWidth: borderWidth,
    borderStyle: ['solid', 'dashed'],
  },
  shorthands: {
    borderWidth: ['borderBottomWidth', 'borderLeftWidth'],
  },
});
export const borderProps = keyOf(borderProperties.styles);

const colorProperties = defineProperties({
  properties: {
    color: colorVars,
  },
});
export const colorProps = keyOf(colorProperties.styles);

const displayProperties = defineProperties({
  properties: {
    display: ['none', 'block', 'flex', 'inline', 'inline-flex'],
  },
});
export const displayProps = keyOf(displayProperties.styles);

const flexProperties = defineProperties({
  properties: {
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    alignSelf: ['flex-start', 'center', 'flex-end'],
    flexDirection: ['row', 'column'],
    flexGrow: [0, 1],
    flexShrink: [0, 1],
    gap: {
      '0': '0px',
      '100': '4px',
      '200': '8px',
      '300': '16px',
    },
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    justifySelf: ['flex-stretch', 'center', 'flex-end'],
  },
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: { '@media': breakpoints.tablet.mediaQuery },
  },
  responsiveArray: ['mobile', 'tablet'],
});
export const flexProps = keyOf(flexProperties.styles);

const listProperties = defineProperties({
  properties: {
    listStyleType: ['none'],
    listStylePosition: ['inside', 'outside'],
  },
});
export const listProps = keyOf(listProperties.styles);

const spaceProperties = defineProperties({
  properties: {
    paddingBlockStart: vars.space,
    paddingBlockEnd: vars.space,
    paddingInlineStart: vars.space,
    paddingInlineEnd: vars.space,
    marginBlockStart: vars.space,
    marginBlockEnd: vars.space,
    marginInlineStart: vars.space,
    marginInlineEnd: vars.space,
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
    marginX: ['marginInlineStart', 'marginInlineEnd'],
    marginY: ['marginBlockStart', 'marginBlockEnd'],
  },
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: { '@media': breakpoints.tablet.mediaQuery },
  },
  responsiveArray: ['mobile', 'tablet'],
});
export const spaceProps = keyOf(spaceProperties.styles);

const sizeProperties = defineProperties({
  properties: {
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
  },
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: { '@media': breakpoints.tablet.mediaQuery },
  },
  responsiveArray: ['mobile', 'tablet'],
});
export const sizeProps = keyOf(sizeProperties.styles);

const typeProperties = defineProperties({
  properties: {
    fontSize: vars.typography.size,
    fontWeight: vars.typography.weight,
  },
});
export const typeProps = keyOf(typeProperties.styles);

export const sprinkles = createSprinkles(
  borderProperties,
  displayProperties,
  colorProperties,
  flexProperties,
  listProperties,
  sizeProperties,
  spaceProperties,
  typeProperties,
);
