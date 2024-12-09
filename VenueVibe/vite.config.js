import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  assetsInclude: ['**/*.mp4'], // This tells Vite to handle MP4 files
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})