let endTime = Date.now() + 60000;
let flashingEnabled = false;

chrome.storage.sync.get('effectEnabled', (data) => {
    flashingEnabled = data.effectEnabled === true;
    if (flashingEnabled) {
        startFlashing();
    }
});

function calculateInterval() {
    let timeRemaining = endTime - Date.now();
    return Math.max(500, timeRemaining / 10);
}

function startFlashing() {
    let intervalId = setInterval(() => {
        if (!flashingEnabled || Date.now() > endTime) {
            clearInterval(intervalId);
            return;
        }
        
        let interval = calculateInterval();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    window.postMessage({ type: 'flashRing' });
                }
            });
        });
    }, 1000);
}

// Listen for messages from popup.js to enable/disable the effect
chrome.runtime.onMessage.addListener((message) => {
    if (typeof message.effectEnabled !== 'undefined') {
        flashingEnabled = message.effectEnabled;
        
        // Save the status to Chrome storage
        chrome.storage.sync.set({ effectEnabled: flashingEnabled });
        
        if (flashingEnabled) {
            startFlashing();
        }
    }
});

// Start the flashing effect when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('effectEnabled', (data) => {
        flashingEnabled = data.effectEnabled === true;
        if (flashingEnabled) {
            startFlashing();
        }
    });
});
