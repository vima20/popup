// Video Overlay - Simple Content Script (V6.6)
console.log('Video Overlay: Content script käynnistetty V6.6');

// Globaalit muuttujat
let overlayElement = null;
let overlayVisible = false;
let overlayText = 'Hello world!'; // Oletusteksti
let hideTimeout = null;
let lastKeyPress = 0;

// Luo overlay-elementti
function createOverlay() {
  try {
    const existingOverlay = document.getElementById('video-overlay-extension');
    if (existingOverlay) existingOverlay.remove();

    overlayElement = document.createElement('div');
    overlayElement.id = 'video-overlay-extension';
    overlayElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 9999999;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-size: 24px;
      font-weight: bold;
      pointer-events: none;
      text-align: center;
      max-width: 80%;
      word-wrap: break-word;
    `;
    overlayElement.textContent = overlayText;
    document.body.appendChild(overlayElement);
    return true;
  } catch (error) {
    console.error('Virhe overlayn luonnissa:', error);
    return false;
  }
}

// Näytä overlay
function showOverlay() {
  if (!overlayText) return;

  try {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    if (!overlayElement || !document.body.contains(overlayElement)) {
      if (!createOverlay()) return;
    }

    overlayElement.textContent = overlayText;
    overlayElement.style.opacity = '1';
    overlayVisible = true;

    hideTimeout = setTimeout(hideOverlay, 3000);
  } catch (error) {
    console.error('Virhe overlayn näyttämisessä:', error);
  }
}

// Piilota overlay
function hideOverlay() {
  try {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    if (overlayElement) {
      overlayElement.style.opacity = '0';
      overlayVisible = false;

      setTimeout(() => {
        if (overlayElement && !overlayVisible) {
          overlayElement.remove();
          overlayElement = null;
        }
      }, 300); // Odota transitionin loppuun
    }
  } catch (error) {
    console.error('Virhe overlayn piilottamisessa:', error);
  }
}

// Kuuntele viestejä (esim. popupista)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'updateText' && request.text && request.text.trim() !== '') {
      overlayText = request.text;
      showOverlay();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Tuntematon toiminto tai tyhjä teksti' });
    }
  } catch (error) {
    console.error('Virhe viestin käsittelyssä:', error);
    sendResponse({ success: false, error: error.message });
  }
  return true;
});

// Kuuntele näppäinkomentoa (Ctrl+Shift+F3)
document.addEventListener('keydown', (e) => {
  try {
    if (e.ctrlKey && e.shiftKey && e.key === 'F3') {
      e.preventDefault();

      const now = Date.now();
      if (now - lastKeyPress < 100) return; // Estä nopeat peräkkäiset painallukset
      lastKeyPress = now;

      console.log('Näppäinyhdistelmä havaittu: CTRL+SHIFT+F3');

      if (overlayVisible) {
        hideOverlay();
      } else {
        showOverlay();
      }
    }
  } catch (error) {
    console.error('Virhe näppäinkomennon käsittelyssä:', error);
  }
});

// Alusta overlay, jos document.body on jo saatavilla
if (document.body) {
  createOverlay();
} else {
  document.addEventListener('DOMContentLoaded', createOverlay);
}

// Ilmoita latauksesta
try {
  chrome.runtime.sendMessage({ type: 'contentScriptLoaded' });
} catch (error) {
  console.error('Virhe latauksen ilmoituksessa:', error);
}