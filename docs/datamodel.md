# YouTube Overlay - Tietomalli

## Yleiskatsaus

YouTube Overlay -laajennuksen tietomalli on melko yksinkertainen, koska sovellus tallentaa vain tekstin Chrome Storage API:n avulla. Tässä dokumentissa kuvaamme sovelluksen tietorakenteen ja sen käsittelyn.

## Tietovarastot

### Chrome Storage API

Chrome Storage API tarjoaa useita eri säilytystapoja tiedolle:

- `chrome.storage.sync`: Tallennetaan pilveen ja synkronoidaan käyttäjän eri laitteille
- `chrome.storage.local`: Tallennetaan vain paikallisesti
- `chrome.storage.session`: Tallennetaan istunnon ajaksi

YouTube Overlay käyttää `chrome.storage.sync`-varastoa, jotta käyttäjän määrittelemä teksti on käytettävissä kaikilla laitteilla.

## Tietomallit

### OverlayText

Päätietomalli on yksinkertainen merkkijono, joka tallennetaan avaimella `overlayText`.

```typescript
interface OverlayStorage {
  overlayText: string;
}
```

Oletusarvo: `"Hello world!"`

### UI-tila (ei-persistentti)

Sovellus ylläpitää myös ei-persistenttiä tietoa käyttöliittymän tilasta:

```typescript
interface UIState {
  overlayVisible: boolean;
  overlayInitialized: boolean;
}
```

Oletusarvot:
- `overlayVisible`: `false`
- `overlayInitialized`: `false`

## Tiedon käsittely

### Tiedon tallennus

```javascript
// Tekstin tallennus
chrome.storage.sync.set({overlayText: text}, function() {
  console.log('Teksti tallennettu:', text);
});
```

### Tiedon hakeminen

```javascript
// Tekstin haku
chrome.storage.sync.get('overlayText', function(data) {
  if (data.overlayText) {
    console.log('Tallennettu teksti:', data.overlayText);
  } else {
    console.log('Tekstiä ei löytynyt, käytetään oletusarvoa');
  }
});
```

### Tietomuutosten kuuntelu

```javascript
// Kuuntele muutoksia
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync' && changes.overlayText) {
    console.log('Teksti muuttunut:', changes.overlayText.oldValue, '->', changes.overlayText.newValue);
  }
});
```

## Alustus ja oletusarvo

Background script alustaa tiedot asennuksen yhteydessä:

```javascript
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get('overlayText', function(data) {
    if (!data.overlayText) {
      chrome.storage.sync.set({overlayText: 'Hello world!'}, function() {
        console.log('Oletusteksti asetettu');
      });
    }
  });
});
```

## Tietovirheet

Sovellus käsittelee myös tilanteita, joissa tallennettu tieto puuttuu:

1. Jos `overlayText` puuttuu, käytetään oletusarvoa "Hello world!"
2. Jos tallennus ei onnistu, näytetään virheilmoitus ja käyttöliittymä palautetaan alkutilaan

## Tulevat kehityssuunnat

Tulevissa versioissa tietomallia voidaan laajentaa tukemaan:

1. **Useita tekstejä**:
```typescript
interface EnhancedOverlayStorage {
  overlays: {
    id: string;
    text: string;
    name: string;
  }[];
  activeOverlayId: string;
}
```

2. **Videospesifisiä tekstejä**:
```typescript
interface VideoSpecificOverlayStorage {
  videoOverlays: {
    videoId: string;
    text: string;
  }[];
}
```

3. **Tyylimuunnoksia**:
```typescript
interface StyledOverlayStorage {
  overlayText: string;
  overlayStyle: {
    fontSize: string;
    color: string;
    backgroundColor: string;
    position: 'center' | 'top' | 'bottom';
  };
}
```

## WebSocket-viestit

### 1. Perusviesti
```typescript
interface BaseMessage {
  type: string;        // Viestin tyyppi
  timestamp?: number;  // Aikaleima (ms)
}
```

### 2. Näyttöviesti
```typescript
interface ShowMessage extends BaseMessage {
  type: 'showMessage';
  content: string;     // Näytettävä teksti
  style?: MessageStyle;
}

interface MessageStyle {
  position?: 'top' | 'middle' | 'bottom';  // Tekstin sijainti
  color?: string;      // Tekstin väri (CSS)
  fontSize?: string;   // Fonttikoko (CSS)
  duration?: number;   // Näyttöaika (ms)
}
```

### 3. Piilotusviesti
```typescript
interface HideMessage extends BaseMessage {
  type: 'hideMessage';
}
```

