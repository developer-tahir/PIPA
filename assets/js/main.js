// Immediate loading screen fix (runs right away)
(function() {
    // Set a fallback timeout to hide any loading screens after 1.5 seconds
    setTimeout(function() {
        var loaders = document.querySelectorAll('.loading');
        loaders.forEach(function(loader) {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 300);
        });
        console.log("Loading screen hidden by fallback timeout");
    }, 1500);
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeMobileMenu();
    initializeWeatherWidget();
    initializeSafetyReportsChart();
    initializeTaskList();
    initializeAccessibility();
    initSidebar();
    initDropdowns();
    initFilters();
    initFormValidation();
    initTooltips();
    initializeDyslexiaSupport();
    initializeResponsiveDesign();
    initializeOfflineSupport();
    checkConnectionStatus();
    
    // Show a brief loading screen
    setTimeout(function() {
        const loader = document.querySelector('.loading');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }, 500);
});

// Mobile Menu Functionality
function initializeMobileMenu() {
    // Create menu toggle button if it doesn't exist
    if (!document.querySelector('.menu-toggle')) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-label', 'Toggle menu');
        menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        document.body.appendChild(menuToggle);
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let touchStartX = 0;
    let touchEndX = 0;

    // Toggle sidebar on menu button click
    menuToggle.addEventListener('click', () => {
        toggleSidebar();
    });

    // Handle touch events for swipe gestures
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && !sidebar.classList.contains('active')) {
                // Swipe right, open menu
                toggleSidebar(true);
            } else if (swipeDistance < 0 && sidebar.classList.contains('active')) {
                // Swipe left, close menu
                toggleSidebar(false);
            }
        }
    }

    function toggleSidebar(force) {
        const isActive = force !== undefined ? force : !sidebar.classList.contains('active');
        
        sidebar.classList.toggle('active', isActive);
        menuToggle.setAttribute('aria-expanded', isActive.toString());
        
        // Update menu icon
        const icon = menuToggle.querySelector('i');
        icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';

        // Handle body scroll
        document.body.style.overflow = isActive && window.innerWidth <= 768 ? 'hidden' : '';

        // Add overlay if needed
        handleOverlay(isActive);
    }

    function handleOverlay(show) {
        let overlay = document.querySelector('.sidebar-overlay');
        
        if (show && !overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            
            // Fade in
            setTimeout(() => overlay.style.opacity = '1', 10);
            
            overlay.addEventListener('click', () => {
                toggleSidebar(false);
            });
        } else if (!show && overlay) {
            overlay.style.opacity = '0';
            overlay.addEventListener('transitionend', () => {
                overlay.remove();
            });
        }
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            toggleSidebar(false);
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar(false);
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
                toggleSidebar(false);
            }
        }, 250);
    });

    // Add active class to current page link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.parentElement.classList.add('active');
        }
    });
}

// Add this CSS to the style.css file
const style = document.createElement('style');
style.textContent = `
    .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: calc(var(--z-fixed) - 1);
        opacity: 0;
        transition: opacity var(--transition-base);
    }

    @media (prefers-reduced-motion: reduce) {
        .sidebar,
        .sidebar-overlay,
        .menu-toggle {
            transition: none;
        }
    }
`;
document.head.appendChild(style);

// Weather Widget
function initializeWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    if (weatherWidget) {
        // Example weather data - replace with actual API call
        const mockWeatherData = {
            temperature: 28,
            condition: 'Sunny',
            humidity: 65,
            rainfall: 0
        };

        updateWeatherWidget(mockWeatherData);
    }
}

function updateWeatherWidget(data) {
    const weatherWidget = document.querySelector('.weather-widget');
    if (weatherWidget) {
        weatherWidget.innerHTML = `
            <i class="fas fa-sun" aria-hidden="true"></i>
            <span>${data.temperature}°C</span>
            <small>${data.condition}</small>
            <small>Humidity: ${data.humidity}%</small>
            <small>Rainfall: ${data.rainfall}mm</small>
        `;
    }
}

