// ULTRA-SIMPLE MAIN.JS FOR IPHONE
console.log('main.js loading on iPhone...');

// Global error handler
window.addEventListener('error', function(e) {
    console.error('iPhone Error:', e.message);
    forceShowContent();
    return true;
});

// When DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready on iPhone');
    
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Always hide loading after 3 seconds
    setTimeout(function() {
        console.log('Auto-hiding loading screen');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s';
        }
        
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.5s';
        }
        
        // Remove loading screen after fade
        setTimeout(function() {
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 500);
        
    }, 3000); // 3 second delay
});

// Backup: if everything else fails
setTimeout(function() {
    forceShowContent();
}, 5000); // 5 second absolute timeout

function forceShowContent() {
    console.log('Force showing content');
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
    }
}

// Make sure window.onload also triggers
window.onload = function() {
    console.log('Window fully loaded on iPhone');
};
