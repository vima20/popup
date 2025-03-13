// Popup script - Video Overlay
console.log('Video Overlay: Popup script ladattu - V6.0');

document.addEventListener('DOMContentLoaded', function() {
  // Haetaan UI elementit
  const textInput = document.getElementById('overlayText');
  const saveButton = document.getElementById('saveButton');
  const debugButton = document.getElementById('debugButton');
  const statusDiv = document.getElementById('status');
  
  // Lataa tallennettu teksti
  loadSavedText();
  
  // Lataus-funktio
  function loadSavedText() {
    chrome.storage.sync.get('overlayText', function(data) {
      if (data.overlayText) {
        textInput.value = data.overlayText;
        console.log('Popup: Ladattu tallennettu teksti:', data.overlayText);
      }
    });
  }
  
  // Näytä tilaviesti käyttäjälle
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + (type || 'info');
    
    console.log('Popup: Tila:', type, message);
    
    // Automaattinen tyhjennys 3 sekunnin jälkeen
    setTimeout(function() {
      if (statusDiv.textContent === message) {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
      }
    }, 3000);
  }
  
  // Tarkista onko välilehti video-sivu
  function isVideoTab(tab) {
    return tab && tab.url && tab.url.includes('video');
  }
  
  // Debug-nappi testaukseen
  debugButton.addEventListener('click', function() {
    console.log('Popup: Debug-nappia painettu');
    
    // Näytä latausanimaatio
    debugButton.disabled = true;
    const originalText = debugButton.textContent;
    debugButton.textContent = 'Testataan...';
    
    try {
      // Hae aktiivinen välilehti
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs || !tabs.length) {
          console.error('Popup: Ei aktiivista välilehteä!');
          showStatus('Ei aktiivista välilehteä!', 'error');
          debugButton.disabled = false;
          debugButton.textContent = originalText;
          return;
        }
        
        const activeTab = tabs[0];
        console.log('Popup: Aktiivinen välilehti:', activeTab.url);
        
        if (!isVideoTab(activeTab)) {
          console.warn('Popup: Ei video-välilehti!');
          showStatus('Avaa video-sivu ensin!', 'error');
          debugButton.disabled = false;
          debugButton.textContent = originalText;
          return;
        }
        
        const text = textInput.value || 'Hello world!';
        const testText = text + ' (testi ' + new Date().toLocaleTimeString() + ')';
        
        console.log('Popup: Lähetetään testipäivitys:', testText);
        showStatus('Lähetetään testipäivitys...', 'info');
        
        // Tallenna ensin storageen
        chrome.storage.sync.set({overlayText: testText}, function() {
          if (chrome.runtime.lastError) {
            console.error('Popup: Virhe tallentaessa storageen:', chrome.runtime.lastError.message);
            showStatus('Virhe tallentaessa asetuksia: ' + chrome.runtime.lastError.message, 'error');
            debugButton.disabled = false;
            debugButton.textContent = originalText;
            return;
          }
          
          console.log('Popup: Testi tallennettu storageen');
          
          // Suora viesti content scriptille - yksinkertaisempi toteutus
          setTimeout(() => {
            try {
              chrome.tabs.sendMessage(
                activeTab.id,
                { action: 'updateText', text: testText },
                function(response) {
                  debugButton.disabled = false;
                  debugButton.textContent = originalText;
                  
                  if (chrome.runtime.lastError) {
                    const errorMsg = chrome.runtime.lastError.message;
                    console.error('Popup: Content script virhe:', errorMsg);
                    showStatus('Content script ei vastaa: ' + errorMsg, 'error');
                    return;
                  }
                  
                  if (response && response.received) {
                    console.log('Popup: Viesti vastaanotettu content scriptissä:', response);
                    showStatus('Testi onnistui! Paina CTRL+SHIFT+F3 nähdäksesi teksti.', 'success');
                  } else {
                    console.error('Popup: Epäselvä vastaus content scriptiltä');
                    showStatus('Epäselvä vastaus content scriptiltä', 'error');
                  }
                }
              );
            } catch (e) {
              console.error('Popup: Virhe viestin lähetyksessä:', e);
              showStatus('Virhe viestin lähetyksessä: ' + e.message, 'error');
              debugButton.disabled = false;
              debugButton.textContent = originalText;
            }
          }, 100);
        });
      });
    } catch (e) {
      console.error('Popup: Poikkeus debug-toiminnossa:', e);
      showStatus('Virhe: ' + e.message, 'error');
      debugButton.disabled = false;
      debugButton.textContent = originalText;
    }
  });
  
  // Tallenna-nappi
  saveButton.addEventListener('click', function() {
    if (saveButton.disabled) return;
    
    console.log('Popup: Tallenna-nappia painettu');
    const text = textInput.value || 'Hello world!';
    
    // Näytä latausanimaatio
    saveButton.disabled = true;
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Tallennetaan...';
    
    // Tallenna storageen
    chrome.storage.sync.set({overlayText: text}, function() {
      if (chrome.runtime.lastError) {
        console.error('Popup: Virhe tallentaessa storageen:', chrome.runtime.lastError.message);
        showStatus('Virhe tallentaessa: ' + chrome.runtime.lastError.message, 'error');
        saveButton.disabled = false;
        saveButton.textContent = originalText;
        return;
      }
      
      console.log('Popup: Teksti tallennettu storageen:', text);
      showStatus('Tallennettu! Paina CTRL+SHIFT+F3 nähdäksesi teksti.', 'success');
      saveButton.disabled = false;
      saveButton.textContent = originalText;
    });
  });
}); 