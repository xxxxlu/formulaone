import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  // GitHub Pages 部署在 /formulaone/ 子路径，本地开发仍保持根路径。
  base: mode === 'production' ? '/formulaone/' : '/',
  server: {
    proxy: {
      // 前端 fetch('/ask') -> 后端 http://127.0.0.1:8000/ask
      '/ask': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // 可选：健康检查
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
}))
