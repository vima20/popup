/**
 * Types for Video Overlay messages
 */

// Message style types
export type MessageStyle = {
  position?: 'top' | 'middle' | 'bottom';
  color?: string;
  fontSize?: string;
  duration?: number;
  [key: string]: any;
}

// Base message type
export type BaseMessage = {
  type: string;
  [key: string]: any;
}

// Show message type
export type ShowMessage = BaseMessage & {
  type: 'showMessage';
  content: string;
  style?: MessageStyle;
}

// Hide message type
export type HideMessage = BaseMessage & {
  type: 'hideMessage';
}

// Register message
export type RegisterMessage = BaseMessage & {
  type: 'register';
  role: 'director' | 'viewer';
}

// Viewer count message
export type ViewerCountMessage = BaseMessage & {
  type: 'viewerCount';
  content: number;
}

// Connection status message
export type ConnectionStatusMessage = BaseMessage & {
  type: 'connectionStatus';
  status: string;
  error?: string;
}

// Toggle overlay message
export type ToggleOverlayMessage = BaseMessage & {
  type: 'toggleOverlay';
}

// Union type for all messages
export type Message = 
  | ShowMessage
  | HideMessage
  | RegisterMessage
  | ViewerCountMessage
  | ConnectionStatusMessage
  | ToggleOverlayMessage
  | BaseMessage;

export interface ValidationResult<T> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts: number;
  reconnectDelay: number;
}

// Validoi viestin tyylin
function validateMessageStyle(style: any): ValidationResult<MessageStyle> {
  const errors: string[] = [];
  
  if (style.position && !['top', 'middle', 'bottom'].includes(style.position)) {
    errors.push('Invalid position value');
  }
  
  if (style.color && typeof style.color !== 'string') {
    errors.push('Color must be a string');
  }
  
  if (style.duration && typeof style.duration !== 'number') {
    errors.push('Duration must be a number');
  }
  
  return {
    success: errors.length === 0,
    error: errors.length > 0 ? errors.join(', ') : undefined,
    data: errors.length === 0 ? style : undefined
  };
}

// Validoi koko viestin
export function validateMessage(message: any): ValidationResult<Message> {
  const errors: string[] = [];
  
  if (!message.type || typeof message.type !== 'string') {
    errors.push('Message type is required and must be a string');
  }
  
  if (!message.content || typeof message.content !== 'string') {
    errors.push('Message content is required and must be a string');
  }
  
  if (message.style) {
    const styleValidation = validateMessageStyle(message.style);
    if (!styleValidation.success) {
      errors.push(styleValidation.error || '');
    }
  }
  
  return {
    success: errors.length === 0,
    error: errors.length > 0 ? errors.join(', ') : undefined,
    data: errors.length === 0 ? message : undefined
  };
} 