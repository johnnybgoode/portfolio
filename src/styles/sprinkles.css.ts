import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles';
import { keyOf } from '../utils';
import { vars } from './theme.css';

export type ColorProps = typeof colorProps;
export type DisplayProps = typeof displayProps;
export type FlexProps = typeof flexProps;
export type ListProps = typeof listProps;
export type SpaceProps = typeof spaceProps;
export type SizeProps = typeof sizeProps;
export type TypeProps = typeof typeProps;

export type Sprinkles = Parameters<typeof sprinkles>[0];

const colorProperties = defineProperties({
  properties: {
    color: vars.color,
  },
});
export const colorProps = keyOf(colorProperties.styles);

const displayProperties = defineProperties({
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
  },
});
export const displayProps = keyOf(displayProperties.styles);

const flexProperties = defineProperties({
  properties: {
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
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
  },
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
    marginX: ['marginBlockStart', 'marginBlockEnd'],
    mariginY: ['marginInlineStart', 'marginInlineEnd'],
  },
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
});
export const sizeProps = keyOf(sizeProperties.styles);

const typeProperties = defineProperties({
  properties: {
    fontSize: vars.typography.size,
  },
});
export const typeProps = keyOf(typeProperties.styles);

export const sprinkles = createSprinkles(
  displayProperties,
  colorProperties,
  flexProperties,
  listProperties,
  sizeProperties,
  spaceProperties,
  typeProperties,
);
