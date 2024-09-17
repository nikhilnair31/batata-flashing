function flashRing(images) {
    // Pick a random image from the array
    let randomImage = images[Math.floor(Math.random() * images.length)];

    let ringImage = document.createElement('img');
    console.log(`randomImage: ${randomImage}`);
    ringImage.src = randomImage; // Update with actual image path
    ringImage.style.position = 'fixed';
    ringImage.style.width = '150px';
    ringImage.style.height = '150px';
    ringImage.style.zIndex = '10000';
    ringImage.style.top = `${Math.random() * window.innerHeight}px`;
    ringImage.style.left = `${Math.random() * window.innerWidth}px`;

    // Add error handling
    ringImage.onerror = () => {
        console.error(`Failed to load image: ${randomImage}`);
    };
    
    document.body.appendChild(ringImage);
    
    setTimeout(() => {
        ringImage.remove();
    }, 100); // Show the image for 500 ms
}

// Listen for messages from the background script
window.addEventListener('message', (event) => {
    if (event.data.type === 'flashRing') {
        flashRing(event.data.images);
    }
});  