import { createApp, ref } from 'vue'
import Overlay from '../components/Overlay.vue'
import '../style.css'

console.log('Content script loaded')

function initializeApp() {
  try {
    // Check if container already exists
    let container = document.getElementById('youtube-overlay-container')
    if (container) {
      console.log('Container already exists, removing old one')
      container.remove()
    }

    // Create container for Vue app
    container = document.createElement('div')
    container.id = 'youtube-overlay-container'
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '999999'
    document.body.appendChild(container)

    console.log('Container created and added to body')

    // Create state for visibility
    const isVisible = ref(false)

    // Create and mount Vue app
    const app = createApp(Overlay, {
      modelValue: isVisible.value,
      text: 'Hello world!',
      'onUpdate:modelValue': (value: boolean) => {
        console.log('Updating visibility:', value)
        isVisible.value = value
      }
    })

    app.mount('#youtube-overlay-container')
    console.log('Vue app mounted')

    // Listen for keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'F3') {
        event.preventDefault()
        isVisible.value = !isVisible.value
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    console.log('Keyboard event listener added')

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Content script received message:', message)
      
      if (message.type === 'ping') {
        sendResponse({ status: 'ok' })
        return true
      }
      
      if (message.type === 'getOverlayState') {
        sendResponse({ visible: isVisible.value })
        return true
      }
      
      if (message.type === 'updateOverlayText') {
        if (app._instance) {
          app._instance.props.text = message.text
          sendResponse({ success: true })
        } else {
          sendResponse({ success: false })
        }
        return true
      }
    })

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.text && app._instance) {
        app._instance.props.text = changes.text.newValue
      }
    })

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      console.log('Keyboard event listener removed')
      app.unmount()
      console.log('Vue app unmounted')
    }
  } catch (error) {
    console.error('Error initializing app:', error)
    return () => {} // Return empty cleanup function in case of error
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
} 