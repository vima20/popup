# Backend-dokumentaatio

## WebSocket-palvelin

### Yleiskuvaus
WebSocket-palvelin on toteutettu Node.js:llä käyttäen `ws`-kirjastoa. Palvelin mahdollistaa reaaliaikaisen viestinnän ohjaajan ja katsojien välillä, sekä tarjoaa staattisia tiedostoja testausta varten.

### Palvelimen käynnistys
```javascript
// server.js
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { join } from 'path';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Staattisten tiedostojen tarjoilu
app.use(express.static(join(__dirname, 'public')));

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
  console.log('WebSocket server running on ws://localhost:8080/ws');
});
```

### Yhteyksien hallinta
```javascript
const clients = new Set();
const viewers = new Map(); // URL -> count
const clientProperties = new Map(); // WebSocket -> properties

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  
  // Aseta asiakkaan ominaisuudet
  clientProperties.set(ws, {
    isViewer: false,
    viewerUrl: null
  });

  // Lähetä nykyinen katsojamäärä kaikille
  broadcastViewerCount();
});
```

## API-rajapinnat

### WebSocket-viestit

#### 1. Rekisteröityminen
```typescript
interface RegisterRequest {
  type: 'register';
  role: 'viewer' | 'director';
  url?: string;  // Katsojan URL
}
```

#### 2. Viestin näyttäminen
```typescript
interface ShowMessageRequest {
  type: 'message';
  content: string;
  style?: {
    position?: 'top' | 'middle' | 'bottom';
    color?: string;
    fontSize?: string;
    duration?: number;
  }
}
```

#### 3. Katsojamäärän päivitys
```typescript
interface ViewerCountResponse {
  type: 'viewerCount';
  content: {
    [url: string]: number;  // URL -> katsojamäärä
  }
}
```

### Viestien käsittely
```javascript
ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    
    switch (message.type) {
      case 'register':
        handleRegistration(ws, message);
        break;
      case 'message':
        broadcastToViewers(message);
        break;
      default:
        console.warn('Tuntematon viestityyppi:', message.type);
    }
  } catch (error) {
    console.error('Virhe viestin käsittelyssä:', error);
  }
});
```

## Palvelinarkkitehtuuri

### 1. Yhteyksien hallinta
- WebSocket-yhteyksien ylläpito
- Roolipohjainen yhteyksien hallinta (ohjaaja/katsoja)
- URL-pohjainen katsojamäärän seuranta

### 2. Viestien välitys
- Viestien validointi
- Roolipohjainen viestien välitys
- Virheenkäsittely

### 3. Monitorointi
- Katsojamäärän seuranta URL-kohtaisesti
- Yhteyksien tilan seuranta
- Virheiden lokitus

## Virheenkäsittely

### 1. Yhteysongelmat
```javascript
ws.on('error', (error) => {
  console.error('WebSocket-virhe:', error);
  
  // Puhdistetaan yhteyden tiedot
  const props = clientProperties.get(ws);
  if (props && props.isViewer && props.viewerUrl) {
    updateViewerCount(props.viewerUrl, -1);
  }
  
  clients.delete(ws);
  clientProperties.delete(ws);
  broadcastViewerCount();
});
```

### 2. Viestivirheet
```javascript
function validateMessage(message) {
  if (!message.type) {
    throw new Error('Viestistä puuttuu tyyppi');
  }
  
  if (message.type === 'message' && !message.content) {
    throw new Error('Näytettävästä viestistä puuttuu sisältö');
  }
  
  return true;
}
```

## Suorituskyky

### 1. Yhteyksien hallinta
```javascript
// Yhteyksien puhdistus
setInterval(() => {
  clients.forEach((ws) => {
    if (ws.readyState !== WebSocket.OPEN) {
      ws.terminate();
    }
  });
}, 30000);
```

### 2. Katsojamäärän päivitys
```javascript
function broadcastViewerCount() {
  const totalCount = Array.from(viewers.values()).reduce((sum, count) => sum + count, 0);
  const viewersData = Object.fromEntries(viewers.entries());
  
  const message = JSON.stringify({
    type: 'viewerCount',
    content: viewersData
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
```

## Tietoturva

### 1. Viestien validointi
```javascript
function sanitizeMessage(message) {
  if (typeof message.content === 'string') {
    message.content = message.content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  return message;
}
```

### 2. Yhteyksien autentikointi
```javascript
const validOrigins = [
  'chrome-extension://',
  'http://localhost',
  'https://localhost'
];

wss.on('connection', (ws, req) => {
  const origin = req.headers.origin;
  if (!validOrigins.some(valid => origin.startsWith(valid))) {
    ws.terminate();
    return;
  }
});
```

## Monitorointi ja lokitus

### 1. Katsojamäärän seuranta
```javascript
function logViewerStats() {
  const totalCount = Array.from(viewers.values()).reduce((sum, count) => sum + count, 0);
  console.log(`Aktiivisia katsojia: ${totalCount}`);
  console.log('Katsojamäärät URL-kohtaisesti:', Object.fromEntries(viewers.entries()));
}

setInterval(logViewerStats, 60000);
```

### 2. Virhelokitus
```javascript
function logError(error, context = {}) {
  const timestamp = new Date().toISOString();
  console.error({
    timestamp,
    error: error.message,
    stack: error.stack,
    ...context
  });
}
```

## Kehitysympäristö

### 1. Käynnistys
```bash
# Kehitysympäristö
cd server
npm install
node server.js

# Palvelin käynnistyy osoitteeseen:
# http://localhost:8080
# WebSocket: ws://localhost:8080/ws
```

### 2. Ympäristömuuttujat
```env
# .env
PORT=8080
``` 