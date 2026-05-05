# MacOS Brave/Chrome Scroll Zoom

A Chrome/Brave extension for macOS that lets you zoom pages with the scroll wheel + a modifier key.

## Why

macOS doesn't natively support zooming with Option or Command + scroll. This extension fills that gap and lets you pick whichever modifier key feels natural, without touching the trackpad's built-in pinch-to-zoom.

## Features

- Scroll zoom triggered by a configurable modifier key (default: **Control ⌃**)
- Choose between Control, Option ⌥, or Command ⌘ from the settings popup
- Zoom range: 25 % – 500 %, shown in the address bar just like native browser zoom
- Trackpad pinch-to-zoom is completely unaffected
- Works in Brave and Chrome on macOS

## Requirements

- macOS
- Google Chrome or Brave Browser (Chromium-based)

## Installation (development)

1. Clone this repo
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select this directory

## Usage

Hold your chosen modifier key and scroll. Click the extension icon in the toolbar to change the modifier key or reset to the default.

## Known limitations

**Browser internal pages** (`brave://…`, `chrome://…`, extension pages) are outside the reach of any Chrome extension — the browser's security model prevents content scripts from running there. Scroll zoom will not work on those pages regardless of settings. Use the native ⌘ `+` / ⌘ `−` shortcuts or trackpad pinch instead.

## Project structure

```
manifest.json        Extension manifest (v3)
src/
  content.js         Intercepts wheel events and triggers zoom
  background.js      Service worker — applies zoom via chrome.tabs API
  popup/             Settings popup (modifier key selector)
icons/               Extension icons (16, 48, 128 px)
```

## License

MIT
