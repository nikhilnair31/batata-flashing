let endTime = Date.now() + 60000;
let flashingEnabled = false;
let flashInterval = 1000; // Default interval in milliseconds
let intervalId;

chrome.storage.sync.get(['effectEnabled', 'flashInterval'], (data) => {
  flashingEnabled = data.effectEnabled === true;
  flashInterval = data.flashInterval || 1000;

  if (flashingEnabled) {
    startFlashing();
  }
});

function calculateInterval() {
  let timeRemaining = endTime - Date.now();
  return Math.max(500, timeRemaining / 10);
}

function startFlashing() {
  clearInterval(intervalId); // Clear any previous intervals
  intervalId = setInterval(() => {
    if (!flashingEnabled || Date.now() > endTime) {
      clearInterval(intervalId);
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          window.postMessage({ type: 'flashRing' });
        }
      });
    });
  }, flashInterval);
}

// Listen for messages from popup.js to enable/disable the effect or change the interval
chrome.runtime.onMessage.addListener((message) => {
  if (typeof message.effectEnabled !== 'undefined') {
    flashingEnabled = message.effectEnabled;
    chrome.storage.sync.set({ effectEnabled: flashingEnabled });

    if (flashingEnabled) {
      startFlashing();
    } else {
      clearInterval(intervalId);
    }
  }

  if (typeof message.flashInterval !== 'undefined') {
    flashInterval = message.flashInterval;
    chrome.storage.sync.set({ flashInterval: flashInterval });

    if (flashingEnabled) {
      startFlashing();
    }
  }
});

// Start the flashing effect when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['effectEnabled', 'flashInterval'], (data) => {
    flashingEnabled = data.effectEnabled === true;
    flashInterval = data.flashInterval || 1000;

    if (flashingEnabled) {
      startFlashing();
    }
  });
});
