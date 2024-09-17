let endTime = Date.now() + 60000;
let flashingEnabled = false;
let flashDuration = 100; // Default duration in milliseconds
let flashGap = 1000; // Default gap in milliseconds
let intervalId;

chrome.storage.sync.get(['effectEnabled', 'flashGap', 'flashDuration', 'flashGap'], (data) => {
    flashingEnabled = data.effectEnabled === true;
    flashGap = data.flashGap || 1000;
    flashDuration = data.flashDuration || 100;
    flashGap = data.flashGap || 1000;

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
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
            
            if (tabs && tabs.length > 0) {
                const tab = tabs[0];
                const url = new URL(tab.url);
                
                // Check if the URL is not a restricted page
                if (url.protocol === 'chrome:' || url.host === 'chrome.google.com') {
                    console.log('Cannot script the extensions gallery or other restricted pages.');
                    return;
                }

                const images = [
                    chrome.runtime.getURL('images/pngegg0.png'),
                    chrome.runtime.getURL('images/pngegg1.png'),
                    chrome.runtime.getURL('images/pngegg2.png'),
                    chrome.runtime.getURL('images/pngegg3.png')
                ];
                
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (images) => {
                        window.postMessage({ type: 'flashRing', images });
                    },
                    args: [images]
                });
            } else {
                console.error('No active tab found.');
            }
        });
    }, flashGap);
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
    
    if (typeof message.flashGap !== 'undefined') {
        flashGap = message.flashGap;
        chrome.storage.sync.set({ flashGap: flashGap });

        if (flashingEnabled) {
            startFlashing();
        }
    }

    if (typeof message.flashDuration !== 'undefined') {
        flashDuration = message.flashDuration;
        chrome.storage.sync.set({ flashDuration: flashDuration });
    }

    if (typeof message.flashGap !== 'undefined') {
        flashGap = message.flashGap;
        chrome.storage.sync.set({ flashGap: flashGap });

        if (flashingEnabled) {
            startFlashing();
        }
    }
});

// Start the flashing effect when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['effectEnabled', 'flashGap'], (data) => {
        flashingEnabled = data.effectEnabled === true;
        flashGap = data.flashGap || 1000;
        
        if (flashingEnabled) {
            startFlashing();
        }
    });
});
