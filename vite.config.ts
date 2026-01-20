import path from 'node:path';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
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
});
