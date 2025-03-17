import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Luodaan Chrome-laajennukselle konfiguraatio
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-files',
      writeBundle() {
        // Luo kansiot
        if (!existsSync('dist/icons')) {
          mkdirSync('dist/icons', { recursive: true });
        }
        
        // Kopioi tiedostot
        copyFileSync('src/content/content.css', 'dist/assets/content.css');
        copyFileSync('src/popup/popup.html', 'dist/popup.html');
        copyFileSync('manifest.json', 'dist/manifest.json');
        copyFileSync('icons/icon16.png', 'dist/icons/icon16.png');
        copyFileSync('icons/icon48.png', 'dist/icons/icon48.png');
        copyFileSync('icons/icon128.png', 'dist/icons/icon128.png');
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/content.js'),
        popup: resolve(__dirname, 'src/popup/index.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
}) 