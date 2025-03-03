import { createApp } from 'vue'
import Overlay from '../components/Overlay.vue'
import '../assets/main.css'

// Create container for Vue app
const container = document.createElement('div')
container.id = 'youtube-overlay-extension'
document.body.appendChild(container)

// Create and mount Vue app
const app = createApp(Overlay)
app.mount('#youtube-overlay-extension') 