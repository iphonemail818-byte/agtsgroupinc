// Menu Module - Burger Menu Functionality

let isMenuOpen = false;

/**
 * Toggle the burger menu
 */
function toggleMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const backdrop = document.getElementById('backdrop');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        burgerBtn.classList.add('active');
        dropdownMenu.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        burgerBtn.classList.remove('active');
        dropdownMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Initialize menu event listeners
 */
function initializeMenuEvents() {
    const burgerBtn = document.getElementById('burger-btn');
    const backdrop = document.getElementById('backdrop');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    // Burger menu toggle
    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on backdrop
    backdrop.addEventListener('click', function() {
        if (isMenuOpen) {
            toggleMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !dropdownMenu.contains(e.target) && 
            !burgerBtn.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Menu Link Click Handlers
    const homeLink = document.getElementById('home-link');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');
    const reservationsLink = document.getElementById('reservations-link');
    const helpLink = document.getElementById('help-link');
    const safetyLink = document.getElementById('safety-link');
    const legalLink = document.getElementById('legal-link');
    
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Sign Up feature would open here!");
        toggleMenu();
    });
    
    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Login feature would open here!");
        toggleMenu();
    });
    
    reservationsLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Reservations page would open here! View or manage your bookings.");
        toggleMenu();
    });
    
    helpLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Help center would open here!");
        toggleMenu();
    });
    
    safetyLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Safety information page would open here!");
        toggleMenu();
    });
    
    legalLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Legal information page would open here!");
        toggleMenu();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMenuEvents);
