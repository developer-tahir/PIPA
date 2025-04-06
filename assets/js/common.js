/**
 * Common JavaScript functions for PIPA Farm Management System
 * Contains shared functionality used across multiple pages
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Common JS loaded');
    
    // Initialize components
    initializeSidebar();
    initializeUserDropdown();
    initializeNotifications();
    setupAccessibilityControls();
    checkConnectivity();
    initializeSearchFunctionality();
    
    // Initialize tooltips if available
    if(typeof initializeTooltips === 'function') {
        initializeTooltips();
    }
    
    // Hide loading screen
    setTimeout(function() {
        const loadingScreen = document.querySelector('.loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 800);
});

/**
 * Initializes the sidebar functionality
 */
function initializeSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            sidebar && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(event.target) && 
            event.target !== menuToggle) {
            sidebar.classList.remove('active');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * Initializes the user dropdown functionality
 */
function initializeUserDropdown() {
    // Handle sidebar user profile dropdown
    const userProfile = document.querySelector('.sidebar .user-profile');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.preventDefault();
            toggleUserDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (userDropdown.classList.contains('show') && 
                !userDropdown.contains(event.target) && 
                !userProfile.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
}

/**
 * Toggles the user dropdown visibility
 */
function toggleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('show');
    }
}

/**
 * Initializes notification functionality
 */
function initializeNotifications() {
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationContainer = document.getElementById('notificationContainer');
    
    if (notificationIcon && notificationContainer) {
        notificationIcon.addEventListener('click', function() {
            notificationContainer.classList.toggle('show');
        });
        
        // Close notifications when clicking outside
        document.addEventListener('click', function(event) {
            if (notificationContainer.classList.contains('show') && 
                !notificationContainer.contains(event.target) && 
                !notificationIcon.contains(event.target)) {
                notificationContainer.classList.remove('show');
            }
        });
    }
}

/**
 * Sets up accessibility controls
 */
function setupAccessibilityControls() {
    // Add keyboard navigation detection
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });
    
    window.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-user');
    });
    
    // Handle font size adjustments if controls exist
    const increaseFontBtn = document.getElementById('increaseFontSize');
    const decreaseFontBtn = document.getElementById('decreaseFontSize');
    const resetFontBtn = document.getElementById('resetFontSize');
    
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', function() {
            adjustFontSize(1);
        });
    }
    
    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', function() {
            adjustFontSize(-1);
        });
    }
    
    if (resetFontBtn) {
        resetFontBtn.addEventListener('click', function() {
            resetFontSize();
        });
    }
    
    // Apply saved font size preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        document.documentElement.style.fontSize = savedFontSize;
    }
}

/**
 * Adjusts the font size throughout the application
 * @param {number} delta - The amount to change the font size by (in pixels)
 */
function adjustFontSize(delta) {
    const html = document.documentElement;
    const currentSize = parseFloat(window.getComputedStyle(html).fontSize);
    const newSize = currentSize + delta;
    
    // Limit range from 12px to 24px
    if (newSize >= 12 && newSize <= 24) {
        html.style.fontSize = newSize + 'px';
        localStorage.setItem('fontSize', newSize + 'px');
    }
}

/**
 * Resets the font size to the default
 */
function resetFontSize() {
    document.documentElement.style.fontSize = '16px';
    localStorage.removeItem('fontSize');
}

/**
 * Checks the user's internet connectivity
 */
function checkConnectivity() {
    const offlineIndicator = document.querySelector('.offline-indicator');
    
    if (offlineIndicator) {
        function updateOnlineStatus() {
            if (navigator.onLine) {
                document.body.classList.remove('offline');
                offlineIndicator.style.display = 'none';
            } else {
                document.body.classList.add('offline');
                offlineIndicator.style.display = 'block';
            }
        }
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }
}

/**
 * Initializes search functionality
 */
function initializeSearchFunctionality() {
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const closeSearch = document.querySelector('.close-search');
    
    if (searchIcon && searchOverlay) {
        searchIcon.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            if (searchInput) {
                searchInput.focus();
            }
        });
        
        if (closeSearch) {
            closeSearch.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
            });
        }
        
        // Close search with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
}

/**
 * Creates and displays a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 * @param {number} duration - How long to display the notification in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    // Create icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Set up close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, duration);
}

/**
 * Format date for Australian format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    return date.toLocaleDateString('en-AU', options);
}

/**
 * Format time for Australian format
 * @param {Date} date - The date to format time from
 * @returns {string} Formatted time string
 */
function formatTime(date) {
    const options = { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    };
    return date.toLocaleTimeString('en-AU', options);
}

/**
 * Gets the Australian timezone abbreviation
 * @returns {string} Timezone abbreviation
 */
function getAustralianTimezone() {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() / 60;
    
    // Simple detection - not accounting for all Australian timezones
    if (timezoneOffset === -10) {
        // Check if DST is active
        const jan = new Date(date.getFullYear(), 0, 1);
        const jul = new Date(date.getFullYear(), 6, 1);
        const isDST = date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        
        return isDST ? 'AEDT' : 'AEST';
    }
    
    // Fallback for other timezones
    return 'AEST';
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleUserDropdown,
        showToast,
        formatDate,
        formatTime,
        getAustralianTimezone
    };
} 