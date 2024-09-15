function flashRing() {
    let ringImage = document.createElement('img');
    ringImage.src = chrome.runtime.getURL('images/ring.png'); // Update with actual image path
    ringImage.style.position = 'fixed';
    ringImage.style.width = '50px';
    ringImage.style.height = '50px';
    ringImage.style.zIndex = '10000';
    ringImage.style.top = `${Math.random() * window.innerHeight}px`;
    ringImage.style.left = `${Math.random() * window.innerWidth}px`;
    
    document.body.appendChild(ringImage);
    
    setTimeout(() => {
        ringImage.remove();
    }, 500); // Show the image for 500 ms
}

// Listen for messages from the background script
window.addEventListener('message', (event) => {
    if (event.data.type === 'flashRing') {
        flashRing();
    }
});  