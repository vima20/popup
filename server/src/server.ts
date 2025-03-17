import express from 'express';
import http from 'http';
import cors from 'cors';
import WebSocketManager from './websocket-manager.js';
import config from './config.js';
import logger from './logger.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = http.createServer(app);
const wsManager = new WebSocketManager(server);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  wsManager.stop();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

server.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
}); 