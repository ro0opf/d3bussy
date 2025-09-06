import { defineConfig, loadEnv } from 'vite'

// Reads BASE_PATH from env for GitHub Pages. Defaults to '/'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.BASE_PATH || '/'
  return {
    base,
    server: {
      open: true
    }
  }
})

