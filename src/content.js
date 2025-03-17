// Content script for Video Overlay extension
console.log('Video Overlay: Content script loaded');

// Luo overlay-elementti
const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 999999;
  font-size: 24px;
  display: none;
  pointer-events: none;
`;
document.body.appendChild(overlay);

// Kuuntele viestejä background scriptiltä
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.type === 'ping') {
    sendResponse({ status: 'ok' });
    return true;
  }
  
  if (message.type === 'fetchMessage') {
    // Hae viesti sivulta
    const messageElement = document.getElementById('director-message');
    const message = messageElement ? messageElement.textContent : 'Hello World!';
    
    // Näytä viesti
    overlay.textContent = message;
    overlay.style.display = 'block';
    
    // Piilota viesti 5 sekunnin kuluttua
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 5000);
    
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'showMessage') {
    overlay.textContent = message.content;
    overlay.style.display = 'block';
    
    // Piilota viesti määritellyn ajan kuluttua
    setTimeout(() => {
      overlay.style.display = 'none';
    }, message.style.duration || 5000);
  }
});

// Rekisteröi content script background scriptille
chrome.runtime.sendMessage({ 
  type: 'contentScriptReady',
  url: window.location.href
}); 