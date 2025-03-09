import { ref } from 'vue'

// Chrome API types
declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

interface StorageData {
  overlayText: string;
}

export function useOverlayText() {
  const isLoading = ref<boolean>(false)

  async function saveOverlayText(text: string): Promise<void> {
    try {
      isLoading.value = true
      await chrome.storage.sync.set({ overlayText: text })
    } catch (error) {
      console.error('Failed to save overlay text:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function loadOverlayText(): Promise<string | null> {
    try {
      isLoading.value = true
      const result = await chrome.storage.sync.get('overlayText') as StorageData
      return result.overlayText || null
    } catch (error) {
      console.error('Failed to load overlay text:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    saveOverlayText,
    loadOverlayText
  }
} 