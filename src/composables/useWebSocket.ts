import { WS_URL, MAX_RECONNECT_ATTEMPTS, RECONNECT_DELAY } from '../config/websocket';
import type { Message } from '../types/message';

type MessageHandler = (data: Message) => void;
type ErrorHandler = (error: Error) => void;
type StatusHandler = () => void;

export function useWebSocket() {
  let ws: WebSocket | null = null;
  let reconnectAttempts = 0;

  const messageHandlers: MessageHandler[] = [];
  const errorHandlers: ErrorHandler[] = [];
  const openHandlers: StatusHandler[] = [];
  const closeHandlers: StatusHandler[] = [];

  const connect = () => {
    try {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0;
        openHandlers.forEach(handler => handler());
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        closeHandlers.forEach(handler => handler());

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          setTimeout(() => {
            reconnectAttempts++;
            connect();
          }, RECONNECT_DELAY);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        errorHandlers.forEach(handler => 
          handler(new Error('WebSocket connection error'))
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      errorHandlers.forEach(handler => 
        handler(error instanceof Error ? error : new Error(String(error)))
      );
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
      ws = null;
    }
  };

  const sendMessage = (message: Message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    console.warn('WebSocket is not connected');
    return false;
  };

  const onMessage = (handler: MessageHandler) => {
    messageHandlers.push(handler);
  };

  const onError = (handler: ErrorHandler) => {
    errorHandlers.push(handler);
  };

  const onOpen = (handler: StatusHandler) => {
    openHandlers.push(handler);
  };

  const onClose = (handler: StatusHandler) => {
    closeHandlers.push(handler);
  };

  return {
    connect,
    disconnect,
    sendMessage,
    onMessage,
    onError,
    onOpen,
    onClose
  };
} 