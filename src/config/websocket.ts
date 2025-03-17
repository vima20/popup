/**
 * WebSocket configuration for Video Overlay extension
 */

// WebSocket server URL
export const WS_URL = 'ws://localhost:8080/ws';

// Reconnection settings
export const MAX_RECONNECT_ATTEMPTS = 5;
export const RECONNECT_DELAY = 1000; // Initial delay in ms (will be multiplied by backoff factor)

// Message types
export const MESSAGE_TYPES = {
  SHOW_MESSAGE: 'showMessage',
  HIDE_MESSAGE: 'hideMessage',
  REGISTER: 'register',
  VIEWER_COUNT: 'viewerCount',
  CONNECTION_STATUS: 'connectionStatus',
  TOGGLE_OVERLAY: 'toggleOverlay'
};

// Roles
export const ROLES = {
  DIRECTOR: 'director',
  VIEWER: 'viewer'
};

// Viestien asetukset
export const DEFAULT_MESSAGE_DURATION = 3000 // millisekunteina
export const DEFAULT_FONT_SIZE = '24px'
export const DEFAULT_TEXT_COLOR = '#ffffff'
export const DEFAULT_POSITION = 'middle' as const 