import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import WebSocket from 'ws'
import { WebSocketServer } from 'ws'

describe('WebSocket Server Tests', () => {
  let wss
  const port = 8080
  const url = `ws://localhost:${port}`

  beforeAll(() => {
    wss = new WebSocketServer({ port })
  })

  afterAll(() => {
    wss.close()
  })

  it('WebSocket-yhteyden muodostaminen', (done) => {
    const ws = new WebSocket(url)
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN)
      ws.close()
      done()
    })
  })

  it('Viestin välitys kahden klientsin välillä', (done) => {
    const ws1 = new WebSocket(url)
    const ws2 = new WebSocket(url)

    let connected = 0
    const message = { type: 'showMessage', content: 'Test message' }

    function checkConnected() {
      connected++
      if (connected === 2) {
        ws1.send(JSON.stringify(message))
      }
    }

    ws1.on('open', checkConnected)
    ws2.on('open', checkConnected)

    ws2.on('message', (data) => {
      const received = JSON.parse(data.toString())
      expect(received).toEqual(message)
      ws1.close()
      ws2.close()
      done()
    })
  })

  it('Virheellisen JSON-viestin käsittely', (done) => {
    const ws = new WebSocket(url)

    ws.on('open', () => {
      ws.send('invalid json')
    })

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString())
      expect(message.type).toBe('error')
      expect(message.content).toContain('Invalid JSON')
      ws.close()
      done()
    })
  })

  it('Yhteyden sulkeminen', (done) => {
    const ws = new WebSocket(url)

    ws.on('open', () => {
      ws.close()
    })

    ws.on('close', () => {
      expect(ws.readyState).toBe(WebSocket.CLOSED)
      done()
    })
  })
}) 