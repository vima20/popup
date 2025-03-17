<template>
  <div class="container">
    <h1 class="title">Video Overlay</h1>
    
    <div class="status-group">
      <div class="status-label">Yhteyden tila:</div>
      <div :class="['connection-status', connectionStatusClass]">
        {{ connectionStatus }}
      </div>
    </div>
    
    <div v-if="wsState.error" class="error-message">
      {{ wsState.error }}
    </div>
    
    <div class="message-group">
      <input 
        v-model="message"
        type="text"
        placeholder="Kirjoita viesti"
        @keyup.enter="sendMessage"
        :disabled="!wsState.isConnected"
      />
      <button 
        @click="sendMessage" 
        :disabled="!wsState.isConnected || !message"
      >
        Lähetä
      </button>
    </div>

    <div class="style-group">
      <select v-model="messageStyle.position">
        <option value="top">Ylhäällä</option>
        <option value="middle">Keskellä</option>
        <option value="bottom">Alhaalla</option>
      </select>
      
      <input 
        v-model="messageStyle.color"
        type="color"
        title="Tekstin väri"
      />
      
      <input 
        v-model="messageStyle.fontSize"
        type="number"
        min="12"
        max="48"
        step="2"
        title="Fonttikoko"
      />px
      
      <input 
        v-model="messageStyle.duration"
        type="number"
        min="1"
        max="10"
        step="1"
        title="Kesto sekunteina"
      />s
    </div>
    
    <div class="button-group">
      <button @click="testOverlay" :disabled="!wsState.isConnected">
        Testaa overlay
      </button>
      <button @click="reconnect" :disabled="wsState.isConnected">
        Yhdistä uudelleen
      </button>
    </div>
  </div>

  <div v-if="showOverlay" class="video-overlay">
    {{ overlayText }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWebSocket } from '../lib/websocket'
import type { Message } from '../types/message'

// Tilan hallinta
const message = ref('')
const messageStyle = ref({
  position: 'middle' as const,
  color: '#ffffff',
  fontSize: '24',
  duration: 3
})

// WebSocket-yhteys
const ws = useWebSocket()
const { state: wsState } = ws

// Lasketut arvot
const connectionStatus = computed(() => 
  wsState.value.isConnected ? 'Yhdistetty' : 'Ei yhteyttä'
)

const connectionStatusClass = computed(() => ({
  'connected': wsState.value.isConnected,
  'disconnected': !wsState.value.isConnected
}))

// Metodit
function sendMessage() {
  if (!message.value || !wsState.value.isConnected) return

  const messageData: Message = {
    type: 'showMessage',
    content: message.value,
    style: {
      position: messageStyle.value.position,
      color: messageStyle.value.color,
      fontSize: `${messageStyle.value.fontSize}px`,
      duration: messageStyle.value.duration * 1000
    }
  }

  if (ws.sendMessage(messageData)) {
    message.value = ''
  }
}

function testOverlay() {
  const testMessage: Message = {
    type: 'showMessage',
    content: 'Testiviesti',
    style: {
      position: messageStyle.value.position,
      color: messageStyle.value.color,
      fontSize: `${messageStyle.value.fontSize}px`,
      duration: messageStyle.value.duration * 1000
    }
  }

  ws.sendMessage(testMessage)
}

function reconnect() {
  ws.connect()
}

const showOverlay = ref(false)
const overlayText = ref('Hello World!')

// Näppäinyhdistelmän kuuntelija
const handleKeyPress = (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === '9') {
    showOverlay.value = !showOverlay.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.container {
  @apply w-[400px] p-4 font-sans;
}

.title {
  @apply m-0 mb-4 text-xl text-center;
}

.status-group {
  @apply flex items-center mb-4;
}

.status-label {
  @apply mr-2;
}

.connection-status {
  @apply px-2 py-1 rounded font-bold;
}

.connected {
  @apply bg-green-500 text-white;
}

.disconnected {
  @apply bg-red-500 text-white;
}

.error-message {
  @apply mb-4 p-2 bg-red-100 text-red-700 rounded;
}

.message-group {
  @apply flex gap-2 mb-4;
}

.message-group input {
  @apply flex-1 px-2 py-1 border rounded;
}

.style-group {
  @apply flex gap-2 mb-4 items-center;
}

.style-group select,
.style-group input {
  @apply px-2 py-1 border rounded;
}

.style-group input[type="number"] {
  @apply w-16;
}

.button-group {
  @apply flex gap-2;
}

button {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed;
}

.video-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  z-index: 9999;
  font-size: 2rem;
  pointer-events: none;
}
</style> 