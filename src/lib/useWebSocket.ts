import { ref, onMounted, onUnmounted } from 'vue'

export interface WebSocketMessage {
  type: 'showMessage' | 'hideMessage' | 'ping'
  content?: string
  style?: {
    position?: 'top' | 'middle' | 'bottom'
    color?: string
    fontSize?: string
    duration?: number
  }
}

export function useWebSocket() {
  const connectionStatus = ref<'Connected' | 'Disconnected' | 'Connecting...'>('Disconnected')
  const errorMessage = ref('')
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    connectionStatus.value = 'Connecting...'
    errorMessage.value = ''
    chrome.runtime.sendMessage({ type: 'reconnectWebSocket' })
  }

  const handleConnectionStatus = (message: any) => {
    if (message.type === 'connectionStatus') {
      connectionStatus.value = message.status
      if (message.error) {
        errorMessage.value = message.error
        if (reconnectAttempts.value < maxReconnectAttempts) {
          setTimeout(connect, Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000))
          reconnectAttempts.value++
        }
      } else {
        errorMessage.value = ''
        reconnectAttempts.value = 0
      }
    }
  }

  onMounted(() => {
    chrome.runtime.sendMessage({ type: 'getConnectionStatus' }, (response) => {
      if (response) {
        connectionStatus.value = response.status
        errorMessage.value = response.error || ''
        reconnectAttempts.value = response.attempts || 0
      }
    })

    chrome.runtime.onMessage.addListener(handleConnectionStatus)
  })

  onUnmounted(() => {
    chrome.runtime.onMessage.removeListener(handleConnectionStatus)
  })

  return {
    connectionStatus,
    errorMessage,
    reconnectAttempts,
    connect
  }
} 