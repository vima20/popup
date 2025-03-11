// Popup script - YouTube Overlay
console.log('YouTube Overlay: Popup script ladattu - V5.0');

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
  
  // Tarkista onko välilehti YouTube
  function isYouTubeTab(tab) {
    return tab && tab.url && tab.url.indexOf('youtube.com') !== -1;
  }
  
  // Päivitä YouTube-välilehden teksti
  function updateYouTubeTab(tabId, text, callback) {
    console.log('Popup: Päivitetään YouTube-välilehden', tabId, 'teksti:', text);
    
    // Varmista että content script on injekoitu
    chrome.runtime.sendMessage(
      { type: 'injectContentScript', tabId: tabId },
      function(injectResponse) {
        console.log('Popup: Content script injektointi vastaus:', injectResponse);
        
        // Odota hetki ennen viestin lähetystä
        setTimeout(() => {
          // Lähetä viesti content scriptille
          try {
            chrome.tabs.sendMessage(
              tabId,
              { action: 'updateText', text: text },
              function(response) {
                if (chrome.runtime.lastError) {
                  console.error('Popup: Content script virhe:', chrome.runtime.lastError.message);
                  
                  if (callback) {
                    callback({
                      success: false,
                      error: chrome.runtime.lastError.message
                    });
                  }
                  return;
                }
                
                console.log('Popup: Content script vastaus:', response);
                
                if (callback) {
                  callback(response || { success: true });
                }
              }
            );
          } catch (error) {
            console.error('Popup: Virhe viestin lähetyksessä:', error);
            
            if (callback) {
              callback({
                success: false,
                error: error.message
              });
            }
          }
        }, 300);
      }
    );
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
          
          // Päivitä aktiivisen välilehden teksti
          updateYouTubeTab(activeTab.id, testText, function(response) {
            debugButton.disabled = false;
            debugButton.textContent = originalText;
            
            if (!response || !response.success) {
              const errorMsg = response && response.error ? response.error : 'Tuntematon virhe';
              console.error('Popup: Päivitys epäonnistui:', errorMsg);
              showStatus('Päivitys epäonnistui: ' + errorMsg, 'error');
              return;
            }
            
            console.log('Popup: Päivitys onnistui:', response);
            showStatus('Testi onnistui! Paina CTRL+SHIFT+F3 nähdäksesi teksti.', 'success');
          });
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
      
      // Päivitä kaikki YouTube-välilehdet
      chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
        if (tabs && tabs.length > 0) {
          console.log('Popup: Päivitetään', tabs.length, 'YouTube-välilehteä');
          
          // Päivitä jokainen välilehti
          let updateCount = 0;
          let errorCount = 0;
          
          tabs.forEach(function(tab) {
            updateYouTubeTab(tab.id, text, function(response) {
              if (response && response.success) {
                updateCount++;
                console.log('Popup: Välilehti', tab.id, 'päivitetty');
              } else {
                errorCount++;
                console.error('Popup: Välilehti', tab.id, 'päivitys epäonnistui');
              }
              
              // Jos kaikki välilehdet on käsitelty, näytä tulos
              if (updateCount + errorCount === tabs.length) {
                saveButton.disabled = false;
                saveButton.textContent = originalText;
                
                if (updateCount > 0) {
                  showStatus('Tallennettu ja päivitetty ' + updateCount + ' välilehteä!', 'success');
                } else {
                  showStatus('Tallennettu! Paina CTRL+SHIFT+F3 nähdäksesi teksti.', 'success');
                }
              }
            });
          });
        } else {
          saveButton.disabled = false;
          saveButton.textContent = originalText;
          showStatus('Tallennettu! Paina CTRL+SHIFT+F3 nähdäksesi teksti.', 'success');
        }
      });
    });
  });
}); 