# Frontend-dokumentaatio

## Näkymät

### 1. Chrome Extension Popup
- Yksinkertainen käyttöliittymä viestin syöttämiseen
- Näyttää pikanäppäinohjeet (CTRL+SHIFT+9)
- Mahdollistaa viestin näyttämisen manuaalisesti

### 2. Overlay-elementti
- Näytetään videon päällä
- Sisältää ohjaajan viestin
- Tyylitettävissä CSS:llä
- Näkyy/piilotetaan näppäinkomennolla

### 3. Testisivu (testi.html)
- Staattinen testisivu ohjaajan viestille
- Tarjoaa yksinkertaisen käyttöliittymän viestin syöttämiseen
- Näyttää katsojamäärän URL-kohtaisesti
- Testaa WebSocket-yhteyden toimivuuden

## Käyttöliittymäkomponentit

### 1. Popup (popup.html)
```html
<!DOCTYPE html>
<html>
<head>
  <title>Video Overlay</title>
  <style>
    body {
      width: 300px;
      padding: 10px;
    }
    .input-group {
      margin-bottom: 10px;
    }
    input, button {
      width: 100%;
      padding: 5px;
    }
  </style>
</head>
<body>
  <div class="input-group">
    <label for="message">Viesti:</label>
    <input type="text" id="message" placeholder="Syötä viesti...">
  </div>
  <button id="showMessage">Näytä viesti</button>
  <div class="shortcuts">
    <h3>Pikanäppäimet:</h3>
    <p>CTRL+SHIFT+9: Näytä/piilota viesti</p>
  </div>
  <script src="index.js"></script>
</body>
</html>
```

### 2. Overlay-elementti (content.js)
```javascript
// Luo overlay-elementti
const overlay = document.createElement('div');
overlay.id = 'video-overlay';
overlay.style.cssText = `
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 9999;
  display: none;
`;

// WebSocket-yhteys
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'showMessage':
      showOverlay(message.content);
      break;
    case 'viewerCount':
      updateViewerCount(message.content);
      break;
  }
};

// Näytä viesti
function showOverlay(content) {
  overlay.textContent = content;
  overlay.style.display = 'block';
  
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 5000);
}
```

### 3. Testisivu (testi.html)
```html
<!DOCTYPE html>
<html>
<head>
  <title>Video Overlay Test</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .input-group {
      margin-bottom: 20px;
    }
    .viewer-count {
      margin-top: 20px;
      padding: 10px;
      background: #f0f0f0;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>Video Overlay Test</h1>
  
  <div class="input-group">
    <label for="message">Viesti:</label>
    <input type="text" id="message" placeholder="Syötä viesti...">
    <button id="sendMessage">Lähetä viesti</button>
  </div>
  
  <div class="viewer-count">
    <h3>Katsojamäärät:</h3>
    <div id="viewerCounts"></div>
  </div>
  
  <script>
    // WebSocket-yhteys
    const ws = new WebSocket('ws://localhost:3000/ws');
    
    // Rekisteröidy ohjaajaksi
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'register',
        role: 'director'
      }));
    };
    
    // Käsittele viestit
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'viewerCount') {
        updateViewerCounts(message.content);
      }
    };
    
    // Lähetä viesti
    document.getElementById('sendMessage').onclick = () => {
      const content = document.getElementById('message').value;
      ws.send(JSON.stringify({
        type: 'message',
        content: content
      }));
    };
    
    // Päivitä katsojamäärät
    function updateViewerCounts(counts) {
      const container = document.getElementById('viewerCounts');
      container.innerHTML = Object.entries(counts)
        .map(([url, count]) => `<div>${url}: ${count} katsojaa</div>`)
        .join('');
    }
  </script>
</body>
</html>
```

## Tyylit

### 1. Overlay-elementin tyylit
```css
#video-overlay {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 9999;
  font-family: Arial, sans-serif;
  font-size: 16px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: opacity 0.3s ease;
}

#video-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}
```

