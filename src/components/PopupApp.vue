<template>
  <div class="popup-container">
    <header class="header">
      <h1>Video Overlay</h1>
      <span class="version">v{{ version }}</span>
    </header>

    <main class="main">
      <div class="connection-status" :class="{ connected: isConnected }">
        {{ connectionStatus }}
      </div>

      <div class="message-form">
        <textarea
          v-model="message"
          placeholder="Kirjoita viesti..."
          :disabled="!isConnected"
          @keydown.ctrl.enter="sendMessage"
        ></textarea>

        <div class="style-controls">
          <select v-model="messageStyle.position">
            <option value="top">Ylhäällä</option>
            <option value="middle">Keskellä</option>
            <option value="bottom">Alhaalla</option>
          </select>

          <input
            type="color"
            v-model="messageStyle.color"
            title="Tekstin väri"
          >

          <select v-model="messageStyle.fontSize">
            <option value="16px">Pieni</option>
            <option value="24px">Normaali</option>
            <option value="32px">Suuri</option>
          </select>

          <input
            type="number"
            v-model="messageStyle.duration"
            min="1"
            max="60"
            title="Kesto sekunteina"
          >
        </div>

        <button
          @click="sendMessage"
          :disabled="!isConnected || !message"
          class="send-button"
        >
          Lähetä
        </button>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>
    </main>

    <footer class="footer">
      <button @click="toggleOverlay" class="toggle-button">
        Näytä/Piilota overlay
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWebSocket } from '../composables/useWebSocket';
import { type MessageStyle } from '../types/message';

// Versio
const version = '7.0.0';

// Tila
const message = ref('');
const error = ref<string | null>(null);
const messageStyle = ref<MessageStyle>({
  position: 'middle',
  color: '#ffffff',
  fontSize: '24px',
  duration: 5
});

const isConnected = ref(false);
const webSocket = useWebSocket();

// Yhdistä websocket
webSocket.onOpen(() => {
  isConnected.value = true;
});

webSocket.onClose(() => {
  isConnected.value = false;
});

webSocket.onError((err: Error) => {
  console.error('WebSocket error:', err);
  isConnected.value = false;
});

// Lasketut arvot
const connectionStatus = computed(() => 
  isConnected.value ? 'Yhdistetty' : 'Ei yhteyttä'
);

// Viestin lähetys
const sendMessage = (message: any) => {
  webSocket.sendMessage(message);
};

// Metodit
async function toggleOverlay() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      error.value = 'Ei aktiivista välilehteä';
      return;
    }

    // Tarkista ensin onko content script ladattu tällä välilehdellä
    try {
      chrome.tabs.sendMessage(tab.id, { type: 'ping' }, () => {
        if (chrome.runtime.lastError) {
          // Content script ei ole ladattu tällä välilehdellä
          error.value = 'Avaa ensin YouTube-video';
          return;
        }
        
        // Content script on ladattu, voidaan lähettää komento
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { type: 'toggleOverlay' });
        }
      });
    } catch (err) {
      error.value = 'Content script ei ole käytettävissä tällä sivulla';
      console.error('Content script not available:', err);
    }
  } catch (err) {
    error.value = 'Virhe toggleOverlay-toiminnossa';
    console.error('Error toggling overlay:', err);
  }
}
</script>

<style scoped>
.popup-container {
  width: 300px;
  padding: 16px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header h1 {
  margin: 0;
  font-size: 18px;
}

.version {
  font-size: 12px;
  color: #666;
}

.connection-status {
  padding: 8px;
  margin-bottom: 16px;
  text-align: center;
  background-color: #ff4444;
  color: white;
  border-radius: 4px;
}

.connection-status.connected {
  background-color: #44aa44;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 8px;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.style-controls {
  display: flex;
  gap: 8px;
}

.style-controls select,
.style-controls input {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.send-button {
  padding: 8px;
  background-color: #4444ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  padding: 8px;
  margin-bottom: 16px;
  background-color: #ffeeee;
  color: #cc0000;
  border-radius: 4px;
}

.footer {
  display: flex;
  justify-content: center;
}

.toggle-button {
  width: 100%;
  padding: 8px;
  background-color: #666666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-button:hover {
  background-color: #555555;
}
</style> 