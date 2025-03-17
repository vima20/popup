# Video Overlay - Oppimiskokemukset

## Chrome Extension API

### Content Script Injektio
```javascript
// Vanha tapa (rajoitettu)
"content_scripts": [{
  "matches": ["*://*.youtube.com/*"],
  "js": ["content.js"],
  "css": ["content.css"]
}]

// Uusi tapa (universaali)
"content_scripts": [{
  "matches": ["<all_urls>"],
  "js": ["content.js"],
  "css": ["content.css"]
}]
```

### Host Oikeudet
```javascript
// Vanha tapa (rajoitettu)
"host_permissions": ["*://*.youtube.com/*"]

// Uusi tapa (universaali)
"host_permissions": ["<all_urls>"]
```

### Viestintä
```javascript
// Varmista että viesti menee perille
chrome.runtime.sendMessage({
  type: 'MESSAGE_TYPE',
  data: data
}, function(response) {
  if (chrome.runtime.lastError) {
    console.error('Viestin lähetys epäonnistui:', chrome.runtime.lastError);
  }
});
```

### Virheenkäsittely
```javascript
// Kattava virheenkäsittely
try {
  // Toiminto
} catch (error) {
  console.error('Virhe:', error);
  // Ilmoita käyttäjälle
  showStatus('Virhe toiminnossa: ' + error.message, 'error');
}
```

## Web-teknologiat

### CSS
```css
/* Overlay-elementin tyylit */
#video-overlay-extension {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
  pointer-events: none;
}
```

### JavaScript
```javascript
// Tarkista onko video-elementti
function isVideoElement(element) {
  return element.tagName === 'VIDEO' || 
         element.tagName === 'IFRAME' || 
         element.getAttribute('data-video') !== null;
}

// Etsi video-elementti
function findVideoElement() {
  const elements = document.getElementsByTagName('*');
  for (let element of elements) {
    if (isVideoElement(element)) {
      return element;
    }
  }
  return null;
}
```

## Parhaat käytännöt

### Koodin organisointi
1. Jaa koodi loogisiin moduuleihin
2. Käytä selkeitä funktio- ja muuttujanimiä
3. Lisää kommentteja monimutkaisiin osiin
4. Käsittele virheet kattavasti

### Käyttöliittymä
1. Anna käyttäjälle selkeää palautetta
2. Käytä animaatioita pehmeästi
3. Varmista että overlay ei häiritse videon katsomista
4. Tallenna käyttäjän asetukset

### Suorituskyky
1. Injektoroi content script vain tarvittaessa
2. Käytä tehokkaita DOM-operaatioita
3. Vältä turhia uudelleenrenderöintejä
4. Optimoi CSS-animaatiot

# Tekniset opit ja parhaat käytännöt

## Chrome-laajennuksen CSS-tiedostojen käsittely

Kun Chrome-laajennuksessa käytetään CSS-tiedostoja content scriptien kanssa:

1. CSS-tiedostot tulee määritellä manifest.json:ssa content_scripts-osiossa
2. Vite-konfiguraatiossa tulee varmistaa, että CSS-tiedostot kopioidaan dist-kansioon
3. Voidaan käyttää custom pluginia tiedostojen kopiointiin:

```typescript
{
  name: 'copy-css',
  writeBundle() {
    copyFileSync('content.css', 'dist/content.css')
  }
}
```

4. Varmista, että manifest.json:ssa CSS-polut ovat oikein suhteessa dist-kansion rakenteeseen

## Chrome-laajennuksen WebSocket-yhteydet

1. WebSocket-yhteyksien hallinta Chrome-laajennuksessa:
   - Käytä ws:// protokollaa kehityksessä ja wss:// tuotannossa
   - Toteuta uudelleenyhdistämislogiikka katkenneiden yhteyksien varalta
   - Näytä yhteyden tila käyttäjälle selkeästi
   - Tarjoa manuaalinen uudelleenyhdistämismahdollisuus

2. Kehitysympäristön WebSocket-palvelin:
   ```javascript
   const WebSocket = require('ws');
   const wss = new WebSocket.Server({ port: 8080 });
   
   wss.on('connection', function connection(ws) {
     ws.on('message', function incoming(message) {
       // Käsittele viestit
     });
   });
   ```

3. Vue 3 ja TypeScript -konfiguraatio:
   - Varmista oikeat TypeScript-asetukset Vue 3:lle
   - Käytä moduleResolution: "bundler" uudemmissa projekteissa
   - Sisällytä tarvittavat tyyppimäärittelyt (esim. chrome, node)

4. Virheenkäsittely:
   - WebSocket-virhekoodi 1006 tarkoittaa epänormaalia sulkemista
   - Tarkista aina yhteyden tila ennen viestien lähetystä
   - Käsittele yhteysongelmat gracefully UI:ssa

## WebSocket-toteutus

### 1. Yhteyksien hallinta
- WebSocket-yhteydet pitää hallita Map-objektilla, jotta voidaan tallentaa yhteyksien ominaisuudet
- Yhteyksien puhdistus on tärkeää, muuten muisti täyttyy
- Yhteyksien tilan seuranta on välttämätöntä virheenkäsittelyä varten

### 2. Viestien välitys
- Viestit pitää validoida ennen lähetystä
- Viestien tyypit pitää määritellä selkeästi
- Viestien sisältö pitää sanitoida XSS-hyökkäyksiä vastaan

### 3. Virheenkäsittely
- WebSocket-virheet pitää käsitellä try-catch -blokeilla
- Yhteyksien katkeaminen pitää käsitellä gracefulisti
- Virheiden lokitus on tärkeää debuggausta varten

### 4. Suorituskyky
- Yhteyksien määrä pitää rajoittaa
- Viestien määrä pitää rajoittaa
- Muistin käyttöä pitää seurata

### 5. Tietoturva
- CORS-asetukset pitää määritellä oikein
- WebSocket-yhteydet pitää suojata
- Viestien sisältö pitää sanitoida

## Chrome Extension

### 1. Manifest.json
- Manifest.json pitää määritellä oikein
- Oikeudet pitää määritellä oikein
- Content scripts pitää määritellä oikein

### 2. Content Script
- Content script pitää injektoida oikein
- Overlay-elementti pitää luoda oikein
- Viestit pitää käsitellä oikein

### 3. Popup
- Popup-ikkuna pitää määritellä oikein
- Viestin syöttö pitää käsitellä oikein
- Näppäinkomennot pitää käsitellä oikein

### 4. Tyylit
- Overlay-elementin tyylit pitää määritellä oikein
- Popup-ikkunan tyylit pitää määritellä oikein
- Responsiivinen suunnittelu on tärkeää

## Dokumentaatio

### 1. Arkkitehtuuridokumentaatio
- Arkkitehtuuridokumentaatio pitää päivittää ajan tasalla
- Tiedostorakenne pitää dokumentoida
- Komponentit pitää dokumentoida

### 2. Backend-dokumentaatio
- WebSocket-rajapinta pitää dokumentoida
- Viestit pitää dokumentoida
- Virheenkäsittely pitää dokumentoida

### 3. Frontend-dokumentaatio
- Käyttöliittymäkomponentit pitää dokumentoida
- Tyylit pitää dokumentoida
- Käyttöliittymäkuvaukset pitää dokumentoida
