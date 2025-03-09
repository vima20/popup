// @ts-ignore
const { createApp, ref } = Vue
import Overlay from './components/Overlay.vue'

console.log("Content script loaded")

let cleanup: (() => void) | null = null

async function initializeApp() {
  try {
    // Cleanup previous instance if exists
    if (cleanup) {
      cleanup()
    }

    let container = document.getElementById("youtube-overlay-extension")
    if (container) {
      console.log("Container already exists, removing old one")
      container.remove()
    }

    container = document.createElement("div")
    container.id = "youtube-overlay-extension"
    container.style.position = "fixed"
    container.style.top = "0"
    container.style.left = "0"
    container.style.width = "100%"
    container.style.height = "100%"
    container.style.pointerEvents = "none"
    container.style.zIndex = "999999"
    document.body.appendChild(container)
    console.log("Container created and added to body")

    const isVisible = ref(false)
    const overlayText = ref('Hello world!')
    
    // Load saved text
    const result = await chrome.storage.sync.get('overlayText')
    if (result.overlayText) {
      overlayText.value = result.overlayText
    }
    
    const app = createApp(Overlay, {
      modelValue: isVisible.value,
      text: overlayText.value,
      'onUpdate:modelValue': (value: boolean) => {
        console.log("Updating visibility:", value)
        isVisible.value = value
        // Notify popup about state change
        chrome.runtime.sendMessage({ 
          type: 'overlayVisibilityChanged',
          visible: value
        })
      }
    })

    app.mount("#youtube-overlay-extension")
    console.log("Vue app mounted")

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'o') {
        event.preventDefault()
        isVisible.value = !isVisible.value
      }
    }

    // Listen for messages from popup
    const messageListener = (message: any, sender: any, sendResponse: (response?: any) => void) => {
      if (message.type === 'updateOverlayText') {
        overlayText.value = message.text
        sendResponse({ success: true })
      } else if (message.type === 'getOverlayState') {
        sendResponse({ visible: isVisible.value })
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    chrome.runtime.onMessage.addListener(messageListener)

    cleanup = () => {
      document.removeEventListener("keydown", handleKeyDown)
      chrome.runtime.onMessage.removeListener(messageListener)
      app.unmount()
      if (container) {
        container.remove()
      }
    }

    window.addEventListener('unload', cleanup)

    return cleanup
  } catch (error) {
    console.error("Error initializing app:", error)
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp)
} else {
  initializeApp()
} 