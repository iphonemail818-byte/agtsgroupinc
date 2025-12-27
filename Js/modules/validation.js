// Validation Module - Form Validation Functions

/**
 * Check if all required fields are complete
 */
function checkAllFieldsComplete() {
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    const passengerNameInput = document.getElementById('passenger-name-input');
    const phoneInput = document.getElementById('phone-input');
    const emailInput = document.getElementById('email-input');
    const passengerCount = window.selectedPassengerCount || 1;
    const pets = window.selectedPets;
    const datetime = window.selectedDateTime;
    
    // Get values
    const pickup = pickupInput.value.trim();
    const destination = destinationInput.value.trim();
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
    const progressFill = document.getElementById('progress-fill');
    const progressIndicator = document.getElementById('progress-indicator');
    
    if (progressFill) {
        const progressPercentage = (completedCount / totalFields) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    // Update progress text
    if (progressIndicator) {
        const progressText = progressIndicator.querySelector('div');
        if (progressText) {
            if (completedCount < totalFields) {
                progressText.textContent = `${completedCount} of ${totalFields} fields completed`;
            } else {
                progressText.textContent = "All fields complete! Ready to book";
                progressText.style.color = "var(--success-green)";
            }
        }
    }
    
    // Show/hide submit button
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        if (completedCount === totalFields) {
            submitBtn.classList.add('active');
            submitBtn.disabled = false;
        } else {
            submitBtn.classList.remove('active');
            submitBtn.disabled = true;
        }
    }
    
    return completedCount === totalFields;
}

/**
 * Highlight a missing field with animation
 */
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

/**
 * Remove all field highlights
 */
function removeHighlights() {
    const highlightedFields = document.querySelectorAll('.missing-field, .missing-field-btn');
    highlightedFields.forEach(field => {
        field.classList.remove('missing-field');
        field.classList.remove('missing-field-btn');
    });
}

/**
 * Show validation error message
 */
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
    if (formTitle) {
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
}

/**
 * Validate form before submission
 */
function validateForm() {
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    const passengerNameInput = document.getElementById('passenger-name-input');
    const phoneInput = document.getElementById('phone-input');
    const emailInput = document.getElementById('email-input');
    const datetimeBtn = document.getElementById('datetime-btn');
    const passengerBtn = document.getElementById('passenger-btn');
    
    // Get values
    const pickup = pickupInput.value.trim();
    const destination = destinationInput.value.trim();
    const passengerName = passengerNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const datetime = window.selectedDateTime;
    const passengerCount = window.selectedPassengerCount || 1;
    const pets = window.selectedPets;
    
    // Validate each field
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
    
    // If there's an error, show it and highlight the field
    if (errorMessage) {
        showValidationError(errorMessage);
        
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
        
        return false;
    }
    
    return true;
}

// Make functions available globally
window.checkAllFieldsComplete = checkAllFieldsComplete;
window.highlightMissingField = highlightMissingField;
window.showValidationError = showValidationError;
window.validateForm = validateForm;
