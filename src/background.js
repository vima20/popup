// Chrome-laajennuksen taustaskripti
console.log('Video Overlay: Background script loaded')

// Rekisteröi näppäinkomento
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'toggle-overlay') {
    // Lähetä viesti aktiiviselle välilehdelle
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      console.log('Active tab:', tabs[0]);
      if (tabs[0]) {
        // Tarkista onko content script latautunut
        chrome.tabs.sendMessage(tabs[0].id, { type: 'ping' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Content script not loaded yet, injecting content script...');
            // Jos content script ei ole latautunut, injektoi se
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['content.js']
            }).then(() => {
              console.log('Content script injected, sending message...');
              // Odota hetki että content script latautuu
              setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'fetchMessage' });
              }, 100);
            }).catch(error => {
              console.error('Error injecting content script:', error);
            });
          } else {
            console.log('Content script is loaded, requesting message');
            // Content script on latautunut, pyydä viestiä
            chrome.tabs.sendMessage(tabs[0].id, { type: 'fetchMessage' });
          }
        });
      }
    });
  }
});

// Kuuntele viestejä content scriptiltä
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  if (message.type === 'OVERLAY_TOGGLE') {
    console.log('Overlay toggle requested');
    sendResponse({ success: true });
  }
  return true;
}); 