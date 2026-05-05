# MacOS Brave/Chrome Scroll Zoom

A Chrome/Brave extension for macOS that enables page zoom via the scroll wheel combined with a modifier key — **Control**, **Option (⌥)**, or **Command (⌘)**.

## Why

On macOS, Chrome natively zooms with Ctrl+scroll (which also catches trackpad pinch gestures). This extension extends that behaviour to the Option and Command modifier keys, and gives you smoother, configurable control over zoom speed and reset behaviour.

## Features

- Scroll zoom triggered by ⌃ (Control), ⌥ (Option), or ⌘ (Command) + mouse wheel
- Configurable zoom step and maximum/minimum zoom levels
- Per-tab zoom state, reset on tab reload
- Works in Brave and Chrome on macOS

## Requirements

- macOS
- Google Chrome or Brave Browser (Chromium-based)

## Installation (development)

1. Clone this repo
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select this directory

## Project structure

```
manifest.json        Extension manifest (v3)
src/
  content.js         Intercepts wheel events and applies zoom
  background.js      Service worker — handles tab zoom via chrome.tabs API
  popup/             Optional settings popup
icons/               Extension icons (16, 48, 128 px)
```

## License

MIT