### 4. Ping-viesti
```typescript
interface PingMessage extends BaseMessage {
  type: 'ping';
  timestamp: number;  // Lähetysaika (ms)
}

interface PongMessage extends BaseMessage {
  type: 'pong';
  timestamp: number;  // Alkuperäinen lähetysaika (ms)
}
```

## Chrome Extension

### 1. Yhteyden tila
```typescript
interface ConnectionState {
  isConnected: boolean;     // WebSocket-yhteyden tila
  lastError?: string;       // Viimeisin virheviesti
  reconnectAttempts: number;// Uudelleenyrityskerrat
  lastPingTime?: number;    // Viimeisimmän ping-viestin aika
}
```

### 2. Overlay-asetukset
```typescript
interface OverlaySettings {
  enabled: boolean;         // Overlay käytössä
  defaultStyle: MessageStyle;// Oletustyylit
  debugMode: boolean;       // Debug-tila
}
```

### 3. Tallennettavat asetukset
```typescript
interface StorageData {
  settings: OverlaySettings;
  lastMessage?: string;     // Viimeisin viesti
  serverUrl: string;        // WebSocket-palvelimen osoite
}
```

## Suhteet ja riippuvuudet

### 1. Viestien hierarkia
```
BaseMessage
├── ShowMessage
├── HideMessage
└── PingMessage/PongMessage
```

### 2. Asetushierarkia
```
StorageData
└── OverlaySettings
    └── MessageStyle
```

## Tiedon validointi

### 1. Viestien validointi
```typescript
function validateMessage(message: BaseMessage): boolean {
  // Tarkista viestin tyyppi
  if (!message.type) {
    throw new Error('Viestistä puuttuu tyyppi');
  }

  // Tarkista ShowMessage
  if (message.type === 'showMessage') {
    const showMsg = message as ShowMessage;
    if (!showMsg.content) {
      throw new Error('Näytettävästä viestistä puuttuu sisältö');
    }
  }

  return true;
}
```

### 2. Tyylien validointi
```typescript
function validateStyle(style: MessageStyle): boolean {
  // Tarkista sijainti
  if (style.position && !['top', 'middle', 'bottom'].includes(style.position)) {
    throw new Error('Virheellinen sijainti');
  }

  // Tarkista väri
  if (style.color && !/^#[0-9A-F]{6}$/i.test(style.color)) {
    throw new Error('Virheellinen värikoodi');
  }

  // Tarkista fonttikoko
  if (style.fontSize && !/^\d+px$/.test(style.fontSize)) {
    throw new Error('Virheellinen fonttikoko');
  }

  // Tarkista kesto
  if (style.duration && (style.duration < 0 || style.duration > 60000)) {
    throw new Error('Virheellinen kesto');
  }

  return true;
}
```

## Tiedon tallennus

### 1. Chrome Storage
```typescript
// Tallenna asetukset
chrome.storage.sync.set({
  settings: {
    enabled: true,
    defaultStyle: {
      position: 'middle',
      color: '#FFFFFF',
      fontSize: '24px',
      duration: 5000
    },
    debugMode: false
  },
  serverUrl: 'ws://localhost:3000'
});

// Hae asetukset
chrome.storage.sync.get(['settings', 'serverUrl'], (data: StorageData) => {
  // Käsittele data
});
```

### 2. Välimuisti
```typescript
class MessageCache {
  private messages: ShowMessage[] = [];
  private readonly maxSize = 100;

  add(message: ShowMessage): void {
    if (this.messages.length >= this.maxSize) {
      this.messages.shift();
    }
    this.messages.push(message);
  }

  getRecent(count: number): ShowMessage[] {
    return this.messages.slice(-count);
  }
}
```

## Tietoturva

### 1. Viestien sanitointi
```typescript
function sanitizeMessage(message: ShowMessage): ShowMessage {
  return {
    ...message,
    content: message.content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  };
}
```

### 2. Tyyppitarkistukset
```typescript
function isShowMessage(message: BaseMessage): message is ShowMessage {
  return message.type === 'showMessage' && 
         typeof (message as ShowMessage).content === 'string';
}

function isValidStyle(style: unknown): style is MessageStyle {
  if (typeof style !== 'object' || !style) return false;
  
  const s = style as MessageStyle;
  return (!s.position || ['top', 'middle', 'bottom'].includes(s.position)) &&
         (!s.color || typeof s.color === 'string') &&
         (!s.fontSize || typeof s.fontSize === 'string') &&
         (!s.duration || typeof s.duration === 'number');
}
``` 