// Google Maps Module - Maps Integration

let autocompletePickup = null;
let autocompleteDestination = null;

/**
 * Initialize Google Maps Autocomplete
 */
function initGoogleMaps() {
    console.log("Google Maps API loaded successfully");
    
    // Create autocomplete for pickup input
    if (google.maps.places) {
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (pickupInput) {
            autocompletePickup = new google.maps.places.Autocomplete(pickupInput, {
                types: ['geocode', 'establishment'],
                componentRestrictions: {country: 'us'}
            });
            
            autocompletePickup.addListener('place_changed', function() {
                const place = autocompletePickup.getPlace();
                if (place && place.formatted_address) {
                    pickupInput.value = place.formatted_address;
                    pickupInput.style.borderColor = 'var(--neon-cyan)';
                    pickupInput.style.color = 'var(--neon-cyan)';
                    
                    // Show date/time picker if destination is filled
                    if (destinationInput && destinationInput.value.trim().length > 0) {
                        document.getElementById('datetime-container').classList.add('active');
                    }
                    
                    // Reset to normal color after 1 second
                    setTimeout(() => {
                        pickupInput.style.color = 'var(--text-light)';
                    }, 1000);
                    
                    // Check field completion
                    if (window.checkAllFieldsComplete) {
                        window.checkAllFieldsComplete();
                    }
                    
                    // Update price and calculate distance
                    if (window.calculateDistanceAndUpdatePrice) {
                        window.calculateDistanceAndUpdatePrice();
                    }
                }
            });
        }
        
        if (destinationInput) {
            // Create autocomplete for destination input
            autocompleteDestination = new google.maps.places.Autocomplete(destinationInput, {
                types: ['geocode', 'establishment'],
                componentRestrictions: {country: 'us'}
            });
            
            autocompleteDestination.addListener('place_changed', function() {
                const place = autocompleteDestination.getPlace();
                if (place && place.formatted_address) {
                    destinationInput.value = place.formatted_address;
                    destinationInput.style.borderColor = 'var(--neon-cyan)';
                    destinationInput.style.color = 'var(--neon-cyan)';
                    
                    // Show date/time picker if pickup is filled
                    if (pickupInput && pickupInput.value.trim().length > 0) {
                        document.getElementById('datetime-container').classList.add('active');
                    }
                    
                    // Reset to normal color after 1 second
                    setTimeout(() => {
                        destinationInput.style.color = 'var(--text-light)';
                    }, 1000);
                    
                    // Check field completion
                    if (window.checkAllFieldsComplete) {
                        window.checkAllFieldsComplete();
                    }
                    
                    // Update price and calculate distance
                    if (window.calculateDistanceAndUpdatePrice) {
                        window.calculateDistanceAndUpdatePrice();
                    }
                }
            });
        }
        
        console.log("Google Places Autocomplete initialized");
    } else {
        console.error("Google Maps Places API not available");
    }
}

/**
 * Get address from coordinates using Google Geocoding API
 */
function getAddressFromCoordinatesGoogle(lat, lng) {
    return new Promise((resolve, reject) => {
        // Using Google Geocoding API
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: lat, lng: lng };
        
        geocoder.geocode({ location: latlng }, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    reject(new Error('No results found'));
                }
            } else {
                reject(new Error('Geocoder failed: ' + status));
            }
        });
    });
}

// Make functions available globally
window.initGoogleMaps = initGoogleMaps;
window.getAddressFromCoordinatesGoogle = getAddressFromCoordinatesGoogle;
