<template>
  <div class="popup">
    <h1>Video Overlay</h1>
    <div class="status" :class="{ connected: isConnected }">
      {{ connectionStatus }}
    </div>
    <div class="controls">
      <input 
        v-model="overlayText"
        type="text"
        placeholder="Enter overlay text"
        @keyup.enter="sendOverlay"
      />
      <button @click="sendOverlay" :disabled="!isConnected">
        Show Overlay
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useWebSocket } from '../composables/useWebSocket';

export default defineComponent({
  name: 'App',
  setup() {
    const overlayText = ref('');
    const isConnected = ref(false);
    const connectionStatus = ref('Connecting...');

    const ws = useWebSocket();

    const sendOverlay = () => {
      if (!overlayText.value.trim() || !isConnected.value) return;
      
      ws.sendMessage({
        type: 'overlay',
        content: overlayText.value
      });
      
      overlayText.value = '';
    };

    onMounted(() => {
      ws.connect();

      ws.onOpen(() => {
        isConnected.value = true;
        connectionStatus.value = 'Connected';
      });

      ws.onClose(() => {
        isConnected.value = false;
        connectionStatus.value = 'Disconnected';
      });

      ws.onError((error) => {
        isConnected.value = false;
        connectionStatus.value = `Error: ${error.message}`;
      });

      ws.onMessage((data) => {
        if (data.type === 'welcome') {
          console.log('Received welcome message:', data);
        }
      });
    });

    onUnmounted(() => {
      ws.disconnect();
    });

    return {
      overlayText,
      isConnected,
      connectionStatus,
      sendOverlay
    };
  }
});
</script>

<style scoped>
.popup {
  width: 300px;
  padding: 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  font-size: 1.5rem;
  margin: 0 0 1rem;
  color: #2c3e50;
}

.status {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  text-align: center;
}

.status.connected {
  background-color: #d4edda;
  color: #155724;
}

.controls {
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 