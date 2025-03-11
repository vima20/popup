// YouTube Overlay - Content Script
console.log('YouTube Overlay: Content script ladattu - V5.0');

// Globaalit muuttujat
let overlayElement = null;
let overlayVisible = false;
let overlayText = 'Hello world!';
let overlayInitialized = false;

// Merkki, että content script on aktiivinen
window.youtubeOverlayActive = true;

// Tyyli overlaylle
const overlayStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '20px',
  borderRadius: '10px',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  zIndex: '9999',
  maxWidth: '80%',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
  pointerEvents: 'none',
  opacity: '0',
  transition: 'opacity 0.3s ease'
};

// Luo overlay elementti kun DOM on valmis
function createOverlay() {
  if (overlayElement) {
    console.log('YouTube Overlay: Overlay on jo luotu');
    return;
  }

  if (!document.body) {
    console.log('YouTube Overlay: Body elementtiä ei löydy, odotetaan DOM:ia');
    setTimeout(createOverlay, 100);
    return;
  }

  console.log('YouTube Overlay: Luodaan overlay');
  
  // Luo elementti
  overlayElement = document.createElement('div');
  
  // Aseta tyyli
  Object.assign(overlayElement.style, overlayStyles);
  
  // Aseta teksti
  overlayElement.textContent = overlayText;
  
  // Lisää DOM:iin
  document.body.appendChild(overlayElement);
  
  console.log('YouTube Overlay: Overlay luotu ja lisätty DOM:iin');
  overlayInitialized = true;
}

// Näytä overlay
function showOverlay() {
  if (!overlayElement) {
    console.log('YouTube Overlay: Overlay ei ole vielä luotu, luodaan nyt');
    createOverlay();
  }
  
  if (!overlayVisible) {
    console.log('YouTube Overlay: Näytetään overlay, teksti:', overlayText);
    overlayElement.style.opacity = '1';
    overlayVisible = true;
    
    // Piilota automaattisesti 3 sekunnin kuluttua
    setTimeout(hideOverlay, 3000);
  }
}

// Piilota overlay
function hideOverlay() {
  if (overlayElement && overlayVisible) {
    console.log('YouTube Overlay: Piilotetaan overlay');
    overlayElement.style.opacity = '0';
    overlayVisible = false;
  }
}

// Päivitä overlay-teksti
function updateOverlayText(newText) {
  console.log('YouTube Overlay: Päivitetään teksti:', newText);
  overlayText = newText || 'Hello world!';
  
  if (overlayElement) {
    overlayElement.textContent = overlayText;
  }
  
  // Tallenna uusi teksti
  return { success: true, text: overlayText };
}

// Ota vastaan viestejä
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('YouTube Overlay: Viesti vastaanotettu:', message);
  
  // Varmista, että overlay on alustettu
  if (!overlayInitialized) {
    createOverlay();
  }
  
  // Käsittele eri viestityypit
  if (message.action === 'updateText') {
    const result = updateOverlayText(message.text);
    console.log('YouTube Overlay: Teksti päivitetty, vastaus:', result);
    sendResponse(result);
    return true; // Pidä viestikanava auki asynkronista vastausta varten
  } 
  else if (message.action === 'showOverlay') {
    showOverlay();
    sendResponse({ success: true, visible: true });
    return true;
  }
  else if (message.action === 'hideOverlay') {
    hideOverlay();
    sendResponse({ success: true, visible: false });
    return true;
  }
  else if (message.action === 'getStatus') {
    sendResponse({
      initialized: overlayInitialized,
      visible: overlayVisible,
      text: overlayText
    });
    return true;
  }
  
  // Tuntematon viestityyppi
  console.warn('YouTube Overlay: Tuntematon viestityyppi:', message.action);
  sendResponse({ success: false, error: 'Tuntematon toiminto' });
  return true;
});

// Lisää näppäimistön kuuntelija
document.addEventListener('keydown', function(event) {
  // CTRL + SHIFT + F3
  if (event.ctrlKey && event.shiftKey && event.keyCode === 114) {
    console.log('YouTube Overlay: Näppäinyhdistelmä havaittu (CTRL+SHIFT+F3)');
    showOverlay();
  }
});

// Alusta overlay
createOverlay();

// Lataa tallennettu teksti storage:sta
chrome.storage.sync.get('overlayText', function(data) {
  if (data.overlayText) {
    console.log('YouTube Overlay: Ladattu tallennettu teksti:', data.overlayText);
    updateOverlayText(data.overlayText);
  }
});

// Ilmoita alustuksesta taustaskriptille
chrome.runtime.sendMessage({
  type: 'contentScriptReady',
  url: window.location.href
});

// Diagnostiikka
console.log('YouTube Overlay: Content script alustettu - URL:', window.location.href); 