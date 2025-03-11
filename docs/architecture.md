# YouTube Overlay - Arkkitehtuuri

## Tekninen ympäristö

YouTube Overlay on rakennettu käyttäen Chrome Extension API:a ja puhdasta JavaScriptiä. Laajennuksessa ei käytetä ulkoisia kirjastoja tai riippuvuuksia.

### Teknologiapino

| Alue | Teknologia |
|------|------------|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Chrome Extension API (storage, messaging, scripting) |
| Pakkaus | Chrome Extension Manifest V3 |
| Tallennus | Chrome Storage API |

## Kansiorakenne

```
youtube-overlay/
│
├── dist/                       # Julkaisukansio laajennukselle
│   ├── icons/                  # Kuvakekansio
│   │   ├── icon16.png          # Laajennuksen kuvake (16x16px)
│   │   ├── icon48.png          # Laajennuksen kuvake (48x48px)
│   │   └── icon128.png         # Laajennuksen kuvake (128x128px)
│   │
│   ├── background.js           # Taustaskripti, joka hallinnoi viestien välitystä ja välilehtien tilaa
│   ├── content.js              # Sivuille injektoitava skripti, joka luo overlay-elementin
│   ├── content.css             # Overlay-elementin tyylit
│   ├── popup.html              # Popup-ikkunan HTML-rakenne
│   ├── popup.js                # Popup-ikkunan toiminnallisuus
│   └── manifest.json           # Laajennuksen määrittelytiedosto
│
├── src/                        # Lähdekoodikansio kehitystä varten
│   ├── background.js           # Taustaskriptin lähdekoodi
│   ├── content.js              # Content scriptin lähdekoodi
│   ├── content.css             # Tyylien lähdekoodi
│   ├── popup.html              # Popup-ikkunan HTML-rakenne
│   └── popup.js                # Popup-ikkunan JavaScript-lähdekoodi
│
├── README.md                   # Projektin päädokumentaatio
├── .gitignore                  # Git-versionhallinnan ohitustiedosto
├── package.json                # Projektin metatiedot
│
└── docs/                       # Dokumentaatiokansio
    ├── images/                 # Dokumentaation kuvat
    ├── readme.md               # Yleistietoa projektista
    ├── description.md          # Sovelluksen kuvaus ja käyttötarkoitus
    ├── architecture.md         # Arkkitehtuuri (tämä tiedosto)
    ├── frontend.md             # Käyttöliittymän kuvaus
    ├── backend.md              # Taustajärjestelmän kuvaus
    ├── datamodel.md            # Tietomallin kuvaus
    ├── todo.md                 # Tehtävälista
    ├── ai_changelog.md         # Muutoshistoria
    └── learnings.md            # Opitut asiat ja ratkaisut
```

## Arkkitehtuurin komponentit

### Manifest (manifest.json)

Chrome-laajennuksen määrittelytiedosto, joka sisältää:
- Laajennuksen metadatan (nimi, versio, kuvaus)
- Tarvittavat oikeudet (storage, tabs, scripting)
- Content scriptin määrittelyt (content.js, content.css)
- Background scriptin määrittelyt (background.js)
- Popup-ikkunan määrittelyt (popup.html)
- Host-oikeudet (youtube.com)

### Background Script (background.js) - V5.0

Taustaskripti, joka toimii laajennuksen "moottorina":
- Alustaa laajennuksen asennuksen yhteydessä
- Kuuntelee välilehtien muutoksia ja pitää kirjaa YouTube-välilehdistä
- **Injektoi content scriptin dynaamisesti tarvittaessa (V5.0)**
- Ylläpitää tilaa kaikista YouTube-välilehdistä
- Käsittelee viestejä popupilta ja content scriptiltä
- Välittää viestejä eri välilehtien välillä

```javascript
// V5.0: Dynaaminen content script injektointi
function injectContentScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content.js']
  }).then(() => {
    // Injektointi onnistui
    chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['content.css']
    });
    youtubeTabsState[tabId] = { injected: true };
    console.log('Background: Content script injektoitu välilehteen', tabId);
  }).catch(error => {
    // Käsittele virheet
    console.error('Background: Virhe injektoitaessa content scriptia:', error);
    youtubeTabsState[tabId] = { injected: false, error: error.message };
  });
}

// V5.0: Välilehtien tilan seuranta ja content script päivitys
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
    // YouTube-välilehti valmis, injektoi content script tarvittaessa
    if (!youtubeTabsState[tabId] || !youtubeTabsState[tabId].injected) {
      injectContentScript(tabId);
    }
  }
});

// V5.0: Viestinkäsittelijä
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'injectContentScript' && message.tabId) {
    // Popup pyytää content scriptin injektointia
    injectContentScript(message.tabId);
    sendResponse({ success: true });
    return true;
  }
  else if (message.type === 'contentScriptReady') {
    // Content script ilmoittaa olevansa valmis
    if (sender.tab) {
      youtubeTabsState[sender.tab.id] = { 
        injected: true, 
        ready: true,
        url: message.url
      };
    }
    sendResponse({ success: true });
    return true;
  }
  // Muut viestit...
});
```

### Content Script (content.js) - V5.0

Injektoidaan jokaiselle YouTube-sivulle joko automaattisesti manifestin määritysten mukaan tai dynaamisesti background scriptin toimesta:
- Luo ja hallitsee overlay-elementtiä
- Kuuntelee näppäinkomentoja (CTRL+SHIFT+F3)
- Käsittelee viestit popupilta ja background scriptiltä
- Tarjoaa API:n tilan kyselyyn ja päivityksiin
- Ilmoittaa latautumisestaan background scriptille

