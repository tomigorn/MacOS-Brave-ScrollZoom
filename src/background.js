const STEP = 0.1;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 5.0;

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action !== 'zoom' || !sender.tab) return;
  if (msg.delta !== 1 && msg.delta !== -1) return;
  chrome.tabs.getZoom(sender.tab.id, current => {
    const raw = current + msg.delta * STEP;
    const next = Math.round(Math.min(Math.max(raw, MIN_ZOOM), MAX_ZOOM) * 100) / 100;
    chrome.tabs.setZoom(sender.tab.id, next);
  });
});
