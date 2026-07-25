declare module 'vite' {
  export function defineConfig(config: any): any
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Provide a lightweight declaration for `process.env` so TS knows about it
// without requiring @types/node. We're only using it for VITE_PROXY_TARGET.
declare const process: {
  env: { [key: string]: string | undefined }
}

// In locale il backend è su localhost:8080. Dentro Docker Compose, i container
// si raggiungono per nome di servizio: il backend è 'http://backend:8080'.
// VITE_PROXY_TARGET viene impostata da docker-compose.yml solo per il container frontend.
const proxyTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:8180'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['andreamoiochef.it', 'www.andreamoiochef.it'],
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
      // File caricati dall'area admin (immagini, video mp4), serviti
      // direttamente dal backend Spring sotto /uploads (vedi WebMvcConfig).
      '/uploads': {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
})