```javascript
// V5.0: Moduulimaisempi rakenne selkeillä komponenteilla
let overlayElement = null;
let overlayVisible = false;
let overlayText = 'Hello world!';
let overlayInitialized = false;

// V5.0: Merkki, että content script on aktiivinen
window.youtubeOverlayActive = true;

// V5.0: Paranneltu overlay-luonti
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
  overlayElement = document.createElement('div');
  
  // Tyylien asettaminen Object.assign-metodilla
  Object.assign(overlayElement.style, overlayStyles);
  
  overlayElement.textContent = overlayText;
  document.body.appendChild(overlayElement);
  
  overlayInitialized = true;
}

// V5.0: Kattava viestinkäsittely eri toiminnoille
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('YouTube Overlay: Viesti vastaanotettu:', message);
  
  if (!overlayInitialized) {
    createOverlay();
  }
  
  if (message.action === 'updateText') {
    const result = updateOverlayText(message.text);
    sendResponse(result);
    return true;
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
  sendResponse({ success: false, error: 'Tuntematon toiminto' });
  return true;
});

// V5.0: Ilmoita latautumisesta background scriptille
chrome.runtime.sendMessage({
  type: 'contentScriptReady',
  url: window.location.href
});
```

### Popup (popup.html, popup.js) - V5.0

Käyttöliittymä, joka avautuu kun käyttäjä klikkaa laajennuksen kuvaketta:
- Mahdollistaa tekstin muokkaamisen ja tallentamisen
- **Varmistaa content scriptin injektion ennen viestin lähetystä (V5.0)**
- Päivittää kaikki YouTube-välilehdet
- Käsittelee virhetilanteet ja näyttää statuksen käyttäjälle

```javascript
// V5.0: Päivitetty YouTube-välilehden päivitysfunktio, joka varmistaa injektion
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

// V5.0: Päivitetty tallennus, joka päivittää kaikki välilehdet
saveButton.addEventListener('click', function() {
  if (saveButton.disabled) return;
  
  const text = textInput.value || 'Hello world!';
  
  // Näytä latausanimaatio
  saveButton.disabled = true;
  const originalText = saveButton.textContent;
  saveButton.textContent = 'Tallennetaan...';
  
  // Tallenna storageen
  chrome.storage.sync.set({overlayText: text}, function() {
    // Päivitä kaikki YouTube-välilehdet
    chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
      if (tabs && tabs.length > 0) {
        console.log('Popup: Päivitetään', tabs.length, 'YouTube-välilehteä');
        
        // Päivitä jokainen välilehti
        let updateCount = 0;
        let errorCount = 0;
        
        tabs.forEach(function(tab) {
          updateYouTubeTab(tab.id, text, function(response) {
            // Käsittele vastaus
            // ...
          });
        });
      } else {
        // Ei avoimia YouTube-välilehtiä
        // ...
      }
    });
  });
});
```

## Tiedonkulku V5.0

1. **Content scriptin dynaaminen injektointi (V5.0)**:
   ```
   Background Script (välilehdessä havaitaan YouTube-sivu)
     │
     └──> chrome.scripting.executeScript (injektoi content.js)
            │
            └──> chrome.scripting.insertCSS (injektoi content.css)
                  │
                  └──> Content Script alustetaan
                        │
                        └──> Content Script lähettää 'contentScriptReady' viestin
                              │
                              └──> Background Script päivittää välilehden tilan
   ```

2. **Popup-lähtöinen päivitys, joka varmistaa injektion (V5.0)**:
   ```
   Popup (käyttäjä tallentaa tekstin)
     │
     ├──> Chrome Storage (tallentaa tekstin)
     │
     └──> Kaikille YouTube-välilehdille:
            │
            └──> Pyyntö Background Scriptille injektoida Content Script
                  │
                  └──> Kun injektointi on valmis, lähetä viesti Content Scriptille
                        │
                        └──> Content Script päivittää tekstin ja vastaa
                              │
                              └──> Popup näyttää päivityksen tuloksen käyttäjälle
   ```

3. **Näppäinkomennon käsittely**:
   ```
   Käyttäjä painaa CTRL+SHIFT+F3 YouTube-sivulla
     │
     └──> Content Script havaitsee näppäinyhdistelmän
            │
            └──> showOverlay() näyttää tekstin
                  │
                  └──> Teksti katoaa automaattisesti 3 sekunnin kuluttua
   ```

4. **Content scriptin tilan tarkistus (V5.0)**:
   ```
   Mikä tahansa komponentti haluaa tarkistaa Content Scriptin tilan
     │
     └──> Lähettää { action: 'getStatus' } -viestin
            │
            └──> Content Script vastaa tilallaan
                  │
                  └──> Lähettäjä voi reagoida tilatietoihin
   ```

## Turvallisuus ja suorituskyky

- Laajennuksen oikeudet on rajattu vain tarpeellisiin (storage, tabs, scripting, youtube.com)
- Dynaamisessa injektoinnissa käytetään Chrome Scripting API:a, joka on turvallisin tapa (V5.0)
- Virheellisten injektioiden käsittely (V5.0)
- Monivaiheinen viestintäjärjestelmä varmistaa toimivuuden eri tilanteissa (V5.0)
- Selkeä moduulirakenne helpottaa ylläpitoa ja kehitystä (V5.0)
- Optimoitu overlay-elementti käyttää CSS-transitioita sulavaan näkymiseen
- DOM-manipulaatio on minimoitu suorituskyvyn optimoimiseksi 