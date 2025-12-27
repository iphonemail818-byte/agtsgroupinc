// iPhone-Compatible Main.js
console.log('AGTS Main.js loading on iPhone');

// 1. First, hide loading screen IMMEDIATELY
try {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.cssText = `
            opacity: 0 !important;
            visibility: hidden !important;
            display: none !important;
            transition: none !important;
        `;
        console.log('Loading screen hidden immediately');
    }
} catch(e) {}

// 2. Show main content IMMEDIATELY
try {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.style.cssText = `
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
        `;
        console.log('Main content shown immediately');
    }
} catch(e) {}

// 3. When DOM loads, do more setup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded on iPhone');
    
    // Final cleanup of loading screen
    setTimeout(function() {
        const ls = document.getElementById('loading-screen');
        if (ls && ls.parentNode) {
            ls.parentNode.removeChild(ls);
            console.log('Loading screen removed from DOM');
        }
    }, 100);
    
    // Add basic functionality
    const bookBtn = document.getElementById('submit-btn');
    if (bookBtn) {
        bookBtn.onclick = function() {
            alert('Booking would be processed');
        };
    }
});

// 4. Absolute fallback - if nothing else works
setTimeout(function() {
    console.log('Fallback timeout executing');
    
    // Remove ALL loading elements
    const elements = document.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.id && el.id.includes('loading')) {
            el.style.display = 'none';
        }
        if (el.className && typeof el.className === 'string' && el.className.includes('loading')) {
            el.style.display = 'none';
        }
    }
    
    // Show everything else
    document.body.style.visibility = 'visible';
}, 2000);
