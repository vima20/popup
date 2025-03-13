// Content script - YouTube Overlay
console.log('YouTube Overlay: Content script ladattu - versio 2.2');

// Globaalit muuttujat
let overlayElement = null;
let overlayVisible = false;
let overlayText = "Hello world!";
let overlayInitialized = false;

// Overlay-tyylit
const overlayStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '20px',
  borderRadius: '10px',
  zIndex: '9999999',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  pointerEvents: 'none',
  maxWidth: '80%'
};

// Luo overlay heti kun DOM on valmis
function createOverlay() {
  // Jos overlay on jo luotu, älä tee mitään
  if (overlayElement && document.body.contains(overlayElement)) {
    console.log('Content: Overlay on jo olemassa, ei luoda uudelleen');
    return overlayElement;
  }
  
  // Varmista että body on olemassa
  if (!document.body) {
    console.log('Content: document.body ei ole vielä saatavilla, odotetaan');
    return null;
  }
  
  console.log('Content: Luodaan overlay elementti');
  
  try {
    // Luo uusi overlay elementti
    overlayElement = document.createElement('div');
    overlayElement.id = 'youtube-overlay-extension';
    
    // Aseta tyylit
    Object.assign(overlayElement.style, overlayStyles);
    
    // Aseta teksti
    overlayElement.textContent = overlayText;
    
    // Aluksi piilotettu
    overlayElement.style.opacity = '0';
    overlayElement.style.transition = 'opacity 0.3s ease';
    
    // Lisää DOM:iin
    document.body.appendChild(overlayElement);
    console.log('Content: Overlay luotu ja lisätty dokumenttiin');
    overlayInitialized = true;
    
    return overlayElement;
  } catch (e) {
    console.error('Content: Virhe luodessa overlayta:', e);
    return null;
  }
}

// Päivitä overlay teksti
function updateOverlayText(text) {
  console.log('Content: Päivitetään overlay teksti:', text);
  
  // Tallenna teksti muistiin
  overlayText = text || 'Hello world!';
  
  try {
    // Jos overlay elementtiä ei ole, luo se
    if (!overlayElement || !document.body.contains(overlayElement)) {
      createOverlay();
    }
    
    // Päivitä teksti
    if (overlayElement && document.body.contains(overlayElement)) {
      overlayElement.textContent = overlayText;
      console.log('Content: Teksti päivitetty onnistuneesti');
      
      // Jos overlay on näkyvissä, varmista että se näkyy
      if (overlayVisible) {
        overlayElement.style.opacity = '1';
      }
      
      return true;
    } else {
      console.error('Content: Tekstin päivitys epäonnistui, elementtiä ei luotu');
      return false;
    }
  } catch (e) {
    console.error('Content: Virhe päivitettäessä tekstiä:', e);
    return false;
  }
}

// Näytä/piilota overlay
function toggleOverlay(show) {
  console.log('Content: Vaihdetaan overlay näkyvyyttä, show:', show);
  
  try {
    // Varmista että overlay on luotu
    if (!overlayElement || !document.body.contains(overlayElement)) {
      overlayElement = createOverlay();
      
      if (!overlayElement) {
        console.error('Content: Overlay elementtiä ei voitu luoda');
        return false;
      }
    }
    
    // Jos funktiolle annetaan parametri, käytä sitä, muuten vaihda tila
    if (show !== undefined) {
      overlayVisible = show;
    } else {
      overlayVisible = !overlayVisible;
    }
    
    // Päivitä näkyvyys
    overlayElement.style.opacity = overlayVisible ? '1' : '0';
    console.log('Content: Overlay näkyvyys:', overlayVisible ? 'näkyvissä' : 'piilotettu');
    return true;
  } catch (e) {
    console.error('Content: Virhe togglessä:', e);
    return false;
  }
}

