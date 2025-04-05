import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isSandbox = process.env.BUILD_TARGET === 'sandbox';

export default defineConfig({
  base: isSandbox ? '/sbx/' : '/',
  build: {
    outDir: isSandbox ? 'dist/sbx' : 'dist',
  },
  plugins: [react()],
});
