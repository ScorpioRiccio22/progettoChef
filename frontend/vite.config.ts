import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// In locale il backend è su localhost:8080. Dentro Docker Compose, i container
// si raggiungono per nome di servizio: il backend è 'http://backend:8080'.
// VITE_PROXY_TARGET viene impostata da docker-compose.yml solo per il container frontend.
const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
})
