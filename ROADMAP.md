# Roadmap

Steps to go from zero to a working scroll-zoom extension.

---

## Step 1 — Understand what we're intercepting

**Goal:** know exactly what events fire when the user scrolls with a modifier key held down.

- A physical scroll wheel fires `WheelEvent` on the DOM element under the cursor.
- On macOS, `WheelEvent.deltaY` is the vertical scroll delta.
- Modifier state is available via `event.ctrlKey` (⌃), `event.altKey` (⌥), `event.metaKey` (⌘).

**Critical macOS caveat — trackpad pinch:**
macOS reports trackpad pinch-to-zoom to Chrome as a `WheelEvent` with `ctrlKey: true`, even though the physical Control key is not pressed. The OS synthesises it. This means we **cannot** simply check `event.ctrlKey` — that would intercept pinch gestures too, which we explicitly do not want.

**How to distinguish physical ⌃ from trackpad pinch:**
Track whether the Control key is actually held down using `keydown`/`keyup` events:
```
let physicalCtrlDown = false;
window.addEventListener('keydown', e => { if (e.key === 'Control') physicalCtrlDown = true; });
window.addEventListener('keyup',   e => { if (e.key === 'Control') physicalCtrlDown = false; });
```
In the wheel handler, only act when `event.ctrlKey && physicalCtrlDown`. A trackpad pinch will have `event.ctrlKey = true` but `physicalCtrlDown = false`, so it passes through untouched.

The same physical-key tracking approach applies for Option (`e.key === 'Alt'`) and Command (`e.key === 'Meta'`) when those are selected in settings.

- **Action:** write a minimal test page that logs all WheelEvent fields and key events so we can verify the above behaviour before writing extension code.

---

## Step 2 — Zoom mechanism

We use **`chrome.tabs.setZoom`**.

- Background service worker calls `chrome.tabs.setZoom(tabId, newLevel)`.
- Zoom levels are floats; `1.0` = 100 %. We clamp to `0.25` (25 %) – `5.0` (500 %), which matches Chrome's own hard limits.
- Requires `"tabs"` permission in manifest.
- Content script detects the modifier+scroll, sends a message (`chrome.runtime.sendMessage`) to the background, background applies the zoom.
- Layout reflows correctly (same as Ctrl+`+` / Ctrl+`-`), and the zoom level is visible in the address bar indicator top-right, just like native browser zoom.

---

## Step 3 — Write the Manifest v3 skeleton

- Create `manifest.json` with:
  - `"manifest_version": 3`
  - `"permissions": ["tabs", "storage"]`
  - `"background": { "service_worker": "src/background.js" }`
  - `"content_scripts"` targeting `"<all_urls>"` with `src/content.js`
  - `"action": {}` to register the toolbar icon (opens the settings popup)
  - `"options_ui"` or `"action.default_popup"` pointing to `src/popup/popup.html`
  - Icons placeholder
- Load unpacked in `chrome://extensions` and verify no errors.

---

## Step 4 — Content script: detect modifier+scroll

Track the physical modifier key state and intercept wheel events:

```js
let modifierDown = false;

function updateModifier(e, down) {
  // key name comes from settings; default 'Control'
  if (e.key === activeModifierKey) modifierDown = down;
}
window.addEventListener('keydown', e => updateModifier(e, true));
window.addEventListener('keyup',   e => updateModifier(e, false));

window.addEventListener('wheel', e => {
  if (!modifierDown) return;           // physical key not held — ignore
  e.preventDefault();                  // suppress normal scroll while zooming
  const delta = e.deltaY > 0 ? -1 : 1;
  chrome.runtime.sendMessage({ action: 'zoom', delta });
}, { passive: false });
```

- `passive: false` is required to be able to call `preventDefault`.
- `activeModifierKey` is loaded from `chrome.storage.sync` on script init and refreshed when the background broadcasts a settings change.
- `deltaMode` can be `0` (pixels), `1` (lines), `2` (pages) — normalise before use if needed; for now we only care about sign.
- Some sites (Google Docs, Figma) install their own wheel handlers — test there.

---

## Step 5 — Background service worker: apply zoom

```js
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action !== 'zoom') return;
  chrome.tabs.getZoom(sender.tab.id, current => {
    const next = clamp(current + msg.delta * STEP, MIN_ZOOM, MAX_ZOOM);
    chrome.tabs.setZoom(sender.tab.id, next);
  });
});
```

- Constants: `STEP = 0.1` (tune later), `MIN_ZOOM = 0.25` (25 %), `MAX_ZOOM = 5.0` (500 %).
- Service workers are ephemeral in MV3 — keep no mutable state here; read zoom and settings from their respective APIs each time.

---

## Step 6 — Settings popup

A small popup opens when the user clicks the extension icon in the toolbar.

**UI elements:**
- Heading: "Scroll Zoom Settings"
- Modifier key selector: radio buttons or a `<select>` for **Control (default)**, **Option (⌥)**, **Command (⌘)**
- "Reset to defaults" button — sets modifier back to Control
- Current zoom level display (optional, nice to have)

**Implementation:**
- `popup.html` + `popup.js` loaded via `"action": { "default_popup": "src/popup/popup.html" }` in manifest.
- On open: read `chrome.storage.sync.get('modifierKey')` and reflect current value in the UI.
- On change: `chrome.storage.sync.set({ modifierKey: selectedKey })`, then send a message to all tabs' content scripts so they update `activeModifierKey` without needing a page reload.
- On reset: set storage to `'Control'` and update UI.

**Storage schema:**
```json
{ "modifierKey": "Control" }   // default
```
Valid values: `"Control"`, `"Alt"`, `"Meta"`.

---

## Step 7 — Test matrix

| Scenario | Expected |
|---|---|
| ⌃ held + scroll up (default setting) | zoom in |
| ⌃ held + scroll down (default setting) | zoom out |
| Trackpad pinch (no physical key pressed) | normal pinch zoom, extension does nothing |
| No modifier + scroll | normal page scroll, unaffected |
| Settings → switch to Option, then ⌥ + scroll | zoom in/out |
| Settings → switch to Command, then ⌘ + scroll | zoom in/out |
| Settings → Reset to defaults | modifier resets to Control |
| Old modifier after settings change (no reload) | no longer triggers zoom |
| Zoom at minimum (0.25) | no further zoom out |
| Zoom at maximum (5.0) | no further zoom in |
| Navigate away and back | zoom resets (Chrome resets tab zoom on navigation) |
| Iframe in page | wheel event bubbles to top frame — verify it still works |
| chrome:// pages | content scripts don't run here — expected no-op |

---

## Step 8 — Tune feel

- Try raw sign-only delta vs proportional `event.deltaY` for finer control.
- Consider exposing zoom step size as a second setting in the popup.
- Optionally debounce the message to avoid flooding the background on fast scrolls.

---

## Step 9 — Polish and package

- Add proper 16 / 48 / 128 px icons.
- Write a short privacy policy (required for Chrome Web Store — no data is collected).
- `zip` the extension directory, upload to Chrome Web Store developer dashboard.
- Test the published version on a clean Chrome profile.

---

## Open questions

1. Does `preventDefault` on a `WheelEvent` with `altKey` or `metaKey` interfere with any macOS system gesture? Needs testing on a real machine.
2. Do we need a per-site disable toggle (e.g., for Figma which has its own zoom)? Deferred for now.
3. MV3 service workers can be killed after ~30 s of inactivity — does this cause dropped messages? Unlikely since the worker wakes on `onMessage`, but worth verifying under fast repeated scrolling.
