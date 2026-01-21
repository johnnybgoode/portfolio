import path from 'node:path';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~components': path.resolve(__dirname, './src/components'),
      '~styles': path.resolve(__dirname, './src/styles'),
      '~test': path.resolve(__dirname, './src/test'),
    },
  },
  server: {
    port: process.env.PORT as unknown as number,
  },
});
