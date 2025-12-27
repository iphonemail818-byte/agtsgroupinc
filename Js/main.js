// iPhone-Safe Main.js - NO ERRORS
console.log('AGTS Main.js loading...');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Get elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // ALWAYS hide loading screen after 3 seconds
    setTimeout(function() {
        console.log('Hiding loading screen now');
        
        // Hide loading screen
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            console.log('Added fade-out class');
        }
        
        // Show main content
        if (mainContent) {
            mainContent.classList.add('fade-in');
            console.log('Added fade-in class');
        }
        
        // Completely remove loading screen after animation
        setTimeout(function() {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.style.display = 'none';
                console.log('Loading screen hidden');
            }
        }, 500); // Wait for fade animation
        
    }, 3000); // 3 second delay
    
    // Initialize basic functionality
    initializeBasicFeatures();
});

// Initialize basic features (NO Google Maps dependency)
function initializeBasicFeatures() {
    console.log('Initializing basic features...');
    
    // Get basic elements
    const bookButton = document.getElementById('submit-btn');
    const burgerButton = document.getElementById('burger-btn');
    
    // Basic book button functionality
    if (bookButton) {
        bookButton.addEventListener('click', function() {
            alert('Booking feature will be available once all files are loaded correctly.');
        });
    }
    
    // Basic burger menu functionality
    if (burgerButton) {
        burgerButton.addEventListener('click', function() {
            const menu = document.getElementById('dropdown-menu');
            if (menu) {
                menu.classList.toggle('active');
            }
        });
    }
    
    console.log('Basic features initialized');
}

// Backup: If DOMContentLoaded doesn't fire, use window.onload
window.onload = function() {
    console.log('Window loaded - backup trigger');
    
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Force hide loading after 4 seconds max
    setTimeout(function() {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
        }
    }, 4000);
};

// Global error handler
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.message, 'at', event.filename, 'line', event.lineno);
    
    // Even on error, show the main content
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
        }
    }, 1000);
    
    return true;
});
