import path from 'node:path';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
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
        'src/app/**/*',
        'src/mocks/**/*',
        'src/styles/**/*',
        'src/test/**/*',
      ],
      include: ['src/**/*.ts?(x)'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
    },
    projects: [
      {
        plugins: [react(), vanillaExtractPlugin()],
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
            '@portfolio/notion': path.resolve(
              __dirname,
              '../../packages/notion/src/index.ts',
            ),
          },
        },
      },
    ],
  },
});
