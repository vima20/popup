import winston from 'winston';
import path from 'path';
import config from './config.js';

interface LogMetadata {
  [key: string]: any;
}

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: {
    service: config.logging.serviceName
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: path.join(config.logging.directory, 'combined.log'),
      maxsize: config.logging.maxFileSize,
      maxFiles: config.logging.maxFiles
    }),
    new winston.transports.File({
      filename: path.join(config.logging.directory, 'error.log'),
      level: 'error',
      maxsize: config.logging.maxFileSize,
      maxFiles: config.logging.maxFiles
    })
  ]
});

const log = {
  error: (message: string, meta: LogMetadata = {}) => logger.error(message, meta),
  warn: (message: string, meta: LogMetadata = {}) => logger.warn(message, meta),
  info: (message: string, meta: LogMetadata = {}) => logger.info(message, meta),
  debug: (message: string, meta: LogMetadata = {}) => logger.debug(message, meta),
  
  // Specialized logs
  connection: (message: string, meta: LogMetadata = {}) => logger.info(message, { ...meta, type: 'connection' }),
  message: (message: string, meta: LogMetadata = {}) => logger.debug(message, { ...meta, type: 'message' }),
  system: (message: string, meta: LogMetadata = {}) => logger.info(message, { ...meta, type: 'system' }),
  security: (message: string, meta: LogMetadata = {}) => logger.warn(message, { ...meta, type: 'security' }),
  performance: (message: string, meta: LogMetadata = {}) => logger.debug(message, { ...meta, type: 'performance' })
};

export default log; 