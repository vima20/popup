<template>
  <div class="popup-container">
    <h2>Video Overlay</h2>
    
    <div class="status-panel" :class="connectionStatus ? 'connected' : 'disconnected'">
      <span class="status-label">Palvelin:</span>
      <span class="status-value">{{ connectionStatus ? 'Yhdistetty' : 'Ei yhteyttä' }}</span>
      <button @click="testConnection" class="status-button">Testaa</button>
    </div>
    
    <div class="message-panel">
      <p class="viewer-info">
        <strong>Käytössä:</strong> {{ activeTabCount }} videopalvelua
      </p>
      
      <div class="hotkey-info">
        <p>Paina <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F3</kbd> näyttääksesi viestin videon päällä</p>
      </div>
      
      <div class="director-link">
        <p>
          <strong>Ohjaajan työpöytä:</strong><br>
          <a href="http://localhost:3000/director.html" target="_blank">
            http://localhost:3000/director.html
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Tila
const connectionStatus = ref(false);
const activeTabCount = ref(0);

// Testaa WebSocket-yhteys
async function testConnection() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'testConnection' });
    connectionStatus.value = response?.connected || false;
  } catch (error) {
    console.error('Error testing connection:', error);
    connectionStatus.value = false;
  }
}

// Nouda aktiivisten välilehtien määrä
async function getActiveTabCount() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'getVideoTabCount' });
    activeTabCount.value = response?.count || 0;
  } catch (error) {
    console.error('Error getting active tab count:', error);
    activeTabCount.value = 0;
  }
}

// Elinkaarimetodit
onMounted(() => {
  testConnection();
  getActiveTabCount();
  
  // Päivitä aktiivisten välilehtien määrä 3 sekunnin välein
  const interval = setInterval(getActiveTabCount, 3000);
  
  // Siivoa interval unmount-vaiheessa
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<style scoped>
.popup-container {
  width: 300px;
  padding: 15px;
  font-family: Arial, sans-serif;
}

h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.status-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.connected {
  background-color: #e8f5e9;
}

.disconnected {
  background-color: #ffebee;
}

.status-label {
  font-weight: bold;
}

.status-value {
  flex-grow: 1;
  margin-left: 5px;
  margin-right: 5px;
}

.status-button {
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.8em;
}

.status-button:hover {
  background-color: #1976D2;
}

.message-panel {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
}

.viewer-info {
  margin-top: 0;
  margin-bottom: 10px;
}

.hotkey-info {
  margin-bottom: 10px;
  text-align: center;
}

.hotkey-info kbd {
  background-color: #eee;
  border-radius: 3px;
  border: 1px solid #b4b4b4;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  color: #333;
  display: inline-block;
  font-size: 0.85em;
  padding: 2px 5px;
}

.director-link {
  border-top: 1px solid #ddd;
  padding-top: 10px;
  text-align: center;
}

.director-link a {
  color: #2196F3;
  text-decoration: none;
  word-break: break-all;
}

.director-link a:hover {
  text-decoration: underline;
}
</style> 