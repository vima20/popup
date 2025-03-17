import { defineManifest } from '@crxjs/vite-plugin'
import { version } from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: "Video Overlay",
  version,
  description: "Display text overlay on videos",
  permissions: [
    "activeTab",
    "scripting"
  ],
  host_permissions: [
    "*://*/*"
  ],
  action: {
    default_popup: "popup.html",
    default_icon: {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  icons: {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  content_scripts: [
    {
      matches: ["*://*/*"],
      js: ["content.js"],
      css: ["assets/content.css"]
    }
  ],
  background: {
    service_worker: "background.js",
    type: "module"
  }
}) 