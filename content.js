const images = [
    'images/pngegg (0).png',
    'images/pngegg (1).png',
    'images/pngegg (2).png',
    'images/pngegg (3).png'
];

function flashRing() {
    // Pick a random image from the array
    let randomImage = images[Math.floor(Math.random() * images.length)];

    let ringImage = document.createElement('img');
    ringImage.src = chrome.runtime.getURL("./"+randomImage); // Update with actual image path
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