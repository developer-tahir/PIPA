// Calendar state management
let currentDate = new Date();
let selectedDate = null;
let events = [];

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    setupEventListeners();
    loadEvents(); // In a real app, this would fetch from an API
});

// Initialize calendar view
function initializeCalendar() {
    updateCalendarHeader();
    renderCalendarGrid();
    updateUpcomingEvents();
}

// Update calendar header with current month and year
function updateCalendarHeader() {
    const monthYearText = currentDate.toLocaleString('en-AU', { 
        month: 'long', 
        year: 'numeric' 
    });
    document.querySelector('.calendar-nav h3').textContent = monthYearText;
}

// Render calendar grid with days
function renderCalendarGrid() {
    const calendarGrid = document.querySelector('.calendar-grid');
    calendarGrid.innerHTML = '';

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDayIndex = firstDay.getDay();
    
    // Add days from previous month
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    for (let i = startingDayIndex - 1; i >= 0; i--) {
        const dayNumber = prevMonthLastDay.getDate() - i;
        addDayToGrid(calendarGrid, dayNumber, 'prev-month');
    }

    // Add days of current month
    const today = new Date();
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const isToday = currentDate.getMonth() === today.getMonth() &&
                       currentDate.getFullYear() === today.getFullYear() &&
                       day === today.getDate();
        addDayToGrid(calendarGrid, day, isToday ? 'today' : '');
    }

    // Add days from next month
    const remainingDays = 42 - (startingDayIndex + lastDay.getDate());
    for (let day = 1; day <= remainingDays; day++) {
        addDayToGrid(calendarGrid, day, 'next-month');
    }
}

// Add a day element to the calendar grid
function addDayToGrid(grid, dayNumber, className = '') {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${className}`;
    dayElement.innerHTML = `
        <span class="date">${dayNumber}</span>
        ${getEventsForDay(dayNumber, className)}
    `;
    
    dayElement.addEventListener('click', () => handleDayClick(dayNumber, className));
    grid.appendChild(dayElement);
}

// Get events for a specific day
function getEventsForDay(day, className) {
    // In a real app, this would filter actual events
    // This is a dummy implementation
    if (className === 'prev-month' || className === 'next-month') return '';
    
    const eventTypes = ['task', 'safety', 'maintenance', 'weather'];
    const random = Math.random();
    
    if (random > 0.7) {
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const icons = {
            task: 'tasks',
            safety: 'hard-hat',
            maintenance: 'wrench',
            weather: 'cloud-rain'
        };
        
        return `
            <div class="event ${type}">
                <i class="fas fa-${icons[type]}" aria-hidden="true"></i>
                <span>Event ${day}</span>
            </div>
        `;
    }
    
    return '';
}

// Handle day click events
function handleDayClick(day, className) {
    selectedDate = new Date(
        currentDate.getFullYear(),
        className === 'prev-month' ? currentDate.getMonth() - 1 :
        className === 'next-month' ? currentDate.getMonth() + 1 :
        currentDate.getMonth(),
        day
    );
    
    showAddEventModal();
}

// Setup event listeners
function setupEventListeners() {
    // Previous month button
    document.querySelector('.calendar-nav button:first-child').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        initializeCalendar();
    });

    // Next month button
    document.querySelector('.calendar-nav button:last-child').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        initializeCalendar();
    });

    // Add event button
    document.querySelector('.header-actions .btn-primary').addEventListener('click', () => {
        selectedDate = new Date();
        showAddEventModal();
    });

    // Floating action button
    document.querySelector('.fab').addEventListener('click', () => {
        selectedDate = new Date();
        showAddEventModal();
    });
}

// Show add event modal
function showAddEventModal() {
    // In a real app, this would show a modal for adding events
    console.log('Show add event modal for date:', selectedDate);
}

// Load events (dummy implementation)
function loadEvents() {
    // In a real app, this would fetch events from an API
    events = [
        {
            title: 'Safety Check',
            date: new Date(2025, 3, 4), // April 4, 2025
            type: 'safety',
            location: 'Workshop',
            time: '9:00 AM'
        },
        {
            title: 'Tractor Service',
            date: new Date(2025, 3, 5), // April 5, 2025
            type: 'maintenance',
            location: 'Workshop',
            time: '10:30 AM'
        }
    ];
    
    updateUpcomingEvents();
}

// Update upcoming events section
function updateUpcomingEvents() {
    const eventList = document.querySelector('.event-list');
    const today = new Date();
    
    // Filter and sort upcoming events
    const upcomingEvents = events
        .filter(event => event.date >= today)
        .sort((a, b) => a.date - b.date)
        .slice(0, 5); // Show only next 5 events
    
    // Render upcoming events
    eventList.innerHTML = upcomingEvents.map(event => `
        <div class="event-card">
            <div class="event-date">
                <span class="day">${event.date.getDate()}</span>
                <span class="month">${event.date.toLocaleString('en-AU', { month: 'short' })}</span>
            </div>
            <div class="event-details">
                <h4>${event.title}</h4>
                <p>${event.type.charAt(0).toUpperCase() + event.type.slice(1)} event</p>
                <div class="event-meta">
                    <span class="time">
                        <i class="fas fa-clock" aria-hidden="true"></i>
                        ${event.time}
                    </span>
                    <span class="location">
                        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                        ${event.location}
                    </span>
                </div>
            </div>
            <button class="btn btn-icon" aria-label="Event options">
                <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
            </button>
        </div>
    `).join('');
}

// Helper function to format date
function formatDate(date) {
    return date.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export functions for potential use in other modules
export {
    initializeCalendar,
    updateCalendarHeader,
    renderCalendarGrid,
    updateUpcomingEvents
}; 