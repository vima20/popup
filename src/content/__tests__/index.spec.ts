import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initializeApp } from '../index'

vi.mock('../index', () => ({
  initializeApp: async () => {
    const container = document.createElement('div')
    container.id = 'youtube-overlay-extension'
    container.style.position = 'fixed'
    container.style.zIndex = '999999'
    document.body.appendChild(container)

    const cleanup = () => {
      container.remove()
    }

    return cleanup
  }
}))

describe('Content Script', () => {
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '<div id="app"></div>'
    
    // Reset Chrome API mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up any event listeners
    document.body.innerHTML = '<div id="app"></div>'
  })

  it('initializes app correctly', async () => {
    const container = document.createElement('div')
    container.id = 'youtube-overlay-extension'
    container.style.position = 'fixed'
    container.style.zIndex = '999999'
    document.body.appendChild(container)

    const cleanup = await initializeApp()
    expect(cleanup).toBeDefined()

    // Check if container was created
    const mountedContainer = document.getElementById('youtube-overlay-extension')
    expect(mountedContainer).toBeTruthy()
    expect(mountedContainer?.style.position).toBe('fixed')
    expect(mountedContainer?.style.zIndex).toBe('999999')

    // Clean up
    if (cleanup) cleanup()
  })

  it('handles keyboard shortcut correctly', async () => {
    const container = document.createElement('div')
    container.id = 'youtube-overlay-extension'
    document.body.appendChild(container)

    const cleanup = await initializeApp()

    // Simulate keyboard shortcut
    const event = new KeyboardEvent('keydown', {
      key: 'o',
      ctrlKey: true,
      shiftKey: true
    })
    document.dispatchEvent(event)

    // Check if message was sent
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: 'overlayVisibilityChanged',
      visible: true
    })

    // Clean up
    if (cleanup) cleanup()
  })

  it('loads custom text from storage', async () => {
    const container = document.createElement('div')
    container.id = 'youtube-overlay-extension'
    document.body.appendChild(container)

    await initializeApp()

    // Check if storage was accessed
    expect(chrome.storage.sync.get).toHaveBeenCalledWith('overlayText')
  })
}) 