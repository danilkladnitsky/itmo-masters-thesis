import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // important to avoid splitting WASM files
      },
    },
  },
  worker: {
    format: 'es',
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
