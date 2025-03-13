# YouTube Overlay - Backend-toiminnallisuus

## Yleiskatsaus

YouTube Overlay -laajennuksen "backend"-toiminnallisuus toteutetaan Chrome Extension API:n avulla. Vaikka perinteistä palvelinpuolta ei ole, background script toimii eräänlaisena backend-komponenttina, joka välittää viestejä, hallinnoi tallennusta ja koordinoi eri komponenttien toimintaa.

## Background Script

Background script (background.js) toimii sovelluksen "moottorina" ja vastaa seuraavista toiminnoista:

1. Laajennuksen alustus ja oletusarvojen määrittely
2. Viestien välitys eri välilehtien välillä
3. YouTube-välilehtien etsiminen ja päivittäminen
4. Storage-operaatioiden keskitetty hallinta

### Käynnistys ja alustus

```javascript
// Kuuntele asentamistapahtumaa
chrome.runtime.onInstalled.addListener(function() {
  console.log('Background: Laajennus asennettu/päivitetty');
  
  // Alusta oletusteksti
  chrome.storage.sync.get('overlayText', function(data) {
    // Jos tekstiä ei ole vielä asetettu, aseta oletusteksti
    if (!data.overlayText) {
      chrome.storage.sync.set({overlayText: 'Hello world!'}, function() {
        console.log('Background: Oletusteksti asetettu');
      });
    } else {
      console.log('Background: Oletusteksti jo asetettu:', data.overlayText);
    }
  });
});
```

### Storage-muutosten kuuntelu

```javascript
// Kuuntele storage muutoksia ja päivitä kaikkia välilehtiä
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.overlayText) {
    console.log('Background: Storage muutos havaittu:', changes.overlayText.newValue);
    
    // Päivitä kaikki YouTube-välilehdet
    updateAllYouTubeTabs(changes.overlayText.newValue, function(result) {
      console.log('Background: Päivitys valmis, tulos:', result);
    });
  }
});
```

### Viestien vastaanotto

```javascript
// Kuuntele viestejä popupilta
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Background: Viesti vastaanotettu:', message, 'lähettäjä:', sender?.tab?.url || 'ei välilehteä');
  
  try {
    if (message.type === 'updateAllTabs') {
      console.log('Background: Päivitetään kaikki YouTube-välilehdet');
      
      // Päivitä kaikki YouTube-välilehdet
      updateAllYouTubeTabs(message.text, function(result) {
        console.log('Background: Päivitys valmis, vastaus:', result);
        try {
          sendResponse(result);
        } catch (e) {
          console.error('Background: Virhe lähettäessä vastausta:', e);
        }
      });
      
      // Ilmoita että vastaus lähetetään asynkronisesti
      return true;
    }
    
    // Jos viestityyppi ei ole tunnettu
    console.warn('Background: Tuntematon viestityyppi:', message.type);
    sendResponse({success: false, error: 'Tuntematon viestityyppi'});
  } catch (e) {
    console.error('Background: Virhe viestin käsittelyssä:', e);
    sendResponse({success: false, error: e.message});
  }
  
  return false;
});
```

### Välilehtien päivitys

```javascript
// Päivitä kaikkien YouTube-välilehtien teksti
function updateAllYouTubeTabs(text, callback) {
  console.log('Background: Päivitetään kaikki YouTube-välilehdet tekstillä:', text);
  
  if (!callback || typeof callback !== 'function') {
    callback = function() {};
  }
  
  // Etsi kaikki YouTube-välilehdet
  chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
    console.log('Background: YouTube-välilehtiä löytyi:', tabs.length);
    
    if (tabs.length === 0) {
      callback({success: true, updated: 0, total: 0, message: 'Ei avoimia YouTube-välilehtiä'});
      return;
    }
    
    let updatedCount = 0;
    let errorCount = 0;
    let pendingCount = tabs.length;
    
    // Lähetä päivitysviesti jokaiselle välilehdelle
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      
      try {
        chrome.tabs.sendMessage(tab.id, {
          action: 'updateText',
          text: text
        }, function(response) {
          pendingCount--;
          
          if (chrome.runtime.lastError) {
            console.warn('Background: Virhe välilehdellä', tab.id, ':', chrome.runtime.lastError.message);
            errorCount++;
          } else if (response && response.success) {
            console.log('Background: Välilehti', tab.id, 'päivitetty onnistuneesti');
            updatedCount++;
          } else {
            console.warn('Background: Päivitys epäonnistui välilehdellä', tab.id);
            errorCount++;
          }
          
          // Jos tämä oli viimeinen käsiteltävä välilehti, kutsu callback-funktiota
          if (pendingCount === 0) {
            callback({
              success: true,
              updated: updatedCount,
              errors: errorCount,
              total: tabs.length
            });
          }
        });
      } catch (e) {
        console.error('Background: Poikkeus päivitettäessä välilehteä', tab.id, e);
        pendingCount--;
        errorCount++;
        
        // Jos tämä oli viimeinen käsiteltävä välilehti, kutsu callback-funktiota
        if (pendingCount === 0) {
          callback({
            success: true,
            updated: updatedCount,
            errors: errorCount,
            total: tabs.length
          });
        }
      }
    }
  });
}
```

## Chrome API Rajapinnat

### Storage API

Käytetään käyttäjän tekstin tallentamiseen ja hakemiseen:

```javascript
// Tallenna teksti
chrome.storage.sync.set({overlayText: 'Uusi teksti'});

// Hae teksti
chrome.storage.sync.get('overlayText', function(data) {
  console.log(data.overlayText);
});

// Kuuntele muutoksia
chrome.storage.onChanged.addListener(function(changes, namespace) {
  // Reagoi muutoksiin
});
```

### Tabs API

Käytetään välilehtien hakemiseen ja viestien lähettämiseen:

```javascript
// Etsi YouTube-välilehdet
chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
  // Käsittele välilehtiä
});

// Lähetä viesti välilehdelle
chrome.tabs.sendMessage(tabId, {action: 'updateText', text: 'Uusi teksti'});
```

### Runtime API

Käytetään viestien vastaanottamiseen ja lähettämiseen:

```javascript
// Kuuntele viestejä
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Käsittele viestit
});

// Lähetä viesti
chrome.runtime.sendMessage({type: 'updateAllTabs', text: 'Uusi teksti'});
```

## Turvallisuusnäkökohdat

### Oikeudet

Manifest.json-tiedostossa määritellään, mihin rajapintoihin ja sivustoihin laajennuksella on oikeus:

```json
"permissions": ["storage", "tabs"],
"host_permissions": ["*://*.youtube.com/*"]
```

Näin varmistetaan, että laajennus toimii vain YouTube-sivustoilla.

### Content Security Policy (CSP)

Chrome Manifest V3 käyttää tiukempia CSP-sääntöjä, jotka estävät inline-skriptit ja eval()-funktion käytön. Tämä parantaa laajennuksen turvallisuutta estämällä mahdolliset XSS-hyökkäykset.

## Suorituskyky

Background script on service worker, joka:
- Käynnistyy tarvittaessa (on-demand)
- Voi pysähtyä, kun sitä ei tarvita
- Käynnistyy uudelleen viestien tai tapahtumien käsittelemiseksi

Tämä parantaa sovelluksen suorituskykyä ja vähentää resurssien käyttöä. 