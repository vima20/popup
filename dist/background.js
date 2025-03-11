// Background script - YouTube Overlay (V5.0)
console.log('YouTube Overlay: Background script käynnistetty V5.0');

// Pidä kirjaa aktiivisista YouTube-välilehdistä
const youtubeTabsState = {};

// Varmista että background script on aktiivinen
keepAlive();

// Kuuntele asentamistapahtumaa
chrome.runtime.onInstalled.addListener(function() {
  console.log('Background: Laajennus asennettu/päivitetty');
  
  // Alusta oletusteksti
  chrome.storage.sync.get('overlayText', function(data) {
    if (!data.overlayText) {
      chrome.storage.sync.set({overlayText: 'Hello world!'}, function() {
        console.log('Background: Oletusteksti asetettu');
      });
    } else {
      console.log('Background: Oletusteksti jo asetettu:', data.overlayText);
    }
  });
  
  // Tarkista kaikki avoimet YouTube-välilehdet
  checkExistingTabs();
});

// Pidä service worker aktiivisena
function keepAlive() {
  setInterval(() => {
    console.log('Background: Ping - pidän service workerin aktiivisena');
  }, 20000);
}

// Kuuntele popup-viestejä
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background: Viesti vastaanotettu:', message);
  
  if (message.type === 'injectContentScript') {
    const tabId = message.tabId;
    
    console.log('Background: Injektoidaan content script välilehteen', tabId);
    
    // Yritä injetoida content script
    injectContentScript(tabId)
      .then(() => {
        console.log('Background: Content script injetoitu onnistuneesti');
        sendResponse({ success: true });
      })
      .catch(err => {
        console.error('Background: Virhe injetoitaessa content script:', err);
        sendResponse({ success: false, error: err.message });
      });
    
    return true; // Tärkeää async vastauksen takia
  }
});

// Kuuntele välilehtien päivityksiä
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Jos välilehti on YouTube ja valmis (complete)
  if (tab.url && tab.url.includes('youtube.com') && changeInfo.status === 'complete') {
    console.log('Background: YouTube-välilehti valmis:', tabId);
    
    // Seuraa välilehteä
    youtubeTabsState[tabId] = {
      url: tab.url,
      contentScriptInjected: false
    };
    
    // Injektoi content script varmuuden vuoksi
    injectContentScript(tabId)
      .then(() => {
        youtubeTabsState[tabId].contentScriptInjected = true;
        console.log('Background: Content script injetoitu välilehteen', tabId);
      })
      .catch(err => {
        console.error('Background: Virhe injetoitaessa content script välilehteen', tabId, ':', err);
      });
  }
});

// Kuuntele välilehtien sulkemista
chrome.tabs.onRemoved.addListener((tabId) => {
  if (youtubeTabsState[tabId]) {
    console.log('Background: YouTube-välilehti suljettu:', tabId);
    delete youtubeTabsState[tabId];
  }
});

// Tarkista kaikki olemassa olevat välilehdet
function checkExistingTabs() {
  chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
    console.log('Background: Löytyi', tabs.length, 'YouTube-välilehteä');
    
    tabs.forEach(function(tab) {
      // Seuraa välilehteä
      youtubeTabsState[tab.id] = {
        url: tab.url,
        contentScriptInjected: false
      };
      
      // Injektoi content script
      injectContentScript(tab.id)
        .then(() => {
          youtubeTabsState[tab.id].contentScriptInjected = true;
          console.log('Background: Content script injetoitu välilehteen', tab.id);
        })
        .catch(err => {
          console.error('Background: Virhe injetoitaessa content script välilehteen', tab.id, ':', err);
        });
    });
  });
}

// Injektoi content script välilehteen
function injectContentScript(tabId) {
  return new Promise((resolve, reject) => {
    // Injektoi yksinkertainen kuuntelija skripti
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: setupMessageListener,
    })
    .then(() => {
      console.log('Background: Viestikuuntelija injetoitu välilehteen', tabId);
      resolve();
    })
    .catch(err => {
      console.error('Background: Virhe injetoitaessa skriptiä:', err);
      reject(err);
    });
  });
}

