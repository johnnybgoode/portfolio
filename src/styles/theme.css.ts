import { createGlobalTheme } from '@vanilla-extract/css';

const size = {
  '50': '12px',
  '100': '14px',
  '200': '16px', // base
  '300': '20px',
  '400': '26px',
  '500': '32px',
  '600': '38px',
  '700': '44px',
  '800': '50px',
  '1000': '60px',
};
export const vars = createGlobalTheme(':root', {
  color: {
    dusk: '#292522',
    sand: '#ECE1D7',
    foam: '#85B695',
    cyan: '#89B3B6',
    sun: '#EBC06D', // '#E2C28C'
  },
  font: {
    // body: '"Helvetica", sans-serif',
    body: '"Roboto", sans-serif',
    mono: '"DM Mono", monospace',
  },
  space: {
    '0': '0px',
    '100': '2px',
    '200': '4px',
    '300': '8px',
    '400': '16px',
    '500': '32px',
  },
  typography: {
    h1: {
      size: size[800],
    },
    h2: {
      size: size[700],
    },
    h3: {
      size: size[600],
    },
    h4: {
      size: size[500],
    },
    h5: {
      size: size[400],
    },
    size,
  },
});
