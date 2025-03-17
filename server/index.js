/**
 * WebSocket Server for Video Overlay
 * Simple WebSocket server that broadcasts messages to all connected clients
 */
import 'dotenv/config';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Luo HTTP-palvelin staatikon tiedostojen jakamista varten
const server = createServer((req, res) => {
  try {
    let path = req.url;
    
    // Käsittele juurihakemisto
    if (path === '/' || path === '/index.html') {
      path = '/index.html';
    }
    
    // Lue tiedosto
    const filePath = join(__dirname, 'public', path);
    const data = readFileSync(filePath);
    
    // Aseta content-type
    let contentType = 'text/html';
    if (path.endsWith('.js')) contentType = 'text/javascript';
    if (path.endsWith('.css')) contentType = 'text/css';
    if (path.endsWith('.json')) contentType = 'application/json';
    if (path.endsWith('.mp4')) contentType = 'video/mp4';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// WebSocket-palvelin
const wss = new WebSocketServer({ 
  server,
  path: '/ws' 
});

console.log(`Server running on http://localhost:${PORT}`);
console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);

// Track connected clients with their roles and URLs
const clients = new Set();
const viewers = new Map(); // URL -> count
const clientProperties = new Map(); // WebSocket -> properties

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  
  // Set client properties
  clientProperties.set(ws, {
    isViewer: false,
    viewerUrl: null
  });

  // Send current viewer count to all clients
  broadcastViewerCount();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('Received:', message);

      // Tarkistetaan viestin tyyppi ennen lähetystä
      if (message.type === 'register') {
        // Käsitellään rekisteröitymisviesti
        console.log('Registration message, client role:', message.role);
        
        // Tallennetaan rooli ja URL asiakas-objektiin
        if (message.role === 'viewer') {
          const props = clientProperties.get(ws);
          props.isViewer = true;
          props.viewerUrl = message.url || 'unknown';
          
          // Päivitetään katsojien määrä URL:n mukaan
          if (!viewers.has(props.viewerUrl)) {
            viewers.set(props.viewerUrl, 0);
          }
          viewers.set(props.viewerUrl, viewers.get(props.viewerUrl) + 1);
          
          broadcastViewerCount();
        }
      } else if (message.type === 'message') {
        // Viestin tyyppi "message" muutetaan "showMessage"-tyypiksi client-puolelle
        const clientMessage = {
          type: 'showMessage',
          content: message.content,
          style: message.style
        };
        
        console.log('Broadcasting message to viewers:', clientMessage);
        
        // Broadcast to all viewers
        wss.clients.forEach((client) => {
          const props = clientProperties.get(client);
          if (client !== ws && client.readyState === ws.OPEN && props && props.isViewer) {
            console.log('Sending message to viewer:', props.viewerUrl);
            client.send(JSON.stringify(clientMessage));
          }
        });
      } else {
        // Muut viestit lähetetään sellaisenaan kaikille
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(data.toString());
          }
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Päivitetään katsojamäärä, jos kyseessä oli katsoja
    const props = clientProperties.get(ws);
    if (props && props.isViewer && props.viewerUrl) {
      const currentCount = viewers.get(props.viewerUrl) || 0;
      if (currentCount > 0) {
        viewers.set(props.viewerUrl, currentCount - 1);
      }
      if (viewers.get(props.viewerUrl) === 0) {
        viewers.delete(props.viewerUrl);
      }
    }
    
    // Clean up
    clients.delete(ws);
    clientProperties.delete(ws);
    
    // Update viewer count for remaining clients
    broadcastViewerCount();
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    
    // Päivitetään katsojamäärä virhetilanteessa
    const props = clientProperties.get(ws);
    if (props && props.isViewer && props.viewerUrl) {
      const currentCount = viewers.get(props.viewerUrl) || 0;
      if (currentCount > 0) {
        viewers.set(props.viewerUrl, currentCount - 1);
      }
      if (viewers.get(props.viewerUrl) === 0) {
        viewers.delete(props.viewerUrl);
      }
    }
    
    // Clean up
    clients.delete(ws);
    clientProperties.delete(ws);
  });
});

// Broadcast viewer count to all clients
function broadcastViewerCount() {
  const totalCount = Array.from(viewers.values()).reduce((sum, count) => sum + count, 0);
  
  // Luodaan URL-kohtainen objekti katsojamääristä
  const viewersData = Object.fromEntries(viewers.entries());
  
  const message = JSON.stringify({
    type: 'viewerCount',
    content: viewersData
  });
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(message);
    }
  });
  
  console.log(`Active viewers: ${totalCount}`, viewersData);
}

// Handle server shutdown
process.on('SIGINT', () => {
  wss.close(() => {
    console.log('WebSocket server shut down');
    server.close(() => {
      console.log('HTTP server shut down');
      process.exit(0);
    });
  });
});

// Käynnistä palvelin
server.listen(PORT); 