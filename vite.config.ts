import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Luodaan erilliset konfiguraatiot jokaiselle entry pointille
export default defineConfig([
  {
    plugins: [vue()],
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, 'src/content.ts'),
        name: 'content',
        fileName: 'content',
        formats: ['iife']
      },
      emptyOutDir: false,
      target: 'es2015',
      minify: false
    }
  },
  {
    plugins: [vue()],
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, 'src/background.ts'),
        name: 'background',
        fileName: 'background',
        formats: ['iife']
      },
      emptyOutDir: false,
      target: 'es2015',
      minify: false
    }
  },
  {
    plugins: [vue()],
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, 'src/popup/index.ts'),
        name: 'popup',
        fileName: 'popup',
        formats: ['iife']
      },
      emptyOutDir: false,
      target: 'es2015',
      minify: false
    }
  }
]) 