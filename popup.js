// Popup script
const app = Vue.createApp({
  data() {
    return {
      overlayText: 'Hello world!',
      statusMessage: '',
      statusClass: ''
    }
  },
  mounted() {
    // Load saved text
    chrome.storage.sync.get('overlayText', (result) => {
      if (result.overlayText) {
        this.overlayText = result.overlayText;
      }
    });
  },
  methods: {
    async saveText() {
      try {
        await chrome.storage.sync.set({ overlayText: this.overlayText });
        // Update overlay text in content script
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          await chrome.tabs.sendMessage(tab.id, {
            type: 'updateOverlayText',
            text: this.overlayText
          });
        }
        this.statusMessage = 'Settings saved successfully!';
        this.statusClass = 'text-green-600';
      } catch (error) {
        console.error('Failed to save settings:', error);
        this.statusMessage = 'Failed to save settings';
        this.statusClass = 'text-red-600';
      }
    }
  },
  template: `
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
        Press CTRL + SHIFT + F3 to toggle overlay
      </div>
    </div>
  `
});

app.mount('#app');

document.getElementById('save').addEventListener('click', async () => {
  const text = document.getElementById('text').value;
  await chrome.storage.sync.set({ overlayText: text });
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'updateOverlayText', text });
  }
});
