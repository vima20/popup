import { beforeAll, vi } from 'vitest'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
})

// Set up window
global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator

// Add missing DOM elements and methods
global.Node = dom.window.Node
global.NodeList = dom.window.NodeList
global.HTMLElement = dom.window.HTMLElement
global.HTMLDivElement = dom.window.HTMLDivElement
global.Element = dom.window.Element
global.Event = dom.window.Event
global.KeyboardEvent = dom.window.KeyboardEvent

// Add missing DOM methods
document.createElement = dom.window.document.createElement.bind(dom.window.document)
document.createElementNS = dom.window.document.createElementNS.bind(dom.window.document)
document.createTextNode = dom.window.document.createTextNode.bind(dom.window.document)
document.dispatchEvent = dom.window.document.dispatchEvent.bind(dom.window.document)
document.addEventListener = dom.window.document.addEventListener.bind(dom.window.document)
document.removeEventListener = dom.window.document.removeEventListener.bind(dom.window.document)

// Mock Chrome API
global.chrome = {
  storage: {
    sync: {
      get: vi.fn().mockResolvedValue({ overlayText: 'Hello world!' }),
      set: vi.fn().mockResolvedValue(undefined)
    }
  },
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn()
    }
  }
} as any

// Mock window.matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock window.getComputedStyle
window.getComputedStyle = vi.fn().mockReturnValue({
  getPropertyValue: vi.fn()
})

beforeAll(() => {
  // Mock chrome API
  global.chrome = {
    runtime: {
      sendMessage: vi.fn(),
      onMessage: {
        addListener: vi.fn(),
        removeListener: vi.fn()
      }
    },
    storage: {
      sync: {
        get: vi.fn().mockResolvedValue({ overlayText: 'Hello world!' }),
        set: vi.fn().mockResolvedValue(undefined)
      }
    },
    tabs: {
      query: vi.fn()
    }
  } as any

  // Mock document
  global.document = {
    readyState: 'complete',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    createElement: vi.fn(() => ({
      style: {},
      id: '',
      appendChild: vi.fn(),
      remove: vi.fn()
    })),
    getElementById: vi.fn(),
    body: {
      appendChild: vi.fn()
    }
  } as any

  // Mock DOM
  document.body.innerHTML = '<div id="app"></div>'
}) 