// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Overlay Extension installed')
})

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_OVERLAY') {
    // Forward message to content script
    chrome.tabs.sendMessage(sender.tab!.id!, message)
  }
  return true
}) 