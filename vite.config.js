import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Inkwell-Artisanal-AI-Cover-Letter-Studio/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    port: 5173,
    open: false,
  },
});
