import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'School DRRM Hub',
        short_name: 'School DRRM',
        description: 'Offline-first school disaster preparedness and response portal',
        theme_color: '#12345a',
        background_color: '#f4f7fb',
        display: 'standalone',
        start_url: './',
        icons: []
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico}']
      }
    })
  ],
  base: './'
})