// Safety Reports Chart
function initializeSafetyReportsChart() {
    const ctx = document.getElementById('safetyReportsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Hazard Reports',
                        data: [12, 19, 15, 8, 13, 17],
                        backgroundColor: '#2E7D32',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Incident Reports',
                        data: [5, 7, 4, 3, 6, 2],
                        backgroundColor: '#D32F2F',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Maintenance Reports',
                        data: [8, 12, 9, 11, 7, 14],
                        backgroundColor: '#1976D2',
                        stack: 'Stack 0'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Farm Safety Reports',
                        font: {
                            size: 16,
                            family: 'Lexend'
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: 'Lexend'
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Lexend'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Lexend'
                            }
                        }
                    }
                }
            }
        });
    }
}

// Task List Management
function initializeTaskList() {
    const taskList = document.querySelector('.task-list');
    if (taskList) {
        // Add click handlers for task items
        const taskItems = taskList.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            item.addEventListener('click', function() {
                showTaskDetails(this.dataset.taskId);
            });

            // Add keyboard navigation
            item.setAttribute('tabindex', '0');
            item.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    showTaskDetails(this.dataset.taskId);
                }
            });
        });
    }
}

function showTaskDetails(taskId) {
    // Example function to show task details
    // Replace with actual implementation
    console.log(`Showing details for task ${taskId}`);
}

// Accessibility Improvements
function initializeAccessibility() {
    // Add ARIA labels and roles
    document.querySelectorAll('.stat-card').forEach(card => {
        card.setAttribute('role', 'region');
        card.setAttribute('aria-label', card.querySelector('h3').textContent);
    });

    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });

    // Initialize high contrast mode toggle
    initializeHighContrastMode();

    // Initialize tooltips
    initTooltips();
    initPopovers();
}

// High Contrast Mode
function initializeHighContrastMode() {
    const storedPreference = localStorage.getItem('highContrastMode');
    if (storedPreference === 'true') {
        document.body.classList.add('high-contrast');
    }

    // Add high contrast mode toggle button
    const helpButton = document.querySelector('.help-button');
    if (helpButton) {
        const contrastToggle = document.createElement('button');
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
        contrastToggle.innerHTML = '<i class="fas fa-adjust" aria-hidden="true"></i>';
        
        contrastToggle.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            localStorage.setItem('highContrastMode', document.body.classList.contains('high-contrast'));
        });

        helpButton.parentNode.insertBefore(contrastToggle, helpButton);
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        tooltip.style.position = 'absolute';
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '9999';
        
        document.body.appendChild(tooltip);
        
        element.addEventListener('mouseenter', function() {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.bottom + 10 + 'px';
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
    });
}

// Initialize popovers
function initPopovers() {
    const popovers = document.querySelectorAll('[data-popover]');
    popovers.forEach(popover => {
        popover.setAttribute('role', 'button');
        popover.setAttribute('aria-haspopup', 'true');
        popover.setAttribute('aria-expanded', 'false');
    });
}

// Handle form submissions
function handleFormSubmit(e) {
    e.preventDefault();
    // Add your form submission logic here
}

// Initialize all interactive elements
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    initPopovers();

    // Add form submit handlers
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
});

// Make functions available in the global scope
window.initTooltips = initTooltips;
window.initPopovers = initPopovers;
window.handleFormSubmit = handleFormSubmit;

// Settings Page Functionality
function initializeSettings() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.settings-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.dataset.section;

            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            item.classList.add('active');
            document.getElementById(targetSection)?.classList.add('active');
        });
    });

    // Handle form submission
    const settingsForm = document.querySelector('.settings-container');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
        });
    }

    // Handle reset button
    const resetButton = document.querySelector('.btn-secondary');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all changes?')) {
                // Add your reset logic here
            }
        });
    }
}

// Initialize settings page if we're on it
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.settings-container')) {
        initializeSettings();
    }
});

// Initialize sidebar functionality
function initSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const compactToggle = document.getElementById('toggleCompact');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                sidebar.classList.contains('active') ? 'true' : 'false');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMenuToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuToggle && window.innerWidth < 768 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Compact sidebar toggle for desktop
    if (compactToggle && sidebar) {
        compactToggle.addEventListener('click', function() {
            sidebar.classList.toggle('compact');
            localStorage.setItem('sidebarCompact', sidebar.classList.contains('compact'));
        });
        
        // Check saved preference
        if (localStorage.getItem('sidebarCompact') === 'true') {
            sidebar.classList.add('compact');
        }
    }
    
    // Handle active menu items
    const currentPath = window.location.pathname;
    const menuItems = sidebar.querySelectorAll('.nav-menu a');
    
    menuItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        
        // Mark active based on current page
        if (currentPath.endsWith(itemPath) || 
            (itemPath === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
            
            // Remove active class from all items first
            menuItems.forEach(menuItem => {
                menuItem.parentElement.classList.remove('active');
            });
            
            // Add active class to current item
            item.parentElement.classList.add('active');
        }
    });
}

