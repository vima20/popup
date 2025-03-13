# Video Overlay - Frontend

## Käyttöliittymäkomponentit

### Popup (popup.html)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Video Overlay</title>
  <style>
    body {
      width: 300px;
      padding: 10px;
      font-family: Arial, sans-serif;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    textarea {
      width: 100%;
      height: 100px;
      padding: 5px;
      resize: vertical;
    }
    button {
      padding: 8px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
    .status {
      padding: 5px;
      border-radius: 4px;
      text-align: center;
    }
    .success {
      background-color: #dff0d8;
      color: #3c763d;
    }
    .error {
      background-color: #f2dede;
      color: #a94442;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Video Overlay</h2>
    <textarea id="overlayText" placeholder="Kirjoita teksti tähän..."></textarea>
    <button id="saveButton">Tallenna teksti</button>
    <button id="testButton">Testaa näkyvyyttä</button>
    <div id="status" class="status"></div>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

### Overlay (content.css)
```css
#video-overlay-extension {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 999999;
  font-size: 24px;
  font-weight: bold;
  pointer-events: none;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

#video-overlay-extension.visible {
  opacity: 1;
}
```

## Käyttöliittymän logiikka

### Popup (popup.js)
```javascript
// Popup-ikkunan logiikka
document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('overlayText');
  const saveButton = document.getElementById('saveButton');
  const testButton = document.getElementById('testButton');
  const status = document.getElementById('status');

  // Lataa tallennettu teksti
  chrome.storage.local.get(['overlayText'], function(result) {
    if (result.overlayText) {
      textarea.value = result.overlayText;
    }
  });

  // Tallenna teksti
  saveButton.addEventListener('click', function() {
    const text = textarea.value;
    chrome.storage.local.set({ overlayText: text }, function() {
      showStatus('Teksti tallennettu!', 'success');
    });
  });

  // Testaa näkyvyyttä
  testButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'TOGGLE_OVERLAY'
        }, function(response) {
          if (response && response.success) {
            showStatus('Overlay näytetty!', 'success');
          } else {
            showStatus('Virhe overlay:n näyttämisessä!', 'error');
          }
        });
      }
    });
  });

  // Näytä status
  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
    setTimeout(function() {
      status.textContent = '';
      status.className = 'status';
    }, 3000);
  }
});
```

## Käyttöliittymän käyttö

### Tekstin muokkaaminen
1. Avaa laajennuksen popup-ikkuna
2. Kirjoita haluamasi teksti tekstikenttään
3. Klikkaa "Tallenna teksti" -nappia
4. Teksti tallennetaan ja päivitetään kaikissa aktiivisissa välilehdissä

### Overlay:n testaaminen
1. Avaa laajennuksen popup-ikkuna
2. Klikkaa "Testaa näkyvyyttä" -nappia
3. Overlay näytetään 3 sekunnin ajan
4. Overlay katoaa automaattisesti

### Näppäinkomennot
- CTRL+SHIFT+F3: Näytä/piilota overlay

## Responsiivisuus

Overlay-elementti on suunniteltu toimimaan kaikenkokoisilla YouTube-videoilla:
- Keskitetty sijainti varmistaa, että teksti on aina videon keskellä
- Maksimileveys (max-width: 80%) estää tekstiä menemästä videon rajojen ulkopuolelle pienillä näytöillä
- Kiinteä fonttikoko varmistaa luettavuuden kaikilla näytöillä

## Saavutettavuus

Vaikka saavutettavuudelle ei ole tehty erityisiä optimointeja, sovellus huomioi:
- Riittävän kontrastin tekstin ja taustan välillä
- Selkeät visuaaliset palautteet toiminnoista
- Mahdollisuuden käyttää näppäimistöä overlay-elementin näyttämiseen/piilottamiseen 