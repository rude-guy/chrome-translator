import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json' assert { type: 'json' };
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/',
  plugins: [react(), crx({ manifest })],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        contentPage: path.resolve(__dirname, 'src/contentPage/index.html'),
        popup: path.resolve(__dirname, 'src/popup/index.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
});
