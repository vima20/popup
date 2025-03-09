// Content script
console.log('Content script loaded');

export const overlayStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '20px',
  display: 'none',
  zIndex: '999999',
  pointerEvents: 'none',
};

let overlay = null;

export function createOverlay() {
  if (overlay) return;
  
  overlay = document.createElement('div');
  Object.assign(overlay.style, overlayStyles);
  overlay.textContent = 'Hello world!';
  document.body.appendChild(overlay);
  return overlay;
}

export function toggleOverlay(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'F3') {
    e.preventDefault(); // Estä selaimen oletustoiminto
    if (!overlay) createOverlay();
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    
    // Ilmoita tilan muutos
    chrome.runtime.sendMessage({
      type: "overlayVisibilityChanged",
      visible: overlay.style.display === 'block'
    });
  }
}

// Cleanup-funktio
export function cleanup() {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
    overlay = null;
  }
  document.removeEventListener('keydown', toggleOverlay);
}

// Alustus
export function init() {
  createOverlay();
  document.addEventListener('keydown', toggleOverlay);
  
  // Lataa tallennettu teksti
  chrome.storage.sync.get('overlayText', (result) => {
    if (result.overlayText && overlay) {
      overlay.textContent = result.overlayText;
    }
  });
}

// Kuuntele viestejä popup-ikkunasta
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!overlay) createOverlay();
  
  if (message.type === 'updateOverlayText') {
    overlay.textContent = message.text;
    sendResponse({ success: true });
  } else if (message.type === 'getOverlayState') {
    sendResponse({ visible: overlay.style.display === 'block' });
  }
  return true;
});

// Käynnistä ja rekisteröi cleanup
init();
window.addEventListener('unload', cleanup);
