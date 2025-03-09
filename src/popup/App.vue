<template>
  <div class="container bg-white rounded-lg shadow-lg p-4">
    <h1 class="text-xl font-bold mb-4">YouTube Overlay Extension</h1>
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1" for="overlayText">
        Overlay Text
      </label>
      <input
        id="overlayText"
        v-model="overlayText"
        type="text"
        class="w-full px-3 py-2 border rounded"
      />
      <button
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="saveText"
      >
        Save
      </button>
      <div class="status-indicator mt-2 text-sm" :class="statusClass">
        {{ statusMessage }}
      </div>
    </div>
    <div class="text-sm text-gray-600">
      Press CTRL + SHIFT + O to toggle overlay
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const overlayText = ref('Hello world!')
const statusMessage = ref('')
const statusClass = ref('')

onMounted(async () => {
  const result = await chrome.storage.sync.get('overlayText')
  if (result.overlayText) {
    overlayText.value = result.overlayText
  }
})

const saveText = async () => {
  try {
    await chrome.storage.sync.set({ overlayText: overlayText.value })
    statusMessage.value = 'Settings saved successfully!'
    statusClass.value = 'text-green-600'
  } catch (error) {
    statusMessage.value = 'Failed to save settings'
    statusClass.value = 'text-red-600'
  }
}
</script> 