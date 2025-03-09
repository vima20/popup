// Background script
console.log('Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "overlayVisibilityChanged") {
    console.log("Overlay visibility changed:", message.visible);
  }
  return true;
}); 