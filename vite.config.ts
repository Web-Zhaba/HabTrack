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
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // React и ReactDOM (основной vendor бандл)
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'vendor-react';
            }

            // React Router
            if (
              id.includes('/node_modules/react-router/') ||
              id.includes('/node_modules/cookie/')
            ) {
              return 'vendor-router';
            }

            // Redux Toolkit
            if (
              id.includes('/node_modules/@reduxjs/') ||
              id.includes('/node_modules/redux/') ||
              id.includes('/node_modules/react-redux/')
            ) {
              return 'vendor-redux';
            }

            // Recharts и его зависимости (d3, lodash) — отдельный большой чанк
            if (
              id.includes('/node_modules/recharts/') ||
              id.includes('/node_modules/d3-') ||
              id.includes('/node_modules/lodash/') ||
              id.includes('/node_modules/delaunator/') ||
              id.includes('/node_modules/robust-predicates/')
            ) {
              return 'vendor-recharts';
            }

            // React Aria Components
            if (
              id.includes('/node_modules/react-aria-components/') ||
              id.includes('/node_modules/@react-aria/') ||
              id.includes('/node_modules/@react-stately/') ||
              id.includes('/node_modules/@internationalized/')
            ) {
              return 'vendor-aria';
            }

            // Framer Motion
            if (
              id.includes('/node_modules/motion/') ||
              id.includes('/node_modules/framer-motion/')
            ) {
              return 'vendor-motion';
            }

            // Иконки
            if (
              id.includes('/node_modules/lucide-react/') ||
              id.includes('/node_modules/@heroicons/')
            ) {
              return 'vendor-icons';
            }

            // Остальные библиотеки из node_modules
            if (id.includes('/node_modules/')) {
              return 'vendor';
            }
          },
        },
      },
    },
  } satisfies UserConfig;
});
