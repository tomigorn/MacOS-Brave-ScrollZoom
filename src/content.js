const DEFAULTS = { modifierKey: 'Control' };

let activeKey = DEFAULTS.modifierKey;
let modifierDown = false;

chrome.storage.sync.get(DEFAULTS, ({ modifierKey }) => {
  activeKey = modifierKey;
});

// Reflect settings changes immediately without a page reload.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync' || !changes.modifierKey) return;
  activeKey = changes.modifierKey.newValue;
  modifierDown = false;
});

window.addEventListener('keydown', e => {
  if (e.key === activeKey) modifierDown = true;
});

window.addEventListener('keyup', e => {
  if (e.key === activeKey) modifierDown = false;
});

// Prevent the modifier from getting stuck when the window loses focus
// (e.g. user Cmd+Tabs away while holding the key).
window.addEventListener('blur', () => {
  modifierDown = false;
});

window.addEventListener('wheel', e => {
  if (!modifierDown) return;
  e.preventDefault();
  chrome.runtime.sendMessage({ action: 'zoom', delta: e.deltaY > 0 ? -1 : 1 });
}, { passive: false });
