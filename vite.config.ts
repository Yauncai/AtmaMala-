import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'), // ensures Tailwind + PostCSS are used
  },
});
