/**
 * PIPA Farm - Common Navigation Links & User Dropdown Functionality
 * 
 * This script handles common functionality for navigation and user dropdown
 * across all pages of the PIPA Farm application.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the user dropdown menu functionality
    initializeUserDropdown();
    
    // Initialize mobile menu toggle
    initializeMobileMenu();
    
    // Initialize online/offline status detection
    initializeConnectivityCheck();
    
    // Set developer info in user profile
    setDeveloperProfile();
    
    // Initialize logout link functionality
    initializeLogout();
});

/**
 * Sets developer profile information across the application
 */
function setDeveloperProfile() {
    // Set default values
    const userName = 'Tahir M';
    const userRole = 'Developer';
    const userInitials = 'TM';
    
    // Update elements with user info
    const userNameElements = document.querySelectorAll('.user-name, .name');
    const userRoleElements = document.querySelectorAll('.user-role, .role');
    const profileImages = document.querySelectorAll('.profile-avatar img, .avatar img');
    
    // Update profile name and role
    userNameElements.forEach(element => {
        element.textContent = userName;
    });
    
    userRoleElements.forEach(element => {
        element.textContent = userRole;
    });
    
    // Update profile images with correct alt and fallback
    profileImages.forEach(img => {
        img.setAttribute('src', 'assets/images/avatar1.jpg');
        img.setAttribute('alt', userName);
        
        // Set onerror handling for fallback to initials
        img.onerror = function() {
            this.style.display = 'none';
            if (this.parentElement) {
                this.parentElement.innerHTML = userInitials;
            }
        };
    });
    
    console.log('Developer profile set successfully');
}

/**
 * Initializes the user dropdown menu functionality
 */
function initializeUserDropdown() {
    const userProfile = document.querySelector('.user-profile');
    const userDropdown = document.getElementById('userDropdown');
    const dropdownIcon = document.getElementById('user-dropdown-icon');
    
    if (!userProfile || !userDropdown) return;
    
    userProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleUserDropdown();
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        if (userDropdown.classList.contains('show')) {
            toggleUserDropdown();
        }
    });
    
    // Prevent closing when clicking inside dropdown
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

/**
 * Toggles the user dropdown menu
 */
function toggleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    if (!userDropdown) return;
    
    const isCurrentlyShown = userDropdown.classList.contains('show');
    
    // Toggle the dropdown visibility
    userDropdown.classList.toggle('show');
    
    // Toggle the icon if it exists
    const dropdownIcon = document.getElementById('user-dropdown-icon');
    if (dropdownIcon) {
        dropdownIcon.classList.toggle('fa-chevron-up', !isCurrentlyShown);
        dropdownIcon.classList.toggle('fa-chevron-down', isCurrentlyShown);
    }
}

/**
 * Initializes the mobile menu toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', 
            menuToggle.classList.contains('active') ? 'true' : 'false');
    });
}

/**
 * Initializes connectivity checks (online/offline status)
 */
function initializeConnectivityCheck() {
    const updateOnlineStatus = () => {
        const offlineIndicator = document.querySelector('.offline-indicator');
        if (!offlineIndicator) return;
        
        if (navigator.onLine) {
            offlineIndicator.classList.remove('visible');
        } else {
            offlineIndicator.classList.add('visible');
        }
    };
    
    // Initial check
    updateOnlineStatus();
    
    // Listen for changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

/**
 * Logout function to ensure consistent logout behavior
 * This enhanced version provides visual feedback and properly cleans up session data
 */
function logout() {
    // Clear any user session data that might be stored
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
    }
    
    if (typeof localStorage !== 'undefined') {
        // Only clear specific items related to auth, not preferences
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('last_login');
    }
    
    console.log('Logout function called - redirecting to login page');
    
    // Show success notification before redirecting
    if (typeof showNotification === 'function') {
        showNotification('Success', 'You have been logged out successfully', 'success');
        
        // Add a slight delay to allow notification to be seen
        setTimeout(() => {
            window.location.href = 'login.html?logout=success';
        }, 1000);
    } else {
        // Immediate redirect if notification function isn't available
        window.location.href = 'login.html?logout=success';
    }
}

/**
 * Initialize logout functionality for all logout links
 */
function initializeLogout() {
    // Find all potential logout links
    const potentialLogoutLinks = document.querySelectorAll('a[href="#"], .user-dropdown-item.logout-item, .sidebar-footer-menu a');
    let logoutLinksCount = 0;
    
    potentialLogoutLinks.forEach(link => {
        // Check if it's a logout link by text content or icon
        const textContent = link.textContent.trim().toLowerCase();
        const hasLogoutText = textContent.includes('logout') || textContent.includes('sign out');
        const hasLogoutIcon = link.innerHTML.includes('fa-sign-out-alt');
        const isLogoutItem = link.classList.contains('logout-item');
        
        if (hasLogoutText || hasLogoutIcon || isLogoutItem) {
            logoutLinksCount++;
            
            // Remove any existing click handlers by cloning the node
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Set href attribute for better accessibility and standard behavior
            newLink.setAttribute('href', 'login.html?logout=success');
            
            // Add click event to handle logout
            newLink.addEventListener('click', function(e) {
                console.log('Logout link clicked');
                e.preventDefault();
                logout();
            });
        }
    });
    
    console.log(`Found and initialized ${logoutLinksCount} logout links`);
}

/**
 * Shows a notification to the user
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(title, message, type) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            if (container.contains(notification)) {
                container.removeChild(notification);
            }
        }, 300);
    });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (container.contains(notification)) {
            notification.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
} 