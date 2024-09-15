document.addEventListener('DOMContentLoaded', () => {
    const toggleEffectCheckbox = document.getElementById('toggleEffect');
    const intervalSlider = document.getElementById('intervalSlider');
    const intervalValue = document.getElementById('intervalValue');

    // Load saved state from localStorage
    chrome.storage.sync.get(['effectEnabled', 'flashInterval'], (data) => {
        toggleEffectCheckbox.checked = data.effectEnabled === true;
        intervalSlider.value = data.flashInterval || 1000;
        intervalValue.textContent = intervalSlider.value;
    });

    // Notify the background script when the checkbox is toggled
    toggleEffectCheckbox.addEventListener('change', () => {
        const isEnabled = toggleEffectCheckbox.checked;

        // Save the status in localStorage
        chrome.storage.sync.set({ effectEnabled: isEnabled });

        // Send a message to the background script to enable/disable the effect
        chrome.runtime.sendMessage({ effectEnabled: isEnabled });
    });

    // Update the interval when the slider changes
    intervalSlider.addEventListener('input', () => {
        const interval = intervalSlider.value;
        intervalValue.textContent = interval;

        // Save the interval in localStorage
        chrome.storage.sync.set({ flashInterval: interval });

        // Send a message to the background script to update the interval
        chrome.runtime.sendMessage({ flashInterval: interval });
    });
});
