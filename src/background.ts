// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'overlayVisibilityChanged') {
    console.log('Overlay visibility changed:', message.visible)
  }
  return true
}) 