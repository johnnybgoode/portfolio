import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    dusk: '#292522',
    sand: '#ECE1D7',
    foam: '#85B695',
    cyan: '#89B3B6',
    sun: '#EBC06D', // '#E2C28C'
  },
  space: {},
  font: {
    // body: '"Helvetica", sans-serif',
    body: '"Roboto", sans-serif',
    mono: '"DM Mono", monospace',
  },
  typography: {
    h1: {
      size: '3.2em',
    },
    h2: {
      size: '2.8em',
    },
    h3: {
      size: '2.4em',
    },
    h4: {
      size: '2em',
    },
    h5: {
      size: '1.6em',
    },
  },
});
