document.addEventListener('DOMContentLoaded', () => {
    const toggleEffectCheckbox = document.getElementById('toggleEffect');
    
    // Load saved state from localStorage
    const isEffectEnabled = localStorage.getItem('effectEnabled') === 'true';
    
    // Set checkbox state based on saved value
    toggleEffectCheckbox.checked = isEffectEnabled;
    
    // Notify the background script when the checkbox is toggled
    toggleEffectCheckbox.addEventListener('change', () => {
        const isEnabled = toggleEffectCheckbox.checked;
        
        // Save the status in localStorage
        localStorage.setItem('effectEnabled', isEnabled);
        
        // Send a message to the background script to enable/disable the effect
        chrome.runtime.sendMessage({ effectEnabled: isEnabled });
    });
});
