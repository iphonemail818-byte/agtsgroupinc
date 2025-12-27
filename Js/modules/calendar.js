// Calendar Module - Date/Time Picker Functionality

// Calendar state
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = new Date();
let selectedHour = 12;
let selectedMinute = 0;
let selectedAmPm = "PM";

/**
 * Initialize the simple date/time picker
 */
function initializeSimplePicker() {
    const hourSelect = document.getElementById('hour-select');
    const minuteSelect = document.getElementById('minute-select');
    
    // Populate hour dropdown (1-12)
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i < 10 ? `0${i}` : i;
        hourSelect.appendChild(option);
    }
    
    // Populate minute dropdown (in 15-minute increments)
    for (let i = 0; i < 60; i += 15) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i < 10 ? `0${i}` : i;
        minuteSelect.appendChild(option);
    }
    
    // Set initial selections
    hourSelect.value = selectedHour;
    minuteSelect.value = selectedMinute;
    
    // Set initial AM/PM selection
    const ampmBtns = document.querySelectorAll('.ampm-btn');
    ampmBtns.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-value') === selectedAmPm) {
            btn.classList.add('selected');
        }
    });
    
    // Generate initial calendar
    generateCalendar(currentMonth, currentYear);
}

/**
 * Generate calendar for given month/year
 */
function generateCalendar(month, year) {
    const datePicker = document.getElementById('date-picker');
    const currentMonthDisplay = document.getElementById('current-month-display');
    
    // Clear existing calendar
    datePicker.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        datePicker.appendChild(dayHeader);
    });
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    // Get last day of month
    const lastDay = new Date(year, month + 1, 0);
    // Get number of days in month
    const daysInMonth = lastDay.getDate();
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const startingDay = firstDay.getDay();
    
    // Update month display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthDisplay.textContent = `${monthNames[month]} ${year}`;
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell disabled';
        datePicker.appendChild(emptyCell);
    }
    
    // Add cells for each day of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        dayCell.dataset.day = day;
        dayCell.dataset.month = month;
        dayCell.dataset.year = year;
        
        // Check if this is the selected date
        const cellDate = new Date(year, month, day);
        if (selectedDate.getDate() === day && 
            selectedDate.getMonth() === month && 
            selectedDate.getFullYear() === year) {
            dayCell.classList.add('selected');
        }
        
        // Check if date is in the past
        if (cellDate < today) {
            dayCell.classList.add('disabled');
        } else {
            // Add click event
            dayCell.addEventListener('click', function() {
                // Remove selected class from all days
                document.querySelectorAll('.day-cell').forEach(cell => {
                    cell.classList.remove('selected');
                });
                
                // Add selected class to clicked day
                this.classList.add('selected');
                
                // Update selected date
                selectedDate = new Date(
                    parseInt(this.dataset.year),
                    parseInt(this.dataset.month),
                    parseInt(this.dataset.day)
                );
            });
        }
        
        datePicker.appendChild(dayCell);
    }
}

/**
 * Open the simple picker modal
 */
function openSimplePicker() {
    const simplePickerModal = document.getElementById('simple-picker-modal');
    const backdrop = document.getElementById('backdrop');
    
    simplePickerModal.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close the simple picker modal
 */
function closeSimplePicker() {
    const simplePickerModal = document.getElementById('simple-picker-modal');
    const backdrop = document.getElementById('backdrop');
    
    simplePickerModal.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Confirm date/time selection
 */
function confirmDateTimeSelection() {
    const hourSelect = document.getElementById('hour-select');
    const minuteSelect = document.getElementById('minute-select');
    const ampmBtns = document.querySelector('.ampm-btn.selected');
    const datetimeText = document.getElementById('datetime-text');
    const datetimeBtn = document.getElementById('datetime-btn');
    
    // Get selected values
    selectedHour = parseInt(hourSelect.value);
    selectedMinute = parseInt(minuteSelect.value);
    selectedAmPm = ampmBtns ? ampmBtns.getAttribute('data-value') : "PM";
    
    // Convert 12-hour to 24-hour for date object
    let hour24 = selectedHour;
    if (selectedAmPm === "PM" && selectedHour !== 12) {
        hour24 = selectedHour + 12;
    } else if (selectedAmPm === "AM" && selectedHour === 12) {
        hour24 = 0;
    }
    
    // Set time on selected date
    selectedDate.setHours(hour24, selectedMinute, 0, 0);
    
    // Format selected date/time for display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const day = selectedDate.getDate();
    const month = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    const hour = selectedHour < 10 ? `0${selectedHour}` : selectedHour;
    const minute = selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute;
    
    window.selectedDateTime = `${month} ${day}, ${year} at ${hour}:${minute} ${selectedAmPm}`;
    
    // Update display
    datetimeText.textContent = window.selectedDateTime;
    datetimeText.classList.add('has-selection');
    datetimeBtn.classList.add('selected');
    datetimeBtn.innerHTML = '<i class="far fa-calendar-check"></i>';
    datetimeBtn.title = window.selectedDateTime;
    
    closeSimplePicker();
}

/**
 * Initialize calendar event listeners
 */
function initializeCalendarEvents() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const ampmBtns = document.querySelectorAll('.ampm-btn');
    const confirmDatetimeBtn = document.getElementById('confirm-datetime');
    const closePickerBtn = document.getElementById('close-picker');
    
    // Month navigation
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // AM/PM selection
    ampmBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            ampmBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedAmPm = this.getAttribute('data-value');
        });
    });
    
    // Confirm date/time selection
    confirmDatetimeBtn.addEventListener('click', confirmDateTimeSelection);
    
    // Close picker
    closePickerBtn.addEventListener('click', closeSimplePicker);
    
    // Set initial selected date to global window object
    window.selectedDate = selectedDate;
    window.selectedDateTime = null;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSimplePicker();
    initializeCalendarEvents();
});
