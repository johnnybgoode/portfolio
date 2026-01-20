/// <reference types="vitest/config" />

import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@test': path.resolve(__dirname, './src/test'),
      '@test/mocks': path.resolve(__dirname, './src/test/mocks'),
    },
  },
  server: {
    port: process.env.PORT as unknown as number,
  },
  test: {
    bail: 1,
    clearMocks: true,
    coverage: {
      enabled: true,
      exclude: ['src/main.tsx', 'src/mocks/browser.ts', 'src/test/**/*', 'vite.env.d.ts'],
      include: ['src/**/*.ts?(x)'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      thresholds: {
        '100': true,
      },
    },
    css: false,
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.ts?(x)'],
    setupFiles: 'src/test/test-setup.ts',
  },
});
