<template>
  <div class="popup">
    <h1>YouTube Overlay</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="overlay-text">Overlay Text:</label>
        <input
          id="overlay-text"
          v-model="text"
          type="text"
          placeholder="Enter text to display"
          :disabled="isLoading"
        >
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Saving...' : 'Save' }}
      </button>
    </form>
    <p class="hint">Press CTRL + SHIFT + F3 to toggle overlay</p>
    <div v-if="statusMessage" :class="['status', statusClass]">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Chrome API types
declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

interface StatusMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

const text = ref<string>('Hello world!')
const statusMessage = ref<string>('')
const statusClass = ref<string>('')
const isLoading = ref<boolean>(false)

onMounted(async () => {
  // Load saved text
  try {
    const result = await chrome.storage.sync.get('overlayText')
    if (result.overlayText) {
      text.value = result.overlayText
    }
  } catch (error) {
    console.error('Failed to load text:', error)
  }
})

function updateStatus(status: StatusMessage) {
  statusMessage.value = status.text
  statusClass.value = status.type === 'success' ? 'text-green-600' : 'text-red-600'
}

async function handleSubmit() {
  if (isLoading.value) return
  
  try {
    isLoading.value = true

    // Send message to background script
    await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: 'updateOverlayText', text: text.value },
        response => {
          if (response && response.success) {
            resolve(response)
          } else {
            reject(new Error(response?.error || 'Failed to save'))
          }
        }
      )
    })

    updateStatus({
      text: 'Settings saved successfully!',
      type: 'success'
    })
  } catch (error) {
    console.error('Failed to save settings:', error)
    updateStatus({
      text: 'Failed to save settings',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.popup {
  width: 300px;
  padding: 20px;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.hint {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

.status {
  margin-top: 1rem;
  font-size: 0.875rem;
  text-align: center;
}

.text-green-600 {
  color: #059669;
}

.text-red-600 {
  color: #dc2626;
}
</style> 