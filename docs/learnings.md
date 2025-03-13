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
