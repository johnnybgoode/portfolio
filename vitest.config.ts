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
        test: {
          environment: 'happy-dom',
          globals: true,
          include: ['src/**/*.test.ts?(x)'],
          name: 'unit',
          setupFiles: 'src/test/test-setup.ts',
        },
      },
    ],
  },
});
