import path from 'node:path';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    bail: 1,
    clearMocks: true,
    css: false,
    coverage: {
      enabled: true,
      exclude: [
        'src/main.tsx',
        'src/mocks/**/*',
        'src/styles/**/*',
        'src/test/**/*',
        'vite.env.d.ts',
      ],
      include: ['src/**/*.ts?(x)'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      thresholds: {
        '100': true,
      },
    },
    projects: [
      {
        test: {
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          name: 'browser',
          include: [],
        },
      },
      {
        plugins: [vanillaExtractPlugin()],
        test: {
          environment: 'happy-dom',
          globals: true,
          include: ['src/test/**/*.test.ts?(x)'],
          name: 'unit',
          setupFiles: 'src/test/utils/setup.ts',
        },
        resolve: {
          alias: {
            '~': path.resolve(__dirname, './src'),
            '~components': path.resolve(__dirname, './src/components'),
            '~styles': path.resolve(__dirname, './src/styles'),
            '~test': path.resolve(__dirname, './src/test'),
          },
        },
      },
    ],
  },
});
