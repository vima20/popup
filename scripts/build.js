import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function buildEntry(entry, name) {
  await build({
    configFile: false,
    plugins: [vue()],
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, `../src/${entry}`),
        name,
        fileName: name,
        formats: ['iife']
      },
      emptyOutDir: false,
      target: 'es2015',
      minify: false
    }
  })
}

async function buildAll() {
  try {
    // Build content script
    await buildEntry('content.ts', 'content')
    
    // Build background script
    await buildEntry('background.ts', 'background')
    
    // Build popup
    await buildEntry('popup/index.ts', 'popup')
    
    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildAll() 