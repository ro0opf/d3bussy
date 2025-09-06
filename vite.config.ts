import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'node:path'

// Reads BASE_PATH from env for GitHub Pages. Defaults to '/'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.BASE_PATH || '/'
  return {
    base,
    build: {
      rollupOptions: {
        input: {
          main: resolve(process.cwd(), 'index.html'),
          asset: resolve(process.cwd(), 'asset/index.html')
        }
      }
    },
    server: {
      open: true
    }
  }
})
