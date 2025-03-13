// Video Overlay - Content Script
console.log('Video Overlay: Content script ladattu - V6.0');

// Globaalit muuttujat
let overlayElement = null;
let overlayVisible = false;
let overlayText = 'Hello world!';
let overlayInitialized = false;
let videoElement = null;

// Merkki, että content script on aktiivinen
window.videoOverlayActive = true;

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

// Etsi video-elementti sivulta
function findVideoElement() {
  // Etsi kaikki video-elementit
  const videoElements = document.querySelectorAll('video');
  
  // Jos video-elementtejä löytyy, valitse ensimmäinen
  if (videoElements.length > 0) {
    videoElement = videoElements[0];
    console.log('Video Overlay: Video-elementti löydetty');
    return true;
  }
  
  // Jos video-elementtiä ei löydy, odota hetki ja yritä uudelleen
  console.log('Video Overlay: Video-elementtiä ei löydy, yritetään uudelleen');
  return false;
}

// Luo overlay elementti kun DOM on valmis
function createOverlay() {
  if (overlayElement) {
    console.log('Video Overlay: Overlay on jo luotu');
    return;
  }

  if (!document.body) {
    console.log('Video Overlay: Body elementtiä ei löydy, odotetaan DOM:ia');
    setTimeout(createOverlay, 100);
    return;
  }

  // Etsi video-elementti
  if (!findVideoElement()) {
    setTimeout(createOverlay, 1000);
    return;
  }

  console.log('Video Overlay: Luodaan overlay');
  
  // Luo elementti
  overlayElement = document.createElement('div');
  
  // Aseta tyyli
  Object.assign(overlayElement.style, overlayStyles);
  
  // Aseta teksti
  overlayElement.textContent = overlayText;
  
  // Lisää DOM:iin
  document.body.appendChild(overlayElement);
  
  console.log('Video Overlay: Overlay luotu ja lisätty DOM:iin');
  overlayInitialized = true;
}

// Näytä overlay
function showOverlay() {
  if (!overlayElement) {
    console.log('Video Overlay: Overlay ei ole vielä luotu, luodaan nyt');
    createOverlay();
  }
  
  if (!overlayVisible) {
    console.log('Video Overlay: Näytetään overlay, teksti:', overlayText);
    overlayElement.style.opacity = '1';
    overlayVisible = true;
    
    // Piilota automaattisesti 3 sekunnin kuluttua
    setTimeout(hideOverlay, 3000);
  }
}

// Piilota overlay
function hideOverlay() {
  if (overlayElement && overlayVisible) {
    console.log('Video Overlay: Piilotetaan overlay');
    overlayElement.style.opacity = '0';
    overlayVisible = false;
  }
}

// Päivitä overlay-teksti
function updateOverlayText(newText) {
  console.log('Video Overlay: Päivitetään teksti:', newText);
  overlayText = newText || 'Hello world!';
  
  if (overlayElement) {
    overlayElement.textContent = overlayText;
  }
  
  // Tallenna uusi teksti
  return { success: true, text: overlayText };
}

// Ota vastaan viestejä
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Video Overlay: Viesti vastaanotettu:', message);
  
  // Varmista, että overlay on alustettu
  if (!overlayInitialized) {
    createOverlay();
  }
  
  // Käsittele eri viestityypit
  if (message.action === 'updateText') {
    const result = updateOverlayText(message.text);
    console.log('Video Overlay: Teksti päivitetty, vastaus:', result);
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
      text: overlayText,
      videoFound: !!videoElement
    });
    return true;
  }
  
  // Tuntematon viestityyppi
  console.warn('Video Overlay: Tuntematon viestityyppi:', message.action);
  sendResponse({ success: false, error: 'Tuntematon toiminto' });
  return true;
});

// Lisää näppäimistön kuuntelija
document.addEventListener('keydown', function(event) {
  // CTRL + SHIFT + F3
  if (event.ctrlKey && event.shiftKey && event.keyCode === 114) {
    console.log('Video Overlay: Näppäinyhdistelmä havaittu (CTRL+SHIFT+F3)');
    showOverlay();
  }
});

// Alusta overlay
createOverlay();

// Lataa tallennettu teksti storage:sta
chrome.storage.sync.get('overlayText', function(data) {
  if (data.overlayText) {
    console.log('Video Overlay: Ladattu tallennettu teksti:', data.overlayText);
    updateOverlayText(data.overlayText);
  }
});

// Ilmoita alustuksesta taustaskriptille
chrome.runtime.sendMessage({
  type: 'contentScriptReady',
  url: window.location.href
});

// Diagnostiikka
console.log('Video Overlay: Content script alustettu - URL:', window.location.href); 