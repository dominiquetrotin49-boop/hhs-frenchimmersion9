import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/hhs-frenchimmersion9/',
  plugins: [react()],
  server: {
    port: 5174,
    host: true
  }
})
