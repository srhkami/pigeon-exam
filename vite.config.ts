import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    VitePWA({

      registerType: 'prompt',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      srcDir: 'public',
      filename: 'sw.js',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        short_name: "小試鴿手",
        name: "小試鴿手",
        icons: [
          {
            src: "icons/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon"
          },
          {
            src: "icons/Logo192.png",
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: "icons/Logo512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        start_url: "/index",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#242424"
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
          },
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0', // ✅ 關鍵設定
    port: 5173        // 🔁 可以自訂 port
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})
