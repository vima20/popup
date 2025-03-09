// @vitest/jest
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createOverlay, toggleOverlay, cleanup, init } from '../content.js'

describe('Content Script', () => {
  let overlay;
  
  // Mock chrome API
  global.chrome = {
    runtime: {
      sendMessage: vi.fn(),
      onMessage: { addListener: vi.fn() }
    },
    storage: {
      sync: {
        get: vi.fn()
      }
    }
  };

  // Mock document
  const mockDocument = {
    createElement: vi.fn(() => ({
      style: {},
      parentNode: {
        removeChild: vi.fn()
      }
    })),
    body: {
      appendChild: vi.fn()
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    querySelector: vi.fn()
  };
  global.document = mockDocument;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    overlay = null;
  });

  afterEach(() => {
    cleanup();
  });

  it('should create overlay with correct styles', () => {
    overlay = createOverlay();
    expect(document.createElement).toHaveBeenCalledWith('div');
    expect(overlay.style.position).toBe('fixed');
    expect(overlay.style.backgroundColor).toBe('rgba(0, 0, 0, 0.8)');
    expect(overlay.style.display).toBe('none');
  });

  it('should toggle overlay on CTRL + SHIFT + F3', () => {
    overlay = createOverlay();
    const event = {
      key: 'F3',
      ctrlKey: true,
      shiftKey: true,
      preventDefault: vi.fn()
    };
    
    toggleOverlay(event);
    expect(overlay.style.display).toBe('block');
    
    toggleOverlay(event);
    expect(overlay.style.display).toBe('none');
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should update overlay text from storage', () => {
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({ overlayText: 'Test text' });
    });
    
    init();
    expect(chrome.storage.sync.get).toHaveBeenCalledWith('overlayText');
  });

  it('should update overlay text from message', () => {
    createOverlay();
    overlay = document.querySelector('div');
    
    const message = { type: 'updateOverlayText', text: 'New text' };
    const sendResponse = vi.fn();
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'updateOverlayText') {
        overlay.textContent = message.text;
        sendResponse({ success: true });
      }
    });
    
    expect(overlay.textContent).toBe('New text');
  });

  it('should cleanup resources properly', () => {
    overlay = createOverlay();
    cleanup();
    expect(document.removeEventListener).toHaveBeenCalledWith('keydown', toggleOverlay);
  });
}); 