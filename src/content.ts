import { createApp } from 'vue'
import App from './components/App.vue'
import './content/content.css'

// Content script for Video Overlay extension
console.log('Video Overlay: Content script loaded');

interface MessageStyle {
  position?: 'top' | 'middle' | 'bottom';
  color?: string;
  fontSize?: string;
  duration?: number;
  [key: string]: any;
}

// Luo uusi div-elementti overlay-komponentille
const overlayContainer = document.createElement('div')
overlayContainer.id = 'video-overlay-app'
document.body.appendChild(overlayContainer)

// Luo Vue-sovellus
const app = createApp(App)
app.mount('#video-overlay-app')

// Listen for hotkey
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.ctrlKey && e.shiftKey && e.key === '9') {
    toggleOverlay();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'toggleOverlay') {
    toggleOverlay();
    sendResponse({ success: true });
  } else if (message.type === 'showMessage') {
    showMessage(message.content || 'Hello World!', message.style);
    sendResponse({ success: true });
  } else if (message.type === 'hideMessage') {
    hideOverlay();
    sendResponse({ success: true });
  } else if (message.type === 'ping') {
    sendResponse({ success: true });
  }
  return true;
});

// Toggle overlay visibility
function toggleOverlay(): void {
  if (overlayContainer.style.display === 'none') {
    showMessage('Hello world!', {
      position: 'top',
      color: 'white',
      fontSize: '24px',
      duration: 3000
    });
  } else {
    hideOverlay();
  }
}

// Show message
function showMessage(text: string, style?: MessageStyle): void {
  const overlay = document.getElementById('video-overlay-app');
  if (!overlay) return;

  overlay.textContent = text;
  
  if (style) {
    if (style.position === 'top') {
      overlay.style.top = '10%';
    } else if (style.position === 'bottom') {
      overlay.style.top = '90%';
    } else {
      overlay.style.top = '50%';
    }
    
    if (style.color) {
      overlay.style.color = style.color;
    }
    
    if (style.fontSize) {
      overlay.style.fontSize = style.fontSize;
    }
  }
  
  overlay.style.display = 'block';
  
  if (style?.duration) {
    setTimeout(() => {
      hideOverlay();
    }, style.duration);
  }
}

// Hide overlay
function hideOverlay(): void {
  const overlay = document.getElementById('video-overlay-app');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Register content script with background script
chrome.runtime.sendMessage({ 
  type: 'contentScriptReady',
  url: window.location.href
}); 