### 2. Testisivun tyylit
```css
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
}

.input-group {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.viewer-count {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-top: 20px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #0056b3;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
```

## Käyttöliittymäkuvaukset

### 1. Chrome Extension Popup
- Yksinkertainen ja selkeä käyttöliittymä
- Viestin syöttökenttä ja lähetysnappi
- Pikanäppäinohjeet näkyvissä
- Responsiivinen suunnittelu

### 2. Overlay-elementti
- Selkeä ja luettava teksti
- Puoliläpinäkyvä tausta
- Pehmeä varjostus
- Animoidut siirtymät näkyviin/piiloon

### 3. Testisivu
- Selkeä otsikko ja ohjeet
- Viestin syöttökenttä ja lähetysnappi
- Katsojamäärän näyttö URL-kohtaisesti
- Responsiivinen suunnittelu
- Selkeä palaute käyttäjän toimista

## UI/UX Periaatteet

### 1. Värit ja teemat
```typescript
// src/config/theme.ts
export const colors = {
  primary: '#3B82F6',   // Sininen
  success: '#10B981',   // Vihreä
  error: '#EF4444',     // Punainen
  text: '#1F2937',      // Tumma teksti
  background: '#FFFFFF' // Valkoinen tausta
}
```

### 2. Typografia
- **Pääfontti**: Inter (System fallback)
- **Koot**:
  - Otsikot: 1.25rem (20px)
  - Perusteksti: 1rem (16px)
  - Pieni teksti: 0.875rem (14px)

### 3. Animaatiot
```css
/* Overlay-animaatiot */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

## Komponenttien rakenne

### 1. Popup.vue
```vue
<template>
  <div class="popup">
    <div class="status">
      <StatusIndicator :connected="isConnected" />
      <span>{{ connectionStatus }}</span>
    </div>
    <button @click="reconnect">Yhdistä uudelleen</button>
    <ToggleSwitch v-model="debugMode" label="Debug Overlay" />
  </div>
</template>
```

### 2. VideoOverlay.vue
```vue
<template>
  <Transition name="fade">
    <div v-if="visible" 
         :class="['overlay', position]"
         :style="overlayStyle">
      {{ message }}
    </div>
  </Transition>
</template>
```

## Tyylimäärittelyt

### 1. Tailwind CSS Konfiguraatio
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#10B981',
        error: '#EF4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

### 2. Yleiset tyylit
```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .overlay {
    @apply fixed z-50 px-4 py-2 text-white text-lg font-semibold
           bg-black bg-opacity-75 rounded shadow-lg;
  }
  
  .status-indicator {
    @apply w-3 h-3 rounded-full;
  }
}
```

## Responsiivisuus

### 1. Breakpointit
```typescript
// src/config/breakpoints.ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}
```

### 2. Overlay-sijainnit
```css
.overlay.top {
  @apply top-4 left-1/2 transform -translate-x-1/2;
}

.overlay.middle {
  @apply top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}

.overlay.bottom {
  @apply bottom-4 left-1/2 transform -translate-x-1/2;
}
```

## Käytettävyys

### 1. Näppäinkomennot
```typescript
// src/config/shortcuts.ts
export const shortcuts = {
  toggleOverlay: 'Ctrl+Shift+9',
  hideOverlay: 'Escape'
}
```

### 2. Saavutettavuus
- ARIA-labelit kaikissa interaktiivisissa elementeissä
- Riittävä värikontrasti (WCAG AA)
- Näppäimistökäyttö tuettu
- Ruudunlukijatuki

## Virhetilanteet

### 1. Käyttäjäpalaute
- Selkeät virheilmoitukset
- Yhteyden tilan visualisointi
- Toimintaohjeet ongelmatilanteissa

### 2. Fallback-käyttäytyminen
- Offline-tuki
- Graceful degradation
- Automaattinen uudelleenyritys 