// Background script - Video Overlay (V6.0)
console.log('Video Overlay: Background script käynnistetty V6.0');

// Pidä kirjaa aktiivisista video-välilehdistä
const videoTabsState = {};

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
  
  // Tarkista kaikki avoimet välilehdet
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
  // Jos välilehti on valmis (complete)
  if (changeInfo.status === 'complete') {
    console.log('Background: Välilehti valmis:', tabId);
    
    // Seuraa välilehteä
    videoTabsState[tabId] = {
      url: tab.url,
      contentScriptInjected: false
    };
    
    // Injektoi content script varmuuden vuoksi
    injectContentScript(tabId)
      .then(() => {
        videoTabsState[tabId].contentScriptInjected = true;
        console.log('Background: Content script injetoitu välilehteen', tabId);
      })
      .catch(err => {
        console.error('Background: Virhe injetoitaessa content script välilehteen', tabId, ':', err);
      });
  }
});

// Kuuntele välilehtien sulkemista
chrome.tabs.onRemoved.addListener((tabId) => {
  if (videoTabsState[tabId]) {
    console.log('Background: Välilehti suljettu:', tabId);
    delete videoTabsState[tabId];
  }
});

// Tarkista kaikki olemassa olevat välilehdet
function checkExistingTabs() {
  chrome.tabs.query({}, function(tabs) {
    console.log('Background: Löytyi', tabs.length, 'välilehteä');
    
    tabs.forEach(function(tab) {
      // Seuraa välilehteä
      videoTabsState[tab.id] = {
        url: tab.url,
        contentScriptInjected: false
      };
      
      // Injektoi content script
      injectContentScript(tab.id)
        .then(() => {
          videoTabsState[tab.id].contentScriptInjected = true;
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
  if (window.videoOverlayInitialized) {
    console.log('Content (injected): Alustus jo tehty');
    return;
  }
  
  // Merkitse alustus tehdyksi
  window.videoOverlayInitialized = true;
  
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
    overlayElement.id = 'video-overlay-extension';
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
    
    if (overlayVisible) {
      overlayElement.style.opacity = '0';
      overlayVisible = false;
    } else {
      overlayElement.style.opacity = '1';
      overlayVisible = true;
    }
    
    console.log('Content (injected): Overlay vaihdettu:', overlayVisible ? 'näkyviin' : 'piiloon');
  }
  
  // Lisää näppäimistön kuuntelija
  document.addEventListener('keydown', function(event) {
    // CTRL + SHIFT + F3
    if (event.ctrlKey && event.shiftKey && event.keyCode === 114) {
      console.log('Content (injected): Näppäinyhdistelmä havaittu (CTRL+SHIFT+F3)');
      toggleOverlay();
    }
  });
  
  // Luo overlay heti kun mahdollista
  if (document.body) {
    createOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', createOverlay);
  }
} 