// Tämä funktio suoritetaan kohdesivu-kontekstissa
function setupMessageListener() {
  // Tarkista, onko kuuntelija jo rekisteröity
  if (window.youtubeOverlayInitialized) {
    console.log('Content (injected): Alustus jo tehty');
    return;
  }
  
  // Merkitse alustus tehdyksi
  window.youtubeOverlayInitialized = true;
  
  console.log('Content (injected): Alustetaan overlay...');
  
  // Overlay-elementti
  let overlayElement = null;
  let overlayVisible = false;
  let overlayText = 'Hello world!';
  
  // Rekisteröi viestin kuuntelija
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log('Content (injected): Viesti vastaanotettu:', request);
      
      try {
        // Käsittele viesti
        if (request.action === 'updateText') {
          overlayText = request.text || 'Hello world!';
          showOverlay(overlayText);
          console.log('Content (injected): Teksti päivitetty:', overlayText);
          sendResponse({success: true, received: true});
        } else if (request.action === 'toggleOverlay') {
          toggleOverlay();
          sendResponse({success: true, received: true});
        } else {
          sendResponse({success: true, received: true, message: 'Tuntematon toiminto'});
        }
      } catch (e) {
        console.error('Content (injected): Virhe:', e);
        sendResponse({success: false, error: e.message});
      }
      
      return true; // Tärkeä asynkronisille vastauksille
    }
  );
  
  // Luo overlay
  function createOverlay() {
    if (overlayElement) return;
    
    overlayElement = document.createElement('div');
    overlayElement.id = 'youtube-overlay-extension';
    overlayElement.style.position = 'fixed';
    overlayElement.style.top = '50%';
    overlayElement.style.left = '50%';
    overlayElement.style.transform = 'translate(-50%, -50%)';
    overlayElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlayElement.style.color = 'white';
    overlayElement.style.padding = '20px';
    overlayElement.style.borderRadius = '10px';
    overlayElement.style.zIndex = '9999999';
    overlayElement.style.opacity = '0';
    overlayElement.style.transition = 'opacity 0.3s ease';
    overlayElement.style.fontSize = '24px';
    overlayElement.style.fontWeight = 'bold';
    overlayElement.style.pointerEvents = 'none';
    overlayElement.style.textAlign = 'center';
    
    overlayElement.textContent = overlayText;
    
    document.body.appendChild(overlayElement);
    console.log('Content (injected): Overlay luotu');
  }
  
  // Näytä overlay
  function showOverlay(text) {
    if (!document.body) {
      console.log('Content (injected): document.body ei vielä saatavilla');
      setTimeout(() => showOverlay(text), 200);
      return;
    }
    
    if (!overlayElement) {
      createOverlay();
    }
    
    if (text) {
      overlayElement.textContent = text;
    }
    
    overlayElement.style.opacity = '1';
    overlayVisible = true;
    
    // Piilota automaattisesti 3 sekunnin kuluttua
    setTimeout(() => {
      if (overlayElement) {
        overlayElement.style.opacity = '0';
        overlayVisible = false;
      }
    }, 3000);
    
    console.log('Content (injected): Overlay näytetty');
  }
  
  // Näytä/piilota overlay
  function toggleOverlay() {
    if (!document.body) {
      console.log('Content (injected): document.body ei vielä saatavilla');
      setTimeout(toggleOverlay, 200);
      return;
    }
    
    if (!overlayElement) {
      createOverlay();
    }
    
    overlayVisible = !overlayVisible;
    overlayElement.style.opacity = overlayVisible ? '1' : '0';
    console.log('Content (injected): Overlay näkyvyys:', overlayVisible ? 'näkyvissä' : 'piilotettu');
  }
  
  // Kuuntele näppäinkomentoa (CTRL + SHIFT + F3)
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.code === 'F3') {
      console.log('Content (injected): CTRL+SHIFT+F3 painettu');
      toggleOverlay();
    }
  });
  
  // Lataa tallennettu teksti
  chrome.storage.sync.get('overlayText', function(data) {
    if (data.overlayText) {
      overlayText = data.overlayText;
      console.log('Content (injected): Teksti ladattu storagesta:', overlayText);
    }
  });
  
  console.log('Content (injected): YouTube Overlay alustettu onnistuneesti');
} 