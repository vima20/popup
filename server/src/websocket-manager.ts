import { WebSocketServer, WebSocket } from 'ws';
import logger from './logger.js';

interface Client {
  id: string;
  ws: WebSocket;
  lastPing: number;
}

class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, Client>;
  private heartbeatInterval: NodeJS.Timeout | null;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map();
    this.heartbeatInterval = null;
    this.init();
  }

  private init(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, {
        id: clientId,
        ws,
        lastPing: Date.now()
      });

      logger.info(`Client connected: ${clientId}`);

      ws.on('message', (message: WebSocket.RawData) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(clientId, data);
        } catch (error) {
          logger.error('Error parsing message:', { error: String(error) });
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        logger.info(`Client disconnected: ${clientId}`);
      });

      ws.on('error', (error: Error) => {
        logger.error(`WebSocket error for client ${clientId}:`, { error: error.message });
        this.clients.delete(clientId);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'welcome',
        clientId
      });
    });

    // Start heartbeat
    this.startHeartbeat();
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private handleMessage(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (data.type) {
      case 'pong':
        client.lastPing = Date.now();
        break;
      case 'overlay':
        this.broadcastOverlay(data.text);
        break;
      default:
        logger.warn(`Unknown message type: ${data.type}`);
    }
  }

  private sendToClient(clientId: string, data: any): void {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  private broadcastOverlay(text: string): void {
    const message = {
      type: 'overlay',
      text
    };

    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      this.clients.forEach((client, clientId) => {
        if (now - client.lastPing > 30000) { // 30 seconds timeout
          logger.info(`Client ${clientId} timed out`);
          client.ws.terminate();
          this.clients.delete(clientId);
        } else {
          this.sendToClient(clientId, { type: 'ping' });
        }
      });
    }, 15000); // Check every 15 seconds
  }

  public stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
  }
}

export default WebSocketManager; 