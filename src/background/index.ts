// Background script for Video Overlay extension
import { WS_URL } from '../config/websocket';
import { type Message } from '../types/message';

console.log('Video Overlay: Background script loaded');

let ws: WebSocket | null = null;
const activeContentScripts = new Map<number, { tabId: number; url: string }>();

// Initialize WebSocket connection
function initializeWebSocket() {
  if (ws?.readyState === WebSocket.OPEN) return;
  
  try {
    console.log('Background: Initializing WebSocket connection');
    ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      console.log('Background: WebSocket connected');
      
      // Register as director
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'register',
          role: 'director'
        }));
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Background: WebSocket message received:', message);
        
        // Handle viewer registration updates
        if (message.type === 'viewerUpdate') {
          // Update popup if open
          chrome.runtime.sendMessage(message);
        }
      } catch (error) {
        console.error('Background: Error handling WebSocket message:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('Background: WebSocket disconnected');
      ws = null;
      setTimeout(initializeWebSocket, 5000);
    };
    
    ws.onerror = (error) => {
      console.error('Background: WebSocket error:', error);
      ws?.close();
    };
  } catch (error) {
    console.error('Background: Error initializing WebSocket:', error);
    setTimeout(initializeWebSocket, 5000);
  }
}

// Initialize WebSocket when background script loads
initializeWebSocket();

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
  console.log('Background: Message received:', message, 'from:', sender);

  try {
    if (sender.tab?.id) {
      switch (message.type) {
        case 'contentScriptReady':
          activeContentScripts.set(sender.tab.id, {
            tabId: sender.tab.id,
            url: message.url || ''
          });
          sendResponse({ success: true });
          break;

        case 'showMessage':
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
            sendResponse({ success: true });
          } else {
            sendResponse({ 
              success: false, 
              error: 'WebSocket not connected' 
            });
          }
          break;

        default:
          console.warn('Background: Unknown message type:', message.type);
          sendResponse({ 
            success: false, 
            error: 'Unknown message type' 
          });
      }
    }
  } catch (error) {
    console.error('Background: Error handling message:', error);
    sendResponse({ 
      success: false, 
      error: String(error)
    });
  }

  return true; // Keep message channel open for async response
});

// Handle commands (keyboard shortcuts)
chrome.commands.onCommand.addListener((command) => {
  console.log('Background: Command received', command);
  
  if (command === 'toggle-overlay') {
    // Get active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tab = tabs[0];
        
        // Check if content script is active in this tab
        if (tab.id && activeContentScripts.has(tab.id)) {
          // Send toggle message to content script
          chrome.tabs.sendMessage(tab.id, { 
            type: 'toggleOverlay' 
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Background: Error sending toggle message:', chrome.runtime.lastError);
            } else {
              console.log('Background: Toggle response:', response);
            }
          });
        } else {
          console.log('Background: No content script in active tab');
        }
      }
    });
  }
});

// Clean up disconnected tabs periodically
setInterval(() => {
  chrome.tabs.query({}, (tabs) => {
    const tabIds = new Set(tabs.map(tab => tab.id).filter((id): id is number => id !== undefined));
    
    // Check each content script entry
    for (const [tabId] of activeContentScripts.entries()) {
      if (!tabIds.has(tabId)) {
        // Tab no longer exists, remove from tracking
        activeContentScripts.delete(tabId);
        console.log('Background: Removed closed tab', tabId);
      }
    }
  });
}, 60000);

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Video Overlay extension installed');
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com/watch')) {
    chrome.tabs.sendMessage(tabId, { type: 'videoLoaded' });
  }
});
