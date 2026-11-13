import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Serve the Vercel functions in /api during `npm run dev`, so local dev matches production.
const vercelApiInDev = () => ({
  name: 'vercel-api-in-dev',
  configureServer(server) {
    server.middlewares.use('/api/send-payment', async (req, res) => {
      const { default: handler } = await server.ssrLoadModule('/api/send-payment.js')
      handler(req, res)
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Make server-only vars from .env.local (e.g. TELEGRAM_BOT_TOKEN) visible to the dev API.
  Object.assign(process.env, loadEnv(mode, process.cwd(), 'TELEGRAM_'))

  return {
    base: '/',
    plugins: [vue(), vueDevTools(), vercelApiInDev()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Firebase is large and rarely changes: keep it in its own cacheable chunk.
          manualChunks: {
            firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          },
        },
      },
    },
  }
})
