// Video Overlay Content Script
import { useWebSocket } from '../composables/useWebSocket';
import './content.css';

type Overlay = {
  element: HTMLDivElement | null;
  text: string;
  visible: boolean;
}

class VideoOverlay {
  private ws: ReturnType<typeof useWebSocket>;
  private overlay: Overlay;
  private hotkeyHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.ws = useWebSocket();
    this.overlay = {
      element: null,
      text: '',
      visible: false
    };

    this.hotkeyHandler = this.handleHotkey.bind(this);
    this.initialize();
  }

  private initialize(): void {
    // Create overlay element
    this.overlay.element = document.createElement('div');
    this.overlay.element.className = 'video-overlay';
    document.body.appendChild(this.overlay.element);

    // Setup WebSocket
    this.setupWebSocket();

    // Add hotkey listener
    document.addEventListener('keydown', this.hotkeyHandler);

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      try {
        this.handleMessage(message, sendResponse);
        return true; // Keep the message channel open for async response
      } catch (error) {
        console.error('Error handling message:', error);
        sendResponse({ success: false, error: String(error) });
        return false;
      }
    });
  }

  private setupWebSocket(): void {
    this.ws.connect();

    this.ws.onOpen(() => {
      console.log('WebSocket connected');
    });

    this.ws.onClose(() => {
      console.log('WebSocket disconnected');
    });

    this.ws.onError((error) => {
      console.error('WebSocket error:', error);
    });

    this.ws.onMessage((data) => {
      console.log('Content script received message:', data);
      if (data.type === 'overlay' || data.type === 'showMessage') {
        console.log('Showing overlay with content:', data.content);
        this.showOverlay(data.content || '');
      }
    });
  }

  private handleHotkey(e: KeyboardEvent): void {
    // Check for Ctrl + Shift + 9
    if (e.ctrlKey && e.shiftKey && e.key === '9') {
      this.toggleOverlay();
    }
  }

  private handleMessage(message: any, sendResponse: (response: any) => void): void {
    switch (message.type) {
      case 'ping':
        sendResponse({ success: true });
        break;

      case 'getStatus':
        sendResponse({
          success: true,
          isVisible: this.overlay.visible,
          text: this.overlay.text
        });
        break;

      case 'showOverlay':
        this.showOverlay(message.text);
        sendResponse({ success: true });
        break;

      case 'hideOverlay':
        this.hideOverlay();
        sendResponse({ success: true });
        break;

      case 'toggleOverlay':
        this.toggleOverlay();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  }

  private showOverlay(text: string): void {
    if (!this.overlay.element) return;

    this.overlay.text = text;
    this.overlay.element.textContent = text;
    this.overlay.element.classList.add('visible');
    this.overlay.visible = true;
  }

  private hideOverlay(): void {
    if (!this.overlay.element) return;

    this.overlay.element.classList.remove('visible');
    this.overlay.visible = false;
  }

  private toggleOverlay(): void {
    if (this.overlay.visible) {
      this.hideOverlay();
    } else {
      this.showOverlay(this.overlay.text || 'Hello World!');
    }
  }

  public cleanup(): void {
    document.removeEventListener('keydown', this.hotkeyHandler);
    this.ws.disconnect();
    this.overlay.element?.remove();
  }
}

// Initialize the overlay
const overlay = new VideoOverlay();

// Cleanup on unload
window.addEventListener('unload', () => {
  overlay.cleanup();
});
