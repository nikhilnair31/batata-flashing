document.addEventListener('DOMContentLoaded', () => {
    const durationSlider = document.getElementById('durationSlider');
    const durationValue = document.getElementById('durationValue');
    const gapSlider = document.getElementById('gapSlider');
    const gapValue = document.getElementById('gapValue');
    
    // Load saved state from localStorage
    chrome.storage.sync.get(['effectEnabled', 'flashGap', 'flashDuration', 'flashGap'], (data) => {
        toggleEffectCheckbox.checked = data.effectEnabled === true;
        intervalSlider.value = data.flashGap || 1000;
        intervalValue.textContent = intervalSlider.value;
        durationSlider.value = data.flashDuration || 100;
        durationValue.textContent = durationSlider.value;
        gapSlider.value = data.flashGap || 1000;
        gapValue.textContent = gapSlider.value;
    });
    
    // Update the duration when the slider changes
    durationSlider.addEventListener('input', () => {
        const duration = durationSlider.value;
        durationValue.textContent = duration;
        
        // Save the duration in localStorage
        chrome.storage.sync.set({ flashDuration: duration });
        
        // Send a message to the background script to update the duration
        chrome.runtime.sendMessage({ flashDuration: duration });
    });
    
    // Update the gap when the slider changes
    gapSlider.addEventListener('input', () => {
        const gap = gapSlider.value;
        gapValue.textContent = gap;
        
        // Save the gap in localStorage
        chrome.storage.sync.set({ flashGap: gap });
        
        // Send a message to the background script to update the gap
        chrome.runtime.sendMessage({ flashGap: gap });
    });
});