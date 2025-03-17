import { ref } from 'vue';
import { WS_URL, MAX_RECONNECT_ATTEMPTS, RECONNECT_DELAY } from '../config/websocket';
import type { Message } from '../types/message';

// WebSocket event handler types
type MessageHandler = (data: Message) => void;
type ErrorHandler = (error: Error) => void;
type StatusHandler = () => void;

interface WebSocketState {
  isConnected: boolean;
  error: string | null;
  reconnectAttempts: number;
}

export function useWebSocket() {
  let ws: WebSocket | null = null;
  const state = ref<WebSocketState>({
    isConnected: false,
    error: null,
    reconnectAttempts: 0
  });

  const messageHandlers: MessageHandler[] = [];
  const errorHandlers: ErrorHandler[] = [];
  const openHandlers: StatusHandler[] = [];
  const closeHandlers: StatusHandler[] = [];

  // Yhteyden muodostus
  const connect = () => {
    try {
      if (ws?.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return;
      }

      if (ws?.readyState === WebSocket.CONNECTING) {
        console.log('WebSocket connection in progress');
        return;
      }

      console.log('Connecting to WebSocket...');
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        state.value = {
          isConnected: true,
          error: null,
          reconnectAttempts: 0
        };
        openHandlers.forEach(handler => handler());
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        state.value.isConnected = false;
        closeHandlers.forEach(handler => handler());

        // Automaattinen uudelleenyhdistäminen
        if (state.value.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(
            RECONNECT_DELAY * Math.pow(2, state.value.reconnectAttempts),
            30000
          );
          console.log(`Reconnecting in ${delay}ms (attempt ${state.value.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
          setTimeout(() => {
            state.value.reconnectAttempts++;
            connect();
          }, delay);
        } else {
          state.value.error = 'Max reconnection attempts reached';
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        state.value.error = 'Connection error';
        errorHandlers.forEach(handler => 
          handler(new Error('WebSocket connection error'))
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing message:', error);
          state.value.error = 'Invalid message format';
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      state.value.error = error instanceof Error ? error.message : String(error);
      errorHandlers.forEach(handler => 
        handler(error instanceof Error ? error : new Error(String(error)))
      );
    }
  };

  // Yhteyden katkaisu
  const disconnect = () => {
    if (ws) {
      console.log('Disconnecting WebSocket');
      ws.close();
      ws = null;
      state.value = {
        isConnected: false,
        error: null,
        reconnectAttempts: 0
      };
    }
  };

  // Viestin lähetys
  const sendMessage = (message: Message): boolean => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected');
      return false;
    }

    try {
      ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      state.value.error = 'Failed to send message';
      return false;
    }
  };

  // Event handler rekisteröinnit
  const onMessage = (handler: MessageHandler) => messageHandlers.push(handler);
  const onError = (handler: ErrorHandler) => errorHandlers.push(handler);
  const onOpen = (handler: StatusHandler) => openHandlers.push(handler);
  const onClose = (handler: StatusHandler) => closeHandlers.push(handler);

  // Event handler poistot
  const offMessage = (handler: MessageHandler) => {
    const index = messageHandlers.indexOf(handler);
    if (index > -1) messageHandlers.splice(index, 1);
  };

  const offError = (handler: ErrorHandler) => {
    const index = errorHandlers.indexOf(handler);
    if (index > -1) errorHandlers.splice(index, 1);
  };

  const offOpen = (handler: StatusHandler) => {
    const index = openHandlers.indexOf(handler);
    if (index > -1) openHandlers.splice(index, 1);
  };

  const offClose = (handler: StatusHandler) => {
    const index = closeHandlers.indexOf(handler);
    if (index > -1) closeHandlers.splice(index, 1);
  };

  return {
    state,
    connect,
    disconnect,
    sendMessage,
    onMessage,
    onError,
    onOpen,
    onClose,
    offMessage,
    offError,
    offOpen,
    offClose
  };
} 