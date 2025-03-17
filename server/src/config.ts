import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
    port: number;
    host: string;
    websocket: {
        heartbeatInterval: number;
        reconnectAttempts: number;
        reconnectDelay: number;
        maxClients: number;
    };
    logging: {
        level: string;
        maxFileSize: number;
        maxFiles: number;
        serviceName: string;
        directory: string;
    };
    security: {
        allowedOrigins: string[];
    }
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
    websocket: {
        heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL || '15000', 10),
        reconnectAttempts: parseInt(process.env.WS_RECONNECT_ATTEMPTS || '5', 10),
        reconnectDelay: parseInt(process.env.WS_RECONNECT_DELAY || '1000', 10),
        maxClients: parseInt(process.env.WS_MAX_CLIENTS || '100', 10)
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        maxFileSize: parseInt(process.env.LOG_MAX_FILE_SIZE || '5242880', 10), // 5MB
        maxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10),
        serviceName: process.env.SERVICE_NAME || 'video-overlay',
        directory: path.join(__dirname, '../logs')
    },
    security: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
    }
};

export default config; 