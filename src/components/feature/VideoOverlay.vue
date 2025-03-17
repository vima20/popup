<template>
  <div v-if="isOverlayVisible" class="video-overlay" :style="overlayStyle">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWebSocket } from '../../composables/useWebSocket';
import { type Message, type MessageStyle } from '../../types/message';

// Tila
const isOverlayVisible = ref(false);
const message = ref('');
const error = ref<string | null>(null);

// Overlay-tyylit
const overlayStyle = ref({
  display: 'none',
  position: 'fixed' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 9999999,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  fontSize: '24px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center' as const,
  pointerEvents: 'none' as const
});

// Näytä viesti
function showMessage(content: string, style?: MessageStyle) {
  message.value = content;
  
  if (style) {
    if (style.position === 'top') {
      overlayStyle.value.top = '10%';
    } else if (style.position === 'bottom') {
      overlayStyle.value.top = '90%';
    } else {
      overlayStyle.value.top = '50%';
    }
    
    if (style.color) {
      overlayStyle.value.color = style.color;
    }
    
    if (style.fontSize) {
      overlayStyle.value.fontSize = style.fontSize;
    }
  }
  
  overlayStyle.value.display = 'block';
  isOverlayVisible.value = true;
  
  if (style?.duration) {
    setTimeout(() => {
      hideOverlay();
    }, style.duration * 1000);
  }
}

// Piilota overlay
function hideOverlay() {
  overlayStyle.value.display = 'none';
  isOverlayVisible.value = false;
}

const webSocket = useWebSocket();
webSocket.onMessage((data: Message) => {
  if (data.type === 'showMessage' && typeof data.content === 'string') {
    showMessage(data.content, data.style);
  }
});
webSocket.onOpen(() => {
  error.value = null;
});
webSocket.onClose(() => {
  error.value = 'Yhteys katkesi';
});
webSocket.onError((err: Error) => {
  error.value = err.message;
});
webSocket.connect();

// Julkiset metodit
defineExpose({
  showMessage,
  hideOverlay
});
</script>

<style scoped>
.video-overlay {
  position: fixed;
  z-index: 9999999;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  text-align: center;
  pointer-events: none;
  transition: all 0.3s ease;
}
</style> 
