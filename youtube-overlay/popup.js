// Popup script - YouTube Overlay
console.log('YouTube Overlay: Popup script ladattu - V2.1');

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
    
    // Automaattinen tyhjennys 3 sekunnin jälkeen
    setTimeout(function() {
      if (statusDiv.textContent === message) {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
      }
    }, 3000);
  }
  
  // Tarkista onko välilehti YouTube
  function isYouTubeTab(tab) {
    return tab && tab.url && tab.url.includes('youtube.com');
  }
  
  // Debug-nappi testaukseen
  debugButton.addEventListener('click', function() {
    console.log('Popup: Debug-nappia painettu');
    
    // Näytä latausanimaatio
    debugButton.disabled = true;
    const originalText = debugButton.textContent;
    debugButton.textContent = 'Testataan...';
    
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
      
      if (!isYouTubeTab(activeTab)) {
        console.warn('Popup: Ei YouTube-välilehti!');
        showStatus('Avaa YouTube-sivu ensin!', 'error');
        debugButton.disabled = false;
        debugButton.textContent = originalText;
        return;
      }
      
      const text = textInput.value || 'Hello world!';
      const testText = text + ' (testi ' + new Date().toLocaleTimeString() + ')';
      
      console.log('Popup: Lähetetään testipäivitys:', testText);
      showStatus('Lähetetään testipäivitys...', 'info');
      
      // Tallenna ensin storageen (tämä toimii aina)
      chrome.storage.sync.set({overlayText: testText}, function() {
        console.log('Popup: Testi tallennettu storageen');
        
        // Lähetä sitten suora viesti content scriptille
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: 'updateText', text: testText },
          function(response) {
            debugButton.disabled = false;
            debugButton.textContent = originalText;
            
            // Tarkistetaan vastaus
            if (chrome.runtime.lastError) {
              // Content script ei ole latautunut tai muu virhe
              const errorMsg = chrome.runtime.lastError.message;
              console.error('Popup: Content script virhe:', errorMsg);
              showStatus('Content script ei vastaa: ' + errorMsg, 'error');
              return;
            }
            
            // Tarkista vastaus
            if (!response) {
              console.error('Popup: Ei vastausta content scriptiltä');
              showStatus('Ei vastausta content scriptiltä', 'error');
              return;
            }
            
            if (response.success) {
              console.log('Popup: Testi onnistui:', response);
              showStatus('Testi onnistui! Paina CTRL+SHIFT+F3 nähdäksesi overlay.', 'success');
            } else {
              console.error('Popup: Testi epäonnistui:', response);
              showStatus(response.error || 'Testi epäonnistui!', 'error');
            }
          }
        );
      });
    });
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
      console.log('Popup: Teksti tallennettu storageen:', text);
      
      // Yritä päivittää aktiivinen YouTube-välilehti
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs && tabs.length ? tabs[0] : null;
        
        // Tarkista onko aktiivinen välilehti YouTube
        if (activeTab && isYouTubeTab(activeTab)) {
          // Lähetä viesti content scriptille
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: 'updateText', text: text },
            function(response) {
              // Ohita virheet - tärkeintä on että storageen tallentaminen onnistui
              if (chrome.runtime.lastError) {
                console.log('Popup: Content script ei vastaa:', chrome.runtime.lastError.message);
              }
            }
          );
        }
        
        // Lähetä viesti background scriptille, että päivittää kaikki YouTube-välilehdet
        chrome.runtime.sendMessage(
          { type: 'updateAllTabs', text: text },
          function(response) {
            // Ohita virheet - tärkeintä on että storageen tallentaminen onnistui
            if (chrome.runtime.lastError) {
              console.log('Popup: Background script ei vastaa:', chrome.runtime.lastError.message);
            }
          }
        );
        
        // Näytä onnistumisviesti ja palauta nappi
        saveButton.disabled = false;
        saveButton.textContent = originalText;
        showStatus('Tallennettu! Paina CTRL+SHIFT+F3 nähdäksesi overlay.', 'success');
      });
    });
  });
}); 