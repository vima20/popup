// Content script
console.log('Content script loaded');

const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '50%';
overlay.style.left = '50%';
overlay.style.transform = 'translate(-50%, -50%)';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
overlay.style.color = 'white';
overlay.style.padding = '20px';
overlay.style.display = 'none';
overlay.textContent = 'Hello world!';
document.body.appendChild(overlay);

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'F3') {
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateOverlayText') {
    overlay.textContent = message.text;
    sendResponse({ success: true });
  } else if (message.type === 'getOverlayState') {
    sendResponse({ visible: overlay.style.display === 'block' });
  }
});

// Initialize

// Load saved text
chrome.storage.sync.get('overlayText', (result) => {
  if (result.overlayText) {
    overlay.textContent = result.overlayText;
  }
});