// Initialize dropdown menus
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.nextElementSibling;
            
            // Close all other open dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    });
}

// Initialize filter toggles
function initFilters() {
    const filterToggles = document.querySelectorAll('.filter-toggle');
    
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const filterContainer = document.querySelector(this.getAttribute('data-target'));
            if (filterContainer) {
                filterContainer.classList.toggle('show');
            }
        });
    });
}

// Initialize form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

// Initialize accessibility features
function initAccessibility() {
    // Skip to content link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
    
    // Add focus styles to interactive elements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-user');
    });
}

// Toggle user dropdown menu
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const icon = document.getElementById('user-dropdown-icon');
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        if (icon) {
            icon.style.transform = dropdown.classList.contains('active') 
                ? 'rotate(180deg)' 
                : 'rotate(0)';
        }
        
        // Close dropdown when clicking outside
        if (dropdown.classList.contains('active')) {
            document.addEventListener('click', closeDropdownOnOutsideClick);
        } else {
            document.removeEventListener('click', closeDropdownOnOutsideClick);
        }
    }
}

function closeDropdownOnOutsideClick(event) {
    const dropdown = document.getElementById('userDropdown');
    const userProfile = document.querySelector('.user-profile');
    
    if (dropdown && userProfile && !userProfile.contains(event.target)) {
        dropdown.classList.remove('active');
        
        const icon = document.getElementById('user-dropdown-icon');
        if (icon) {
            icon.style.transform = 'rotate(0)';
        }
        
        document.removeEventListener('click', closeDropdownOnOutsideClick);
    }
}

// Dyslexia support
function initializeDyslexiaSupport() {
    // Add dyslexia toggle to settings if it doesn't exist
    const settingsMenu = document.querySelector('a[href="settings.html"]');
    
    if (settingsMenu && !document.getElementById('dyslexiaToggle')) {
        const dyslexiaToggle = document.createElement('div');
        dyslexiaToggle.innerHTML = `
            <div class="settings-option" id="dyslexiaToggle">
                <label class="switch">
                    <input type="checkbox" id="dyslexiaMode" aria-label="Toggle dyslexia-friendly mode">
                    <span class="slider round"></span>
                </label>
                <span>Dyslexia Mode</span>
            </div>
        `;
        
        settingsMenu.parentNode.insertBefore(dyslexiaToggle, settingsMenu.nextSibling);
        
        // Initialize dyslexia mode toggle
        const dyslexiaModeToggle = document.getElementById('dyslexiaMode');
        if (dyslexiaModeToggle) {
            // Check saved preference
            const dyslexiaModeEnabled = localStorage.getItem('dyslexiaMode') === 'true';
            dyslexiaModeToggle.checked = dyslexiaModeEnabled;
            
            if (dyslexiaModeEnabled) {
                document.body.classList.add('dyslexia-mode');
            }
            
            dyslexiaModeToggle.addEventListener('change', function() {
                document.body.classList.toggle('dyslexia-mode', this.checked);
                localStorage.setItem('dyslexiaMode', this.checked);
            });
        }
    }
    
    // Check for system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.body.classList.add('light-mode');
    }
    
    // Apply saved text size preference
    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
        document.documentElement.style.fontSize = savedTextSize;
    }
}

// Text size controls
function increaseTextSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const newSize = Math.min(currentSize + 1, 24) + 'px';
    document.documentElement.style.fontSize = newSize;
    localStorage.setItem('textSize', newSize);
}

function decreaseTextSize() {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const newSize = Math.max(currentSize - 1, 12) + 'px';
    document.documentElement.style.fontSize = newSize;
    localStorage.setItem('textSize', newSize);
}

function resetTextSize() {
    document.documentElement.style.fontSize = '16px';
    localStorage.removeItem('textSize');
}

// Responsive design
function initializeResponsiveDesign() {
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);
    
    // Add resize observer for content height adjustments
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        new ResizeObserver(entries => {
            for (let entry of entries) {
                adjustContentHeight(entry.target);
            }
        }).observe(mainContent);
    }
}

