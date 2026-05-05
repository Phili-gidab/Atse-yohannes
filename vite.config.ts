import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Manual chunking keeps the public bundle slim. Firebase, framer-motion,
// react-query, and lucide each get their own chunk so they can cache
// independently and don't all reload on every site update.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('framer-motion')) return 'framer';
          if (id.includes('@tanstack/react-query')) return 'query';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('react-router')) return 'router';
          if (id.includes('@emotion')) return 'emotion';
          if (id.includes('react-hook-form') || id.includes('zod')) return 'forms';
          return 'vendor';
        },
      },
    },
  },
});
