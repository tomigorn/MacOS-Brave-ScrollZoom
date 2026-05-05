const DEFAULT_KEY = 'Control';
const VALID_KEYS = new Set(['Control', 'Alt', 'Meta']);

const radios = document.querySelectorAll('input[name="key"]');

function applyKey(key) {
  const safe = VALID_KEYS.has(key) ? key : DEFAULT_KEY;
  const radio = document.querySelector(`input[value="${safe}"]`);
  if (radio) radio.checked = true;
}

chrome.storage.sync.get({ modifierKey: DEFAULT_KEY }, ({ modifierKey }) => {
  applyKey(modifierKey);
});

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (VALID_KEYS.has(radio.value)) {
      chrome.storage.sync.set({ modifierKey: radio.value });
    }
  });
});

document.getElementById('reset').addEventListener('click', () => {
  chrome.storage.sync.set({ modifierKey: DEFAULT_KEY });
  applyKey(DEFAULT_KEY);
});
