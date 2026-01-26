import { createGlobalTheme } from '@vanilla-extract/css';

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
      '50': '12px',
      '100': '14px',
      '200': '16px', // base
      '300': '20px',
    },
    weight: {
      '300': '300',
      '400': '400',
      '500': '500',
    },
    title: {
      size: '70px',
      weight: '600',
      lineHeight: '1.2em',
    },
    h1: {
      size: '48px',
      weight: '500',
      lineHeight: '1.1em',
    },
    h2: {
      size: '32px',
      weight: '500',
      lineHeight: '1.1em',
    },
    h3: {
      size: '24px',
      weight: '500',
      lineHeight: '1.1em',
    },
    h4: {
      size: '20px',
      weight: '500',
      lineHeight: '1.1em',
    },
    h5: {
      size: '18px',
      weight: '500',
      lineHeight: '1.1em',
    },
  },
});
