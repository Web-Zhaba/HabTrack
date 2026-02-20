import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/shared'),
      '@assets': path.resolve(__dirname, './src/assets'),  
    },
  },
})