function handleResponsiveLayout() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !mainContent) return;
    
    if (window.innerWidth < 768) {
        // Mobile view
        sidebar.classList.remove('active');
        mainContent.style.marginLeft = '0';
        
        // Ensure menu toggle is visible
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Toggle menu');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.appendChild(menuToggle);
            
            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                this.setAttribute('aria-expanded', 
                    sidebar.classList.contains('active') ? 'true' : 'false');
            });
        }
    } else {
        // Desktop view
        mainContent.style.marginLeft = sidebar.classList.contains('compact') 
            ? 'var(--sidebar-collapsed-width)' 
            : 'var(--sidebar-width)';
            
        // Remove menu toggle if it exists
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.remove();
        }
    }
    
    // Adjust content padding based on screen size
    if (window.innerWidth < 576) {
        mainContent.style.padding = 'var(--spacing-sm)';
    } else if (window.innerWidth < 992) {
        mainContent.style.padding = 'var(--spacing-md)';
    } else {
        mainContent.style.padding = 'var(--spacing-lg)';
    }
}

// Adjust content height for scrolling
function adjustContentHeight(content) {
    const header = document.querySelector('.dashboard-header');
    const windowHeight = window.innerHeight;
    
    if (header) {
        const headerHeight = header.offsetHeight;
        const calculatedHeight = windowHeight - headerHeight;
        content.style.minHeight = calculatedHeight + 'px';
    }
}

// Offline support for rural farms with poor connectivity
function initializeOfflineSupport() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
    
    // Add offline indicator if it doesn't exist
    if (!document.querySelector('.offline-indicator')) {
        const offlineIndicator = document.createElement('div');
        offlineIndicator.className = 'offline-indicator';
        offlineIndicator.textContent = 'You are offline';
        document.body.appendChild(offlineIndicator);
    }
}

// Check connection status
function checkConnectionStatus() {
    function updateConnectionStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
            syncOfflineData();
        } else {
            document.body.classList.add('offline');
        }
    }
    
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    updateConnectionStatus();
}

// Sync data when coming back online
function syncOfflineData() {
    const offlineData = localStorage.getItem('offlineData');
    if (offlineData) {
        // In a real application, this would send the data to the server
        console.log('Syncing offline data:', JSON.parse(offlineData));
        
        // Clear offline data after sync
        localStorage.removeItem('offlineData');
    }
}

// Show a popup notification
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                             type === 'error' ? 'exclamation-circle' : 
                             type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Handle close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('closing');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Automatically close after duration
    if (duration) {
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('closing');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
    }
    
    return notification;
}

// Format a date for Australian format (DD/MM/YYYY)
function formatAustralianDate(date) {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

// Format currency for Australian dollars
function formatAustralianCurrency(amount) {
    return new Intl.NumberFormat('en-AU', { 
        style: 'currency', 
        currency: 'AUD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Handle form validation with enhanced accessibility
function validateForm(formElement, options = {}) {
    if (!formElement) return false;
    
    const inputs = formElement.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        const wrapper = input.closest('.form-group') || input.parentElement;
        const errorElement = wrapper.querySelector('.error-message') || document.createElement('div');
        
        if (!errorElement.classList.contains('error-message')) {
            errorElement.className = 'error-message';
            wrapper.appendChild(errorElement);
        }
        
        // Clear previous error
        errorElement.textContent = '';
        input.setAttribute('aria-invalid', 'false');
        
        // Check required fields
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorElement.textContent = 'This field is required';
            input.setAttribute('aria-invalid', 'true');
        }
        
        // Check email format
        if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            isValid = false;
            errorElement.textContent = 'Please enter a valid email address';
            input.setAttribute('aria-invalid', 'true');
        }
        
        // Check minimum length
        if (input.hasAttribute('minlength') && input.value.length < parseInt(input.getAttribute('minlength'))) {
            isValid = false;
            const minLength = input.getAttribute('minlength');
            errorElement.textContent = `Must be at least ${minLength} characters long`;
            input.setAttribute('aria-invalid', 'true');
        }
    });
    
    if (!isValid && options.showNotification) {
        showNotification('Please fix the errors in the form', 'error');
    }
    
    return isValid;
}