// Siivoa elementit pois
function cleanup() {
  if (overlayElement && document.body.contains(overlayElement)) {
    document.body.removeChild(overlayElement);
    overlayElement = null;
    console.log('Content: Overlay poistettu');
  }
}

// Varmista että overlay on aina olemassa MutationObserverin avulla
function monitorDOM() {
  // Jos overlay on poistettu, luo se uudelleen
  if (document.body && (!overlayElement || !document.body.contains(overlayElement))) {
    createOverlay();
  }
}

// Varmista että DOM on valmis
function domReadyCheck() {
  if (document.body) {
    console.log('Content: DOM on valmis, alustetaan overlay');
    createOverlay();
    
    // Tarkista säännöllisesti onko overlay vielä DOM:issa
    setInterval(function() {
      if (overlayInitialized && (!overlayElement || !document.body.contains(overlayElement))) {
        console.log('Content: Overlay puuttuu DOM:ista, luodaan uudelleen');
        createOverlay();
      }
    }, 2000);
  } else {
    console.log('Content: DOM ei vielä valmis, odotetaan...');
    setTimeout(domReadyCheck, 100);
  }
}

// Kuuntele näppäinkomentoa (CTRL + SHIFT + F3)
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.code === 'F3') {
    console.log('Content: CTRL+SHIFT+F3 painettu');
    toggleOverlay();
  }
});

// Kuuntele viestejä popupilta/background scriptiltä
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Content: Viesti vastaanotettu:', message);
  
  try {
    // Varmista että overlay on alustettu
    if (!overlayInitialized) {
      createOverlay();
    }
    
    // Käsittele viesti
    if (message.action === 'updateText') {
      const success = updateOverlayText(message.text);
      console.log('Content: updateText suoritettu, tulos:', success);
      sendResponse({
        success: success,
        visible: overlayVisible,
        elementExists: !!overlayElement && document.body.contains(overlayElement)
      });
      return true; // Tärkeä, jotta vastaus lähetetään oikein
    }
    
    if (message.action === 'toggleOverlay') {
      const success = toggleOverlay(message.show);
      console.log('Content: toggleOverlay suoritettu, tulos:', success);
      sendResponse({
        success: success,
        visible: overlayVisible,
        elementExists: !!overlayElement && document.body.contains(overlayElement)
      });
      return true;
    }
    
    if (message.action === 'status') {
      sendResponse({
        exists: !!overlayElement && document.body.contains(overlayElement),
        visible: overlayVisible,
        text: overlayText,
        initialized: overlayInitialized
      });
      return true;
    }
    
    // Tuntematon viesti
    console.warn('Content: Tuntematon viesti:', message);
    sendResponse({success: false, error: 'unknown_action'});
  } catch (error) {
    console.error('Content: Virhe käsiteltäessä viestiä:', error);
    sendResponse({success: false, error: error.message});
  }
  
  return true; // Tärkeä, jotta vastaus lähetetään oikein
});

// Kuuntele storage muutoksia
chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log('Content: Storage muutos havaittu:', changes);
  
  if (namespace === 'sync' && changes.overlayText) {
    console.log('Content: Overlay tekstiä päivitetään storagesta:', changes.overlayText.newValue);
    updateOverlayText(changes.overlayText.newValue);
  }
});

// Lataa tallennettu teksti
chrome.storage.sync.get('overlayText', function(data) {
  console.log('Content: Ladataan tallennettu teksti:', data);
  if (data.overlayText) {
    updateOverlayText(data.overlayText);
  }
});

// Aloita DOM ready tarkistus
console.log('Content: Aloitetaan DOM ready tarkistus');
domReadyCheck();

// Varmista että overlay luodaan myös DOMContentLoaded-tapahtumassa
document.addEventListener('DOMContentLoaded', function() {
  console.log('Content: DOMContentLoaded tapahtuma havaittu');
  if (!overlayInitialized) {
    createOverlay();
  }
});

console.log('Content: YouTube Overlay content script alustettu'); 