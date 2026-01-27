import { createGlobalTheme } from '@vanilla-extract/css';

export const breakpoints = {
  mobile: {
    fontSize: '12px',
    width: 0,
  },
  tablet: {
    fontSize: '14px',
    width: 768,
    get mediaQuery() {
      return `(min-width: ${this.width}px)`;
    },
  },
} as const;

export const vars = createGlobalTheme(':root', {
  color: {
    dusk: '#292522',
    sand: '#ECE1D7',
    foam: '#85B695',
    cyan: '#89B3B6',
    sun: '#EBC06D', // '#E2C28C'
  },
  space: {
    '0': '0px',
    '100': '2px',
    '200': '4px',
    '300': '8px',
    '350': '12px',
    '400': '16px',
    '500': '24px',
    '600': '32px',
    '700': '40px',
    '800': '48px',
  },
  typography: {
    font: {
      // body: '"Helvetica", sans-serif',
      body: '"Nunito Sans", sans-serif',
      heading: '"Montserrat", sans-serif',
      mono: '"DM Mono", monospace',
    },
    size: {
      '50': '0.85rem',
      '100': '1rem',
      '200': '1.15rem',
      // '300': '1.25rem',
    },
    weight: {
      '300': '300',
      '400': '400',
      '500': '500',
    },
    title: {
      size: '4.85rem',
      weight: '600',
      lineHeight: '1.2em',
    },
    h1: {
      size: '3.45rem',
      weight: '500',
      lineHeight: '1.1em',
    },
    h2: {
      size: '2.3rem',
      weight: '500',
      lineHeight: '1.1em',
    },
    h3: {
      size: '1.725rem',
      weight: '500',
      lineHeight: '1.1em',
    },
    h4: {
      size: '1.3rem',
      weight: '500',
      lineHeight: '1.1em',
    },
    h5: {
      size: '1.15rem',
      weight: '500',
      lineHeight: '1.1em',
    },
  },
});
