// Popup script for Video Overlay extension
console.log('Video Overlay: Popup script loaded');

import { createApp } from 'vue'
import App from './App.vue'
import './styles.css';

// Initialize WebSocket connection
let ws: WebSocket | null = null;
let debugButton: HTMLButtonElement | null = null;
let messageTimeouts: Map<string, NodeJS.Timeout> = new Map();

// Initialize WebSocket
function initializeWebSocket() {
  try {
    ws = new WebSocket('ws://localhost:8080/ws');
    return ws;
  } catch (error) {
    console.error('Error initializing WebSocket:', error);
    return null;
  }
}

// Close WebSocket
function closeWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

// Check if content script is available
async function isContentScriptAvailable(tabId: number): Promise<boolean> {
  return new Promise((resolve) => {
    const messageId = Date.now().toString();
    const timeout = setTimeout(() => {
      messageTimeouts.delete(messageId);
      resolve(false);
    }, 1000);

    messageTimeouts.set(messageId, timeout);

    chrome.tabs.sendMessage(tabId, { type: 'ping', messageId }, (response) => {
      const timeout = messageTimeouts.get(messageId);
      if (timeout) {
        clearTimeout(timeout);
        messageTimeouts.delete(messageId);
      }
      resolve(!!response);
    });
  });
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize WebSocket
    const newWs = initializeWebSocket();
    if (newWs) {
      ws = newWs;
    }
    
    // Get debug button
    debugButton = document.getElementById('debug-button') as HTMLButtonElement;
    
    // Add event listeners
    document.getElementById('send-message')?.addEventListener('click', handleSendMessage);
    document.getElementById('clear-message')?.addEventListener('click', handleClearMessage);
    debugButton?.addEventListener('click', handleDebugClick);

    // Check current tab and content script availability
    const currentTab = await getCurrentTab();
    if (currentTab?.id) {
      const isAvailable = await isContentScriptAvailable(currentTab.id);
      if (!isAvailable) {
        // Show error message in popup
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = 'Tämä laajennus toimii vain videosivustoilla.';
        errorElement.style.color = 'red';
        errorElement.style.padding = '10px';
        document.body.insertBefore(errorElement, document.body.firstChild);
        
        // Disable controls
        document.getElementById('send-message')?.setAttribute('disabled', 'true');
        document.getElementById('clear-message')?.setAttribute('disabled', 'true');
        debugButton?.setAttribute('disabled', 'true');
      }
    }

    // Mount Vue app
    const app = createApp(App);
    app.mount('#app');
  } catch (error) {
    console.error('Error initializing popup:', error);
  }
});

// Handle send message button click
async function handleSendMessage() {
  const messageInput = document.getElementById('message-input') as HTMLInputElement;
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  try {
    const currentTab = await getCurrentTab();
    if (!currentTab?.id) return;
    
    const isAvailable = await isContentScriptAvailable(currentTab.id);
    if (!isAvailable) {
      console.error('Content script not available');
      return;
    }
    
    const messageId = Date.now().toString();
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        messageTimeouts.delete(messageId);
        reject(new Error('Message timeout'));
      }, 1000);

      messageTimeouts.set(messageId, timeout);

      chrome.tabs.sendMessage(currentTab.id!, {
        type: 'showMessage',
        content: message,
        messageId
      }, () => {
        const timeout = messageTimeouts.get(messageId);
        if (timeout) {
          clearTimeout(timeout);
          messageTimeouts.delete(messageId);
        }
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
    
    messageInput.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Handle clear message button click
async function handleClearMessage() {
  try {
    const currentTab = await getCurrentTab();
    if (!currentTab?.id) return;
    
    const isAvailable = await isContentScriptAvailable(currentTab.id);
    if (!isAvailable) {
      console.error('Content script not available');
      return;
    }
    
    const messageId = Date.now().toString();
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        messageTimeouts.delete(messageId);
        reject(new Error('Message timeout'));
      }, 1000);

      messageTimeouts.set(messageId, timeout);

      chrome.tabs.sendMessage(currentTab.id!, {
        type: 'hideOverlay',
        messageId
      }, () => {
        const timeout = messageTimeouts.get(messageId);
        if (timeout) {
          clearTimeout(timeout);
          messageTimeouts.delete(messageId);
        }
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error clearing message:', error);
  }
}

// Get current active tab
async function getCurrentTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

// Handle debug button click
async function handleDebugClick() {
  try {
    const currentTab = await getCurrentTab();
    if (!currentTab?.id) return;
    
    if (debugButton) {
      debugButton.disabled = true;
    }
    
    const isAvailable = await isContentScriptAvailable(currentTab.id);
    if (!isAvailable) {
      console.error('Content script not available');
      if (debugButton) {
        debugButton.disabled = false;
      }
      return;
    }
    
    const messageId = Date.now().toString();
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        messageTimeouts.delete(messageId);
        reject(new Error('Message timeout'));
      }, 1000);

      messageTimeouts.set(messageId, timeout);

      chrome.tabs.sendMessage(currentTab.id!, {
        type: 'ping',
        messageId
      }, () => {
        const timeout = messageTimeouts.get(messageId);
        if (timeout) {
          clearTimeout(timeout);
          messageTimeouts.delete(messageId);
        }
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error sending ping:', error);
    if (debugButton) {
      debugButton.disabled = false;
    }
  }
}

// Clean up when popup is closed
window.addEventListener('unload', () => {
  // Clear all pending timeouts
  for (const timeout of messageTimeouts.values()) {
    clearTimeout(timeout);
  }
  messageTimeouts.clear();

  if (ws) {
    closeWebSocket();
  }
}); 
