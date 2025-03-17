// Background script for Video Overlay extension
console.log('Video Overlay: Background script loaded');

// Konfiguraatio
const WS_URL = 'ws://localhost:3000/ws';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

// Tila
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
let reconnectTimeout: number | null = null;
let isOverlayVisible = false;
// Seurataan aktiivisia välilehtiä
const activeViewers = new Map<string, number>() // URL -> tabId

// WebSocket-yhteyden hallinta
function connect() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout as unknown as number);
  }
  
  if (ws) {
    ws.close();
  }

  try {
    console.log('Connecting to WebSocket server...');
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts = 0;
      broadcastConnectionStatus('Connected');
      
      // Rekisteröidään ohjaajana
      sendWebSocketMessage({
        type: 'register',
        role: 'director'
      });
      
      // Rekisteröi uudelleen kaikki aktiiviset välilehdet
      activeViewers.forEach((_tabId, url) => {
        sendWebSocketMessage({
          type: 'register',
          role: 'viewer',
          url
        });
      });
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      broadcastConnectionStatus('Disconnected');
      ws = null;
      
      // Automaattinen uudelleenyhdistäminen
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttempts), 30000);
        console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
        
        reconnectTimeout = setTimeout(() => {
          reconnectAttempts++;
          connect();
        }, delay) as unknown as number;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      broadcastConnectionStatus('Disconnected', 'Connection error');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket message received:', message);
        
        if (message.type === 'showMessage' || message.type === 'hideMessage') {
          // Lähetä viesti kaikille aktiivisille välilehdille
          activeViewers.forEach((tabId) => {
            try {
              chrome.tabs.sendMessage(tabId, message);
            } catch (error) {
              console.error('Error sending message to tab:', error);
            }
          });
        } else if (message.type === 'viewerCount') {
          // Välitä katsojamäärä popup-ikkunaan
          try {
            chrome.runtime.sendMessage(message);
          } catch (error) {
            console.error('Error sending viewer count to popup:', error);
          }
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };
  } catch (error) {
    console.error('Failed to connect:', error);
    broadcastConnectionStatus('Disconnected', 'Failed to connect');
    
    // Yritetään yhdistää uudelleen
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttempts), 30000);
      reconnectTimeout = setTimeout(() => {
        reconnectAttempts++;
        connect();
      }, delay) as unknown as number;
    }
  }
}

// Lähetä WebSocket-viesti
function sendWebSocketMessage(message: any): boolean {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket is not connected');
    return false;
  }

  try {
    ws.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

// Ilmoita yhteyden tila popup-ikkunalle
function broadcastConnectionStatus(status: string, error?: string) {
  try {
    chrome.runtime.sendMessage({
      type: 'connectionStatus',
      status,
      error
    });
  } catch (err) {
    console.error('Error broadcasting connection status:', err);
  }
}

// Kuuntele viestejä popup-ikkunalta ja content scriptiltä
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message, 'from:', sender);
  
  if (message.type === 'getConnectionStatus') {
    sendResponse({
      status: ws?.readyState === WebSocket.OPEN ? 'Connected' : 'Disconnected'
    });
  } else if (message.type === 'reconnectWebSocket') {
    connect();
    sendResponse({ success: true });
  } else if (message.type === 'toggleOverlay') {
    isOverlayVisible = !isOverlayVisible;
    
    // Lähetä toggle-viesti aktiiviselle välilehdelle
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        try {
          chrome.tabs.sendMessage(activeTab.id, {
            type: isOverlayVisible ? 'showMessage' : 'hideMessage',
            content: 'Hello World!',
            style: {
              position: 'top',
              color: 'white',
              fontSize: '24px',
              duration: 3000
            }
          });
        } catch (error) {
          console.error('Error sending toggle message:', error);
        }
      }
    });
    
    sendResponse({ success: true });
  } else if (message.type === 'contentScriptReady') {
    // Rekisteröi aktiivinen välilehti
    if (sender.tab?.id && sender.url) {
      activeViewers.set(sender.url, sender.tab.id);
      console.log(`Content script ready on tab ${sender.tab.id}, URL: ${sender.url}`);
      
      // Lähetä katsojatietoa WebSocket-palvelimelle
      sendWebSocketMessage({
        type: 'register',
        role: 'viewer',
        url: sender.url
      });
      
      sendResponse({ success: true });
    }
  } else if (message.type === 'sendMessage') {
    // Lähetä viesti WebSocket-palvelimelle
    const success = sendWebSocketMessage(message.data);
    sendResponse({ success });
  } else if (message.type === 'OVERLAY_TOGGLE') {
    // Voit lisätä tähän toiminnallisuutta tarvittaessa
    console.log('Overlay toggle requested')
  }
  
  return true; // Pidetään yhteys auki asynkronista vastausta varten
});

// Seuraa välilehtien sulkeutumista
chrome.tabs.onRemoved.addListener((tabId) => {
  // Poista suljettu välilehti aktiivisten katsojien listasta
  for (const [url, id] of activeViewers.entries()) {
    if (id === tabId) {
      console.log(`Tab ${tabId} closed, removing from active viewers`);
      activeViewers.delete(url);
      break;
    }
  }
});

// Yhdistä käynnistyksen yhteydessä
connect(); 