# YouTube Overlay - Opitut asiat ja ratkaisut

## Chrome Extension -kehitys

### Manifest V3 yhteensopivuus

Chrome Extension API on siirtynyt Manifest V3 -versioon, mikä tuo mukanaan muutoksia aiempiin versioihin nähden:

- Background scriptit ovat nyt service workereita
- Content scriptit pysyvät pitkälti samanlaisia
- Oikeuksien määrittely on muuttunut (esim. host_permissions erillään permissions-kentästä)

```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage", "tabs"],
  "host_permissions": ["*://*.youtube.com/*"]
}
```

### Content Scriptin ajoitus

Content scriptin latausajoitusta voi hallita `run_at`-parametrilla:

```json
"content_scripts": [{
  "matches": ["*://*.youtube.com/*"],
  "js": ["content.js"],
  "css": ["content.css"],
  "run_at": "document_start"
}]
```

- `document_start`: Suoritetaan heti kun dokumentti alkaa latautua
- `document_end`: Suoritetaan kun DOM on latautunut, mutta ennen kuin muut resurssit (kuvat jne.) ovat valmiita
- `document_idle` (oletus): Suoritetaan kun sivu on täysin latautunut

Käytämme `document_start` -asetusta varmistaaksemme, että content script on käytettävissä mahdollisimman aikaisin.

## Viestinvälitys Chrome-laajennuksessa

### Viestien lähettäminen content scriptiltä popup-ikkunalle

Content script ei voi suoraan lähettää viestejä popup-ikkunalle. Sen sijaan viestit pitää reitittää background scriptin kautta tai käyttää chrome.storage-rajapintaa.

### Virheidenkäsittely chrome.runtime.lastError -virheissä

```javascript
chrome.tabs.sendMessage(tabId, message, function(response) {
  if (chrome.runtime.lastError) {
    console.error("Virhe:", chrome.runtime.lastError.message);
    return;
  }
  // Käsittele vastaus
});
```

Chrome API:n virheet tallentuvat `chrome.runtime.lastError`-ominaisuuteen, joka on saatavilla vain callback-funktiossa. Jos tätä ei tarkisteta, virheet jäävät käsittelemättä.

### Luotettava viestinvälitys usean mekanismin avulla

Yksi tehokkaimmista oppimistamme on kolmen eri viestinvälitysmekanismin käyttö:

1. **Chrome Storage**: Toimii aina, mutta ei ole reaaliaikainen
   ```javascript
   chrome.storage.sync.set({overlayText: text}, function() {
     console.log('Tallennettu');
   });
   
   // Kuuntelija toisessa scriptissä
   chrome.storage.onChanged.addListener(function(changes, namespace) {
     if (namespace === 'sync' && changes.overlayText) {
       updateOverlayText(changes.overlayText.newValue);
     }
   });
   ```

2. **Suorat viestit**: Nopea, mutta toimii vain jos content script on aktiivinen
   ```javascript
   chrome.tabs.sendMessage(tabId, {action: 'updateText', text: text});
   ```

3. **Background scriptin kautta**: Kokoaa kaikki välilehdet
   ```javascript
   chrome.runtime.sendMessage({type: 'updateAllTabs', text: text});
   ```

## DOM-manipulaatio ja overlay-elementti

### Overlay-elementin luominen ja ylläpito

Elementti kannattaa luoda heti ja tarkistaa säännöllisesti, onko se vielä DOM:issa:

```javascript
// Luo overlay heti kun DOM on valmis
function createOverlay() {
  // Jos overlay on jo olemassa, älä tee mitään
  if (overlayElement && document.body.contains(overlayElement)) {
    return overlayElement;
  }
  
  // Luo uusi overlay
  overlayElement = document.createElement('div');
  // ...
  
  return overlayElement;
}

// Tarkista säännöllisesti onko overlay vielä DOM:issa
setInterval(function() {
  if (overlayInitialized && (!overlayElement || !document.body.contains(overlayElement))) {
    createOverlay();
  }
}, 2000);
```

### Tapahtumien käsittely

Näppäimistötapahtumien kuuntelu ja overlay-elementin näyttäminen/piilottaminen:

```javascript
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.code === 'F3') {
    toggleOverlay();
  }
});
```

## Yleisiä virhetilanteita ja ratkaisuja

### Content Script ei vastaa tai löydy

**Ongelma**: Viestien lähettäminen content scriptille epäonnistuu virheellä "Could not establish connection. Receiving end does not exist."

**Ratkaisu**:
1. Varmista että content script on ladattu (esim. `run_at: "document_start"`)
2. Käsittele `chrome.runtime.lastError` asianmukaisesti
3. Käytä vaihtoehtoisia viestinvälitysmekanismeja (kuten storage)

### Chrome Storage -muutosten seuranta 

**Ongelma**: Storage-muutokset eivät aina päivity kaikille komponenteille.

**Ratkaisu**: Kuuntele muutoksia eksplisiittisesti ja varmista että kuuntelija on lisätty:

```javascript
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.overlayText) {
    updateOverlayText(changes.overlayText.newValue);
  }
});
```

### Callback-funktioiden käsittely

**Ongelma**: Chrome API:t ovat asynkronisia ja vain callbackeissa voi käsitellä vastauksia.

**Ratkaisu**: Käytä johdonmukaista callback-rakennetta:

```javascript
// Huono tapa (callback voi puuttua)
function updateAllTabs(text, callback) {
  // Jos callback puuttuu, tulee virhe
  callback(result);
}

// Hyvä tapa
function updateAllTabs(text, callback) {
  if (!callback || typeof callback !== 'function') {
    callback = function() {};
  }
  // Nyt callback-kutsu on aina turvallinen
  callback(result);
}
``` 