import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createOverlay, removeOverlay, handleKeyPress } from '../index'

describe('Content Script', () => {
  let mockDocument: any
  let mockWindow: any

  beforeEach(() => {
    // Mock document
    mockDocument = {
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
        querySelector: vi.fn(),
      },
      createElement: vi.fn(() => ({
        id: 'youtube-overlay',
        classList: {
          add: vi.fn(),
        },
        style: {},
      })),
    }

    // Mock window
    mockWindow = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    // Mock global objects
    global.document = mockDocument
    global.window = mockWindow
  })

  it('creates overlay element', () => {
    const overlay = createOverlay()
    expect(mockDocument.createElement).toHaveBeenCalledWith('div')
    expect(mockDocument.body.appendChild).toHaveBeenCalled()
    expect(overlay.id).toBe('youtube-overlay')
  })

  it('removes overlay element', () => {
    const mockOverlay = { id: 'youtube-overlay' }
    mockDocument.body.querySelector.mockReturnValue(mockOverlay)
    
    removeOverlay()
    expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockOverlay)
  })

  it('handles key press correctly', () => {
    const mockEvent = {
      key: 'F3',
      ctrlKey: true,
      preventDefault: vi.fn(),
    }

    handleKeyPress(mockEvent)
    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  it('does not handle non-matching key press', () => {
    const mockEvent = {
      key: 'F4',
      ctrlKey: true,
      preventDefault: vi.fn(),
    }

    handleKeyPress(mockEvent)
    expect(mockEvent.preventDefault).not.toHaveBeenCalled()
  })
}) 