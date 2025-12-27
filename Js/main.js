// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const searchPill = document.getElementById('search-pill');
    const bookingForm = document.getElementById('booking-form');
    const collapsedSearch = document.getElementById('collapsed-search');
    const backdrop = document.getElementById('backdrop');
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    const currentLocationBtn = document.getElementById('current-location');
    const addStopBtn = document.getElementById('add-stop-btn');
    const stopsContainer = document.getElementById('stops-container');
    const datetimeContainer = document.getElementById('datetime-container');
    const datetimeBtn = document.getElementById('datetime-btn');
    const datetimeText = document.getElementById('datetime-text');
    const submitBtn = document.getElementById('submit-btn');
    const bookingCard = document.getElementById('booking-card');
    
    // PRICE DISPLAY ELEMENTS
    const priceDisplay = document.getElementById('price-display');
    const priceAmount = document.getElementById('price-amount');
    const priceNote = document.getElementById('price-note');
    const priceBreakdown = document.getElementById('price-breakdown');
    
    // Global variables
    let stopCount = 0;
    let selectedDateTime = null;
    let selectedPassengerCount = 1;
    let selectedPets = null;
    let autocompletePickup = null;
    let autocompleteDestination = null;
    
    // Distance variables for pricing
    let distance = 0;
    let duration = 0;
    
    // Simulate loading screen for 3 seconds
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        mainContent.classList.add('fade-in');
        
        // After loading screen fades out, remove it from DOM
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3000);
    
    // Expand booking form when search pill is clicked
    searchPill.addEventListener('click', expandBookingForm);
    
    // Expand booking form function
    function expandBookingForm() {
        collapsedSearch.classList.add('hidden');
        bookingForm.classList.add('active');
        backdrop.classList.add('active');
        bookingCard.style.zIndex = '101';
        document.body.style.overflow = 'hidden';
        
        // Focus on pickup input after animation
        setTimeout(() => {
            pickupInput.focus();
        }, 300);
    }
    
    // Collapse booking form function
    function collapseBookingForm() {
        collapsedSearch.classList.remove('hidden');
        bookingForm.classList.remove('active');
        backdrop.classList.remove('active');
        bookingCard.style.zIndex = '100';
        document.body.style.overflow = 'auto';
    }
    
    // Use current location for pickup
    currentLocationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Show loading state
        const originalIcon = currentLocationBtn.innerHTML;
        currentLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        currentLocationBtn.disabled = true;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Success - set the pickup location
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    
                    // Use Google Geocoding API to get address
                    getAddressFromCoordinatesGoogle(latitude, longitude)
                        .then(address => {
                            pickupInput.value = address;
                            pickupInput.style.borderColor = 'var(--neon-cyan)';
                            pickupInput.style.color = 'var(--neon-cyan)';
                            
                            // Show date/time picker if destination is filled
                            if (destinationInput.value.trim().length > 0) {
                                datetimeContainer.classList.add('active');
                            }
                            
                            // Check field completion
                            checkAllFieldsComplete();
                            
                            // Update price and calculate distance
                            calculateDistanceAndUpdatePrice();
                        })
                        .catch(error => {
                            // Fallback to coordinates
                            pickupInput.value = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                            pickupInput.style.borderColor = 'var(--neon-cyan)';
                            
                            // Check field completion
                            checkAllFieldsComplete();
                        })
                        .finally(() => {
                            // Reset button
                            currentLocationBtn.innerHTML = originalIcon;
                            currentLocationBtn.disabled = false;
                        });
                },
                function(error) {
                    console.error("Geolocation error:", error);
                    // Reset button
                    currentLocationBtn.innerHTML = originalIcon;
                    currentLocationBtn.disabled = false;
                },
                { 
                    timeout: 10000,
                    enableHighAccuracy: true 
                }
            );
        } else {
            // Browser doesn't support geolocation
            currentLocationBtn.innerHTML = originalIcon;
            currentLocationBtn.disabled = false;
        }
    });
    
    // Get address from coordinates using Google Geocoding API
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
    
    // Show date/time field when destination input starts
    destinationInput.addEventListener('input', function() {
        if (destinationInput.value.trim().length > 0 && pickupInput.value.trim().length > 0) {
            datetimeContainer.classList.add('active');
        } else {
            datetimeContainer.classList.remove('active');
        }
        checkAllFieldsComplete();
        calculateDistanceAndUpdatePrice();
    });
    
    // Also show date/time when pickup is filled
    pickupInput.addEventListener('input', function() {
        if (destinationInput.value.trim().length > 0 && pickupInput.value.trim().length > 0) {
            datetimeContainer.classList.add('active');
        }
        checkAllFieldsComplete();
        calculateDistanceAndUpdatePrice();
    });
    
    // Add additional stop
    addStopBtn.addEventListener('click', function() {
        stopCount++;
        
        const stopItem = document.createElement('div');
        stopItem.className = 'stop-item';
        stopItem.innerHTML = `
            <div class="stop-number">${stopCount}</div>
            <div class="stop-input">
                <input type="text" 
                       class="form-input stop-location" 
                       placeholder="Additional stop ${stopCount}"
                       autocomplete="off">
            </div>
            <button class="remove-stop" type="button" title="Remove Stop">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        stopsContainer.appendChild(stopItem);
        
        // Add event listener to remove button
        const removeBtn = stopItem.querySelector('.remove-stop');
        removeBtn.addEventListener('click', function() {
            // Add fade out animation
            stopItem.style.opacity = '0';
            stopItem.style.transform = 'translateX(-10px)';
            stopItem.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                stopItem.remove();
                updateStopNumbers();
                updatePriceDisplay();
            }, 300);
        });
        
        // Setup Google Autocomplete for the new stop if available
        if (google && google.maps && google.maps.places) {
            new google.maps.places.Autocomplete(stopItem.querySelector('.stop-location'), {
                types: ['geocode', 'establishment'],
                componentRestrictions: {country: 'us'}
            });
        }
        
        // Focus on the new stop input
        setTimeout(() => {
            const stopInput = stopItem.querySelector('.stop-location');
            stopInput.focus();
        }, 100);
        
        // Update price
        updatePriceDisplay();
    });
    
    // Update stop numbers after removal
    function updateStopNumbers() {
        const stopNumbers = stopsContainer.querySelectorAll('.stop-number');
        stopNumbers.forEach((number, index) => {
            number.textContent = index + 1;
        });
        stopCount = stopNumbers.length;
    }
    
    // Calculate distance between pickup and destination
    function calculateDistanceAndUpdatePrice() {
        const pickup = pickupInput.value.trim();
        const destination = destinationInput.value.trim();
        
        if (!pickup || !destination || !window.google || !google.maps) {
            // Don't calculate if we don't have both addresses
            updatePriceDisplay();
            return;
        }
        
        // Use Google Distance Matrix API
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [pickup],
                destinations: [destination],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.IMPERIAL,
            },
            function(response, status) {
                if (status === 'OK') {
                    const element = response.rows[0].elements[0];
                    if (element.status === 'OK') {
                        // Convert distance from miles to kilometers if needed
                        distance = element.distance.value / 1609.34; // Convert meters to miles
                        duration = element.duration.value / 60; // Convert seconds to minutes
                        
                        console.log(`Distance: ${distance.toFixed(2)} miles, Duration: ${duration.toFixed(2)} minutes`);
                        updatePriceDisplay();
                    } else {
                        console.error('Error calculating distance:', element.status);
                        updatePriceDisplay();
                    }
                } else {
                    console.error('Error from Distance Matrix:', status);
                    updatePriceDisplay();
                }
            }
        );
    }
    
    // Passenger Count Elements
    const passengerContainer = document.getElementById('passenger-container');
    const passengerBtns = document.querySelectorAll('.passenger-btn');
    const passengerCountDisplay = document.getElementById('passenger-count');
    const passengerBtn = document.getElementById('passenger-btn');
    
    // Handle passenger count selection
    passengerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all passenger buttons
            passengerBtns.forEach(b => b.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Update passenger count
            selectedPassengerCount = parseInt(this.getAttribute('data-value'));
            passengerCountDisplay.textContent = selectedPassengerCount;
            
            // Update button title
            passengerBtn.title = `${selectedPassengerCount} Passenger${selectedPassengerCount > 1 ? 's' : ''}`;
            passengerBtn.classList.add('selected');
            
            // Show pets container when passenger count is selected
            document.getElementById('pets-container').classList.add('active');
            
            // Check field completion
            checkAllFieldsComplete();
            
            // Update price
            updatePriceDisplay();
        });
    });
    
    // Set default passenger selection
    document.querySelector('.passenger-btn[data-value="1"]').classList.add('selected');
    passengerBtn.title = "1 Passenger";
    
    // Pets Elements
    const petsContainer = document.getElementById('pets-container');
    const petsBtns = document.querySelectorAll('.pets-btn');
    const petsBtn = document.getElementById('pets-btn');
    
    // Handle pets selection
    petsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all pets buttons
            petsBtns.forEach(b => b.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Update pets selection
            selectedPets = this.getAttribute('data-value');
            
            // Update button title and icon
            petsBtn.title = `Pets: ${selectedPets === 'yes' ? 'Yes' : 'No'}`;
            petsBtn.classList.add('selected');
            
            // Show passenger name container when pets is selected
            document.getElementById('passenger-name-container').classList.add('active');
            
            // Check field completion
            checkAllFieldsComplete();
            
            // Update price
            updatePriceDisplay();
        });
    });
    
    // Passenger Name Elements
    const passengerNameInput = document.getElementById('passenger-name-input');
    const passengerNameBtn = document.getElementById('passenger-name-btn');
    
    // Handle passenger name input
    passengerNameInput.addEventListener('input', function() {
        const name = this.value.trim();
        
        if (name.length > 0) {
            passengerNameBtn.title = `Name: ${name}`;
            passengerNameBtn.classList.add('selected');
            
            // Show phone container when name is entered
            document.getElementById('phone-container').classList.add('active');
        } else {
            passengerNameBtn.title = "Passenger name";
            passengerNameBtn.classList.remove('selected');
            document.getElementById('phone-container').classList.remove('active');
            document.getElementById('email-container').classList.remove('active');
            document.getElementById('notes-container').classList.remove('active');
        }
        checkAllFieldsComplete();
    });
    
    // Phone Elements
    const phoneInput = document.getElementById('phone-input');
    const phoneBtn = document.getElementById('phone-btn');
    
    // Handle phone input
    phoneInput.addEventListener('input', function() {
        const phone = this.value.trim();
        
        if (phone.length > 0) {
            phoneBtn.title = `Phone: ${phone}`;
            phoneBtn.classList.add('selected');
            
            // Show email container when phone is entered
            document.getElementById('email-container').classList.add('active');
        } else {
            phoneBtn.title = "Phone number";
            phoneBtn.classList.remove('selected');
            document.getElementById('email-container').classList.remove('active');
            document.getElementById('notes-container').classList.remove('active');
        }
        checkAllFieldsComplete();
    });
    
    // Email Elements
    const emailInput = document.getElementById('email-input');
    const emailBtn = document.getElementById('email-btn');
    
    // Handle email input
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email.length > 0) {
            emailBtn.title = `Email: ${email}`;
            emailBtn.classList.add('selected');
            
            // Show notes container when email is entered
            document.getElementById('notes-container').classList.add('active');
        } else {
            emailBtn.title = "Email address";
            emailBtn.classList.remove('selected');
            document.getElementById('notes-container').classList.remove('active');
        }
        checkAllFieldsComplete();
    });
    
    // Notes Elements
    const notesInput = document.getElementById('notes-input');
    const notesChars = document.getElementById('notes-chars');
    const notesBtn = document.getElementById('notes-btn');
    
    // Handle notes character count
    notesInput.addEventListener('input', function() {
        const length = this.value.length;
        notesChars.textContent = `${length}/500 characters`;
        
        // Update character counter color
        if (length > 450) {
            notesChars.classList.add('error');
            notesChars.classList.remove('warning');
        } else if (length > 400) {
            notesChars.classList.add('warning');
            notesChars.classList.remove('error');
        } else {
            notesChars.classList.remove('warning', 'error');
        }
        
        // Update button title if there's content
        if (length > 0) {
            notesBtn.title = `Notes: ${length} characters`;
            notesBtn.classList.add('selected');
        } else {
            notesBtn.title = "Add special notes";
            notesBtn.classList.remove('selected');
        }
    });
    
    // Progress Elements
    const progressFill = document.getElementById('progress-fill');
    const progressIndicator = document.getElementById('progress-indicator');
    
    // UPDATE PRICE DISPLAY - Using REALISTIC pricing
    function updatePriceDisplay() {
        const pickup = pickupInput.value.trim();
        const destination = destinationInput.value.trim();
        
        // Only show price if we have both pickup and destination
        if (!pickup || !destination) {
            priceDisplay.classList.remove('active');
            priceBreakdown.classList.remove('active');
            priceAmount.textContent = '$0.00';
            priceNote.textContent = 'Enter pickup and destination to see price';
            return;
        }
        
        // Show price display
        priceDisplay.classList.add('active');
        
        // Get additional stops
        const stopInputs = document.querySelectorAll('.stop-location');
        const stops = Array.from(stopInputs)
            .map(input => input.value.trim())
            .filter(stop => stop.length > 0);
        
        // Prepare data for pricing calculation
        const pricingData = {
            distance: distance || 10, // Use actual distance or default
            duration: duration || 25, // Use actual duration or default
            passengers: selectedPassengerCount,
            hasPets: selectedPets === 'yes',
            additionalStops: stops.length,
            dateTime: window.selectedDate || new Date(),
            isPeakHour: false,
            vehicleType: 'premium' // Luxury SUV
        };
        
        // Check if it's peak hour (6-9 AM or 4-7 PM on weekdays)
        if (window.selectedDate) {
            const hour = window.selectedDate.getHours();
            const day = window.selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const isWeekday = day >= 1 && day <= 5;
            const isMorningPeak = hour >= 6 && hour < 9;
            const isEveningPeak = hour >= 16 && hour < 19;
            pricingData.isPeakHour = isWeekday && (isMorningPeak || isEveningPeak);
        }
        
        // Use REALISTIC pricing calculation
        try {
            const fareDetails = calculateFare(pricingData);
            
            // Update price display with REALISTIC price
            priceAmount.textContent = `$${fareDetails.total.toFixed(2)}`;
            
            // Show distance info
            if (distance > 0) {
                priceNote.textContent = `Estimate for ${distance.toFixed(1)} miles`;
                
                // Add competitive comparison if significantly cheaper
                const comparison = compareWithUberBlack(distance, duration);
                if (comparison.savings > 5) {
                    priceNote.textContent += ` (Save $${comparison.savings.toFixed(2)} vs Uber Black)`;
                    priceNote.style.color = 'var(--success-green)';
                } else {
                    priceNote.style.color = '';
                }
            } else {
                priceNote.textContent = "Estimated fare";
                priceNote.style.color = '';
            }
            
            // Show breakdown if available and distance is known
            if (fareDetails.breakdown && distance > 0) {
                priceBreakdown.innerHTML = '';
                
                // Add base fare
                if (fareDetails.breakdown.base) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Base Fare</span><span>$${fareDetails.breakdown.base.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add distance charge
                if (fareDetails.breakdown.distance) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Distance (${distance.toFixed(1)} mi @ $${PRICING_CONFIG.perMileRate}/mi)</span><span>$${fareDetails.breakdown.distance.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add time charge
                if (fareDetails.breakdown.time && duration > 0) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Time (${duration.toFixed(0)} min @ $${PRICING_CONFIG.perMinuteRate}/min)</span><span>$${fareDetails.breakdown.time.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add passenger surcharge
                if (fareDetails.breakdown.passengers && selectedPassengerCount > 1) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Passenger Surcharge (${selectedPassengerCount})</span><span>$${fareDetails.breakdown.passengers.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add pets fee
                if (fareDetails.breakdown.pets && selectedPets === 'yes') {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Pet Fee</span><span>$${fareDetails.breakdown.pets.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add stops fee
                if (fareDetails.breakdown.stops && stops.length > 0) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Additional Stops (${stops.length})</span><span>$${fareDetails.breakdown.stops.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add peak hour surcharge
                if (fareDetails.breakdown.peakHour) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Peak Hour Surcharge</span><span>$${fareDetails.breakdown.peakHour.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add vehicle premium
                if (fareDetails.breakdown.vehicle) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Luxury SUV Premium</span><span>$${fareDetails.breakdown.vehicle.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add service fee
                if (fareDetails.breakdown.serviceFee) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Service Fee (${PRICING_CONFIG.serviceFeePercentage}%)</span><span>$${fareDetails.breakdown.serviceFee.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add booking fee
                if (fareDetails.breakdown.bookingFee) {
                    const item = document.createElement('div');
                    item.className = 'breakdown-item';
                    item.innerHTML = `<span>Booking Fee</span><span>$${fareDetails.breakdown.bookingFee.toFixed(2)}</span>`;
                    priceBreakdown.appendChild(item);
                }
                
                // Add total
                const totalItem = document.createElement('div');
                totalItem.className = 'breakdown-item';
                totalItem.innerHTML = `<span>Total</span><span>$${fareDetails.total.toFixed(2)}</span>`;
                priceBreakdown.appendChild(totalItem);
                
                priceBreakdown.classList.add('active');
            }
        } catch (error) {
            console.error("Error calculating price:", error);
            // Fallback to competitive estimate
            const competitivePrice = getCompetitiveEstimate(distance || 10, duration || 25);
            priceAmount.textContent = `$${competitivePrice.toFixed(2)}`;
            priceNote.textContent = "Estimated competitive fare";
            priceBreakdown.classList.remove('active');
        }
    }
    
    // Check if all required fields are complete
    function checkAllFieldsComplete() {
        const pickup = pickupInput.value.trim();
        const destination = destinationInput.value.trim();
        const datetime = window.selectedDateTime;
        const passengerCount = selectedPassengerCount;
        const pets = selectedPets;
        const passengerName = passengerNameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        
        // Count completed fields
        let completedCount = 0;
        const totalFields = 8;
        
        if (pickup) completedCount++;
        if (destination) completedCount++;
        if (datetime) completedCount++;
        if (passengerCount) completedCount++;
        if (pets) completedCount++;
        if (passengerName) completedCount++;
        if (phone) completedCount++;
        if (email && email.includes('@')) completedCount++;
        
        // Update progress bar
        const progressPercentage = (completedCount / totalFields) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update progress text
        const progressText = progressIndicator.querySelector('div');
        if (completedCount < totalFields) {
            progressText.textContent = `${completedCount} of ${totalFields} fields completed`;
        } else {
            progressText.textContent = "All fields complete! Ready to book";
            progressText.style.color = "var(--success-green)";
        }
        
        // Show/hide submit button
        if (completedCount === totalFields) {
            submitBtn.classList.add('active');
            submitBtn.disabled = false;
        } else {
            submitBtn.classList.remove('active');
            submitBtn.disabled = true;
        }
        
        return completedCount === totalFields;
    }
    
    // Function to highlight missing field
    function highlightMissingField(field) {
        // Remove any existing highlights
        removeHighlights();
        
        // Add highlight class based on field type
        if (field.classList.contains('form-input') || field.classList.contains('icon-input')) {
            field.classList.add('missing-field');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                field.classList.remove('missing-field');
            }, 3000);
        } else if (field.classList.contains('icon-btn') || field.classList.contains('pets-btn')) {
            // For icon buttons, highlight the button
            field.classList.add('missing-field-btn');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                field.classList.remove('missing-field-btn');
            }, 3000);
        }
    }
    
    // Function to remove all highlights
    function removeHighlights() {
        const highlightedFields = document.querySelectorAll('.missing-field, .missing-field-btn');
        highlightedFields.forEach(field => {
            field.classList.remove('missing-field');
            field.classList.remove('missing-field-btn');
        });
    }
    
    // Show validation error
    function showValidationError(message) {
        // Remove any existing error message
        const existingError = document.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>
            ${message}
        `;
        
        // Insert after form title
        const formTitle = document.querySelector('.form-title');
        formTitle.parentNode.insertBefore(errorDiv, formTitle.nextSibling);
        
        // Scroll error into view
        setTimeout(() => {
            errorDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.opacity = '0';
                errorDiv.style.transition = 'opacity 0.3s';
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Handle form submission
    submitBtn.addEventListener('click', function() {
        // Double-check all fields are complete
        if (!checkAllFieldsComplete()) {
            // Get form values to find first missing field
            const pickup = pickupInput.value.trim();
            const destination = destinationInput.value.trim();
            const datetime = window.selectedDateTime;
            const passengerCount = selectedPassengerCount;
            const pets = selectedPets;
            const passengerName = passengerNameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            
            // Find first missing field
            let firstMissingField = null;
            let errorMessage = "";
            
            if (!pickup) {
                firstMissingField = pickupInput;
                errorMessage = "Pickup location is required";
            } else if (!destination) {
                firstMissingField = destinationInput;
                errorMessage = "Destination is required";
            } else if (!datetime) {
                firstMissingField = datetimeBtn;
                errorMessage = "Date and time is required";
            } else if (!passengerCount) {
                firstMissingField = passengerBtn;
                errorMessage = "Please select passenger count";
            } else if (!pets) {
                firstMissingField = document.querySelector('.pets-btn');
                errorMessage = "Please indicate if traveling with pets";
            } else if (!passengerName) {
                firstMissingField = passengerNameInput;
                errorMessage = "Passenger name is required";
            } else if (!phone) {
                firstMissingField = phoneInput;
                errorMessage = "Phone number is required";
            } else if (!email) {
                firstMissingField = emailInput;
                errorMessage = "Email address is required";
            } else if (email && !email.includes('@')) {
                firstMissingField = emailInput;
                errorMessage = "Please enter a valid email address";
            }
            
            showValidationError(errorMessage);
            
            // Ensure form is expanded so user can see the field
            expandBookingForm();
            
            // Add visual highlight to the missing field
            if (firstMissingField) {
                highlightMissingField(firstMissingField);
                
                // Focus on the field or button
                setTimeout(() => {
                    if (firstMissingField.tagName === 'BUTTON') {
                        // For buttons, we can focus on them
                        firstMissingField.focus();
                    } else {
                        firstMissingField.focus();
                        
                        // Scroll the field into view with some padding
                        firstMissingField.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest'
                        });
                    }
                }, 100);
            }
            
            return;
        }
        
        // Show loading state on button
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i> PROCESSING...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Get form values
            const pickup = pickupInput.value.trim();
            const destination = destinationInput.value.trim();
            const datetime = window.selectedDateTime;
            const passengerCount = selectedPassengerCount;
            const pets = selectedPets;
            const passengerName = passengerNameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            const notes = notesInput.value.trim();
            const price = priceAmount.textContent;
            
            // Get additional stops
            const stopInputs = document.querySelectorAll('.stop-location');
            const stops = Array.from(stopInputs)
                .map(input => input.value.trim())
                .filter(stop => stop.length > 0);
            
            // Show success message with all details including price
            showBookingConfirmation(pickup, destination, datetime, passengerCount, pets, passengerName, phone, email, notes, stops, price);
            
            // Reset form
            collapseBookingForm();
            resetForm();
        }, 1500);
    });
    
    // Show booking confirmation
    function showBookingConfirmation(pickup, destination, datetime, passengerCount, pets, passengerName, phone, email, notes, stops, price) {
        const confirmationHTML = `
            <div style="
                background: rgba(0, 243, 255, 0.1);
                border: 1px solid var(--neon-cyan);
                border-radius: 12px;
                padding: 20px;
                margin-top: 20px;
                animation: fadeIn 0.5s ease;
            ">
                <h3 style="color: var(--neon-cyan); margin-bottom: 15px; text-align: center;">
                    <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
                    Booking Confirmed!
                </h3>
                <div style="font-size: 0.9rem; line-height: 1.6;">
                    <p><strong>Pickup:</strong> ${pickup}</p>
                    <p><strong>Destination:</strong> ${destination}</p>
                    ${distance > 0 ? `<p><strong>Distance:</strong> ${distance.toFixed(1)} miles</p>` : ''}
                    <p><strong>Date & Time:</strong> ${datetime}</p>
                    <p><strong>Passengers:</strong> ${passengerCount}</p>
                    <p><strong>Traveling with Pets:</strong> ${pets === 'yes' ? 'Yes' : 'No'}</p>
                    <p><strong>Passenger Name:</strong> ${passengerName}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Total Price:</strong> <span style="color: var(--neon-cyan); font-weight: bold;">${price}</span></p>
                    ${notes ? `<p><strong>Special Notes:</strong> ${notes}</p>` : ''}
                    ${stops.length > 0 ? `<p><strong>Additional Stops:</strong> ${stops.join(', ')}</p>` : ''}
                    <p style="margin-top: 15px; color: var(--neon-cyan);">
                        Your luxury SUV will arrive promptly. A confirmation has been sent to your email.
                    </p>
                </div>
            </div>
        `;
        
        // Insert after booking card
        bookingCard.insertAdjacentHTML('afterend', confirmationHTML);
        
        // Remove after 8 seconds
        setTimeout(() => {
            const confirmationDiv = document.querySelector('[style*="background: rgba(0, 243, 255, 0.1)"]');
            if (confirmationDiv) {
                confirmationDiv.style.opacity = '0';
                confirmationDiv.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (confirmationDiv.parentNode) {
                        confirmationDiv.parentNode.removeChild(confirmationDiv);
                    }
                }, 500);
            }
        }, 8000);
    }
    
    // Reset form to initial state
    function resetForm() {
        pickupInput.value = '';
        destinationInput.value = '';
        window.selectedDateTime = null;
        datetimeText.textContent = '';
        datetimeText.classList.remove('has-selection');
        datetimeBtn.classList.remove('selected');
        datetimeBtn.title = "Select date and time";
        datetimeBtn.innerHTML = '<i class="far fa-calendar-alt"></i>';
        datetimeContainer.classList.remove('active');
        
        // Reset passenger count
        passengerBtns.forEach(btn => btn.classList.remove('selected'));
        document.querySelector('.passenger-btn[data-value="1"]').classList.add('selected');
        selectedPassengerCount = 1;
        passengerCountDisplay.textContent = '1';
        passengerBtn.title = "1 Passenger";
        passengerBtn.classList.remove('selected');
        passengerBtn.innerHTML = '<i class="fas fa-users"></i>';
        passengerContainer.classList.remove('active');
        
        // Reset pets
        petsBtns.forEach(btn => btn.classList.remove('selected'));
        selectedPets = null;
        petsBtn.title = "Pet information";
        petsBtn.classList.remove('selected');
        petsBtn.innerHTML = '<i class="fas fa-paw"></i>';
        petsContainer.classList.remove('active');
        
        // Reset passenger name
        passengerNameInput.value = '';
        passengerNameBtn.title = "Passenger name";
        passengerNameBtn.classList.remove('selected');
        document.getElementById('passenger-name-container').classList.remove('active');
        
        // Reset phone
        phoneInput.value = '';
        phoneBtn.title = "Phone number";
        phoneBtn.classList.remove('selected');
        document.getElementById('phone-container').classList.remove('active');
        
        // Reset email
        emailInput.value = '';
        emailBtn.title = "Email address";
        emailBtn.classList.remove('selected');
        document.getElementById('email-container').classList.remove('active');
        
        // Reset notes
        notesInput.value = '';
        notesChars.textContent = '0/500 characters';
        notesChars.classList.remove('warning', 'error');
        notesBtn.title = "Add special notes";
        notesBtn.classList.remove('selected');
        notesBtn.innerHTML = '<i class="fas fa-sticky-note"></i>';
        document.getElementById('notes-container').classList.remove('active');
        
        // Clear additional stops
        stopsContainer.innerHTML = '';
        stopCount = 0;
        
        // Reset distance
        distance = 0;
        duration = 0;
        
        // Reset price display
        priceDisplay.classList.remove('active');
        priceAmount.textContent = '$0.00';
        priceNote.textContent = 'Enter pickup and destination to see price';
        priceNote.style.color = '';
        priceBreakdown.classList.remove('active');
        priceBreakdown.innerHTML = '';
        
        // Reset progress bar
        progressFill.style.width = '0%';
        const progressText = progressIndicator.querySelector('div');
        progressText.textContent = "Complete all required fields to book";
        progressText.style.color = "";
        
        // Hide submit button
        submitBtn.classList.remove('active');
        submitBtn.disabled = true;
    }
    
    // Close backdrop
    backdrop.addEventListener('click', function() {
        // Close any open modals
        if (document.querySelector('.simple-picker-modal.active')) {
            closeSimplePicker();
        } else if (bookingForm.classList.contains('active')) {
            collapseBookingForm();
        }
    });
});
