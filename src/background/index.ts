console.log('Background script loaded')

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Overlay Extension installed')
})

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message)
  
  const handleMessage = async () => {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      const tab = tabs[0]

      if (!tab?.id || !tab.url?.includes('youtube.com')) {
        console.log('Not a YouTube tab or no active tab')
        sendResponse({ error: 'Not a YouTube tab' })
        return
      }

      // Tarkista onko content script ladattu
      try {
        await chrome.tabs.sendMessage(tab.id, { type: 'ping' })
      } catch (error) {
        console.log('Content script not ready, injecting...')
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        })
      }

      // Lähetä alkuperäinen viesti
      if (message.type === 'getOverlayState') {
        try {
          const response = await chrome.tabs.sendMessage(tab.id, message)
          sendResponse(response)
        } catch (error) {
          console.error('Error sending getOverlayState message:', error)
          sendResponse({ visible: false })
        }
      }

      if (message.type === 'updateOverlayText') {
        try {
          const response = await chrome.tabs.sendMessage(tab.id, message)
          sendResponse(response)
        } catch (error) {
          console.error('Error sending updateOverlayText message:', error)
          sendResponse({ success: false })
        }
      }
    } catch (error) {
      console.error('Error handling message:', error)
      sendResponse({ error: 'Failed to process message' })
    }
  }

  handleMessage()
  return true // Keep message channel open for async response
})

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('youtube.com')) {
    console.log('YouTube tab loaded:', tabId)
  }
}) 