import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        fallback: 'index.html',
      },
    },
  },
  plugins: [react()],
  server: {
    open: true, // auto opens browser
    watch: {
      usePolling: true, // useful in WSL, Docker, or network drives
    },
  },
});
