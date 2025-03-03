<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="text-white text-4xl font-bold">
      Hello world!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

// Toggle visibility when CTRL + F3 is pressed
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key === 'F3') {
    isVisible.value = !isVisible.value
  }
}

// Add event listener when component is mounted
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

// Remove event listener when component is unmounted
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script> 