import { defineConfig, type UserConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/shared'),
        '@assets': path.resolve(__dirname, './src/assets'),
        src: path.resolve(__dirname, './src'),
        '@features': path.resolve(__dirname, './src/features'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@app': path.resolve(__dirname, './src/app'),
      },
    },
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router'],
            'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
            'vendor-aria': ['react-aria-components', '@internationalized/date'],
            'vendor-motion': ['motion'],
            'vendor-recharts': ['recharts'],
          },
        },
      },
    },
  } satisfies UserConfig;
});
