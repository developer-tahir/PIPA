/**
 * Authentication functionality for PIPA Farm
 * Handles login, registration, and password reset
 */

// Initialize all auth functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggle buttons
    initializePasswordToggles();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize accessibility features
    initializeAccessibilityFeatures();
    
    // Register form submission handlers
    registerFormHandlers();
    
    // Check for offline status
    checkOfflineStatus();
});

/**
 * Check if the user is offline and show indicator
 */
function checkOfflineStatus() {
    function updateOfflineStatus() {
        const offlineIndicator = document.querySelector('.offline-indicator');
        if (!offlineIndicator) return;
        
        if (!navigator.onLine) {
            offlineIndicator.classList.add('visible');
        } else {
            offlineIndicator.classList.remove('visible');
        }
    }
    
    // Initial check
    updateOfflineStatus();
    
    // Listen for changes
    window.addEventListener('online', updateOfflineStatus);
    window.addEventListener('offline', updateOfflineStatus);
}

/**
 * Initialize password toggle buttons
 */
function initializePasswordToggles() {
    const toggleBtns = document.querySelectorAll('.password-toggle');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    // Add input event listeners to clear errors when user types
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearInputError(this);
        });
    });
}

/**
 * Show error message for an input
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showInputError(input, message) {
    clearInputError(input);
    
    input.classList.add('is-invalid');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = message;
    
    const parent = input.closest('.input-with-icon') || input.parentElement;
    parent.appendChild(errorElement);
}

/**
 * Clear error message for an input
 * @param {HTMLElement} input - The input element
 */
function clearInputError(input) {
    input.classList.remove('is-invalid');
    
    const parent = input.closest('.input-with-icon') || input.parentElement;
    const errorElement = parent.querySelector('.input-error');
    
    if (errorElement) {
        parent.removeChild(errorElement);
    }
}

/**
 * Validate email
 * @param {HTMLElement} emailInput - The email input element
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showInputError(emailInput, 'Please enter your email');
        return false;
    } else if (!emailRegex.test(email)) {
        showInputError(emailInput, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

/**
 * Validate password
 * @param {HTMLElement} passwordInput - The password input element
 * @returns {boolean} - Whether the password is valid
 */
function validatePassword(passwordInput) {
    const password = passwordInput.value;
    
    if (!password) {
        showInputError(passwordInput, 'Please enter your password');
        return false;
    } else if (password.length < 8) {
        showInputError(passwordInput, 'Password must be at least 8 characters long');
        return false;
    }
    
    // Additional password complexity check for registration
    if (passwordInput.id === 'password' && document.getElementById('registerForm')) {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!(hasLower && hasUpper && hasNumber)) {
            showInputError(passwordInput, 'Password must contain lowercase, uppercase letters and numbers');
            return false;
        }
    }
    
    return true;
}

/**
 * Initialize accessibility features
 */
function initializeAccessibilityFeatures() {
    initializeFontSizeControls();
    initializeDyslexiaMode();
}

/**
 * Initialize font size controls
 */
function initializeFontSizeControls() {
    const increaseFontBtn = document.getElementById('increaseFontSize');
    const decreaseFontBtn = document.getElementById('decreaseFontSize');
    
    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', function() {
            changeFontSize(1);
        });
    }
    
    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', function() {
            changeFontSize(-1);
        });
    }
    
    // Apply saved font size if exists
    const savedFontSize = localStorage.getItem('pipafarm-fontsize');
    if (savedFontSize) {
        document.documentElement.style.fontSize = savedFontSize;
    }
}

/**
 * Change font size
 * @param {number} delta - The change amount (positive or negative)
 */
function changeFontSize(delta) {
    const root = document.documentElement;
    const currentSize = parseFloat(window.getComputedStyle(root).fontSize);
    const newSize = currentSize + (delta * 2);
    
    // Limit min and max font size
    if (newSize >= 12 && newSize <= 24) {
        root.style.fontSize = newSize + 'px';
        localStorage.setItem('pipafarm-fontsize', newSize + 'px');
        
        // Show notification
        showPopup(
            'fontSizeChange',
            `Font size ${delta > 0 ? 'increased' : 'decreased'} to ${Math.round(newSize)}px`,
            'info'
        );
    }
}

/**
 * Initialize dyslexia mode
 */
function initializeDyslexiaMode() {
    const dyslexiaBtn = document.getElementById('toggleDyslexiaMode');
    
    if (dyslexiaBtn) {
        dyslexiaBtn.addEventListener('click', function() {
            document.body.classList.toggle('dyslexia-mode');
            
            const isDyslexiaMode = document.body.classList.contains('dyslexia-mode');
            localStorage.setItem('pipafarm-dyslexia-mode', isDyslexiaMode);
            
            // Show notification
            showPopup(
                'dyslexiaMode',
                `Dyslexia-friendly mode ${isDyslexiaMode ? 'enabled' : 'disabled'}`,
                'info'
            );
        });
    }
    
    // Apply saved preference if exists
    const savedDyslexiaMode = localStorage.getItem('pipafarm-dyslexia-mode');
    if (savedDyslexiaMode === 'true') {
        document.body.classList.add('dyslexia-mode');
    }
}

/**
 * Show a popup notification
 * @param {string} id - Unique ID for the notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showPopup(id, message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    // Remove existing notification with same ID
    const existingNotification = document.getElementById(`notification-${id}`);
    if (existingNotification) {
        container.removeChild(existingNotification);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.id = `notification-${id}`;
    
    // Determine icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        default:
            icon = 'fa-info-circle';
    }
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        closeNotification(notification);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

/**
 * Close and remove a notification with animation
 * @param {HTMLElement} notification - The notification element
 */
function closeNotification(notification) {
    if (!notification || notification.classList.contains('closing')) return;
    
    notification.classList.add('closing');
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Register form submission handlers
 */
function registerFormHandlers() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Registration form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // Set up other handlers for password reset forms
    setupPasswordResetHandlers();
}

/**
 * Handle login form submission
 * @param {Event} e - The submit event
 */
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('remember-me')?.checked;
    
    // Validate inputs
    if (!validateEmail(emailInput) || !validatePassword(passwordInput)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    
    // Demo login logic (simulate API request)
    simulateApiRequest('/auth-api.json', 'login', {
        email: emailInput.value.trim(),
        password: passwordInput.value
    })
    .then(response => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        if (response.success) {
            // Store user data and authentication state in localStorage
            const userData = {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: response.user.role,
                avatar: response.user.avatar,
                farmName: response.user.farmName
            };
            
            localStorage.setItem('pipafarm-user-data', JSON.stringify(userData));
            localStorage.setItem('pipafarm-logged-in', 'true');
            localStorage.setItem('pipafarm-auth-token', response.token);
            
            if (rememberMe) {
                localStorage.setItem('pipafarm-remember-me', 'true');
            } else {
                localStorage.removeItem('pipafarm-remember-me');
            }
            
            // Show success notification and redirect
            showPopup('loginSuccess', 'Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Show error notification
            showPopup('loginError', response.message || 'Login failed. Please try again.', 'error');
        }
    })
    .catch(error => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show error notification
        showPopup('loginError', 'An error occurred. Please try again later.', 'error');
        console.error('Login error:', error);
    });
}

/**
 * Handle registration form submission
 * @param {Event} e - The submit event
 */
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    // Get form inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const farmNameInput = document.getElementById('farm-name');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');
    
    // Some basic validation
    let isValid = true;
    
    if (!nameInput.value.trim()) {
        showInputError(nameInput, 'Please enter your name');
        isValid = false;
    }
    
    if (!validateEmail(emailInput)) {
        isValid = false;
    }
    
    if (!farmNameInput.value.trim()) {
        showInputError(farmNameInput, 'Please enter your farm name');
        isValid = false;
    }
    
    if (!validatePassword(passwordInput)) {
        isValid = false;
    }
    
    if (passwordInput.value !== confirmPasswordInput.value) {
        showInputError(confirmPasswordInput, 'Passwords do not match');
        isValid = false;
    }
    
    if (!termsCheckbox.checked) {
        showPopup('termsError', 'Please agree to the Terms and Conditions', 'error');
        isValid = false;
    }
    
    if (isValid) {
        // Show loading state
        const submitBtn = document.querySelector('#registerForm button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        
        // Simulate API request
        simulateApiRequest('/auth-api.json', 'register', {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            farmName: farmNameInput.value.trim(),
            password: passwordInput.value
        })
        .then(response => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            if (response.success) {
                // Show success notification and redirect
                showPopup('registerSuccess', 'Account created successfully! Redirecting to login...', 'success');
                
                // Redirect to login after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                // Show error notification
                showPopup('registerError', response.message || 'Registration failed. Please try again.', 'error');
            }
        })
        .catch(error => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Show error notification
            showPopup('registerError', 'An error occurred. Please try again later.', 'error');
            console.error('Registration error:', error);
        });
    }
}

/**
 * Set up password reset form handlers
 */
function setupPasswordResetHandlers() {
    // These functions are specific to the forgot-password.html page
    // The page has multiple forms that are shown/hidden based on the flow
    
    // The showSection function is already defined in the file
    // but we're making it global so it can be called from inline scripts if needed
    window.showSection = function(sectionId) {
        const sections = document.querySelectorAll('.auth-form');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    };
    
    // Request reset link button
    const requestResetBtn = document.getElementById('requestResetBtn');
    if (requestResetBtn) {
        requestResetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            if (!validateEmail(emailInput)) {
                return;
            }
            
            // Show loading state
            const btn = this;
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate API request
            simulateApiRequest('/auth-api.json', 'passwordReset', {
                email: emailInput.value.trim()
            })
            .then(response => {
                // Reset button state
                btn.disabled = false;
                btn.innerHTML = originalText;
                
                if (response.success) {
                    // Show success message
                    showSection('resetSent');
                } else {
                    // Show error notification
                    showPopup('resetError', response.message || 'Error sending reset link. Please try again.', 'error');
                }
            })
            .catch(error => {
                // Reset button state
                btn.disabled = false;
                btn.innerHTML = originalText;
                
                // Show error notification
                showPopup('resetError', 'An error occurred. Please try again later.', 'error');
                console.error('Password reset error:', error);
            });
        });
    }
    
    // Resend link functionality
    const resendLink = document.getElementById('resendLink');
    if (resendLink) {
        resendLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show notification
            showPopup('resendSuccess', 'Reset link has been resent to your email', 'success');
        });
    }
    
    // For demo: Show reset form button
    const showResetFormBtn = document.getElementById('showResetFormBtn');
    if (showResetFormBtn) {
        showResetFormBtn.addEventListener('click', function() {
            showSection('passwordResetForm');
        });
    }
    
    // Reset password form
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const newPasswordInput = document.getElementById('new-password');
            const confirmNewPasswordInput = document.getElementById('confirm-new-password');
            
            // Validate password
            let isValid = true;
            
            if (!validatePassword(newPasswordInput)) {
                isValid = false;
            }
            
            if (newPasswordInput.value !== confirmNewPasswordInput.value) {
                showInputError(confirmNewPasswordInput, 'Passwords do not match');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const btn = this;
                const originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
                
                // Simulate API request
                simulateApiRequest('/auth-api.json', 'passwordUpdate', {
                    password: newPasswordInput.value
                })
                .then(response => {
                    // Reset button state
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    
                    if (response.success) {
                        // Show success message
                        showSection('resetSuccess');
                    } else {
                        // Show error notification
                        showPopup('resetError', response.message || 'Error resetting password. Please try again.', 'error');
                    }
                })
                .catch(error => {
                    // Reset button state
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    
                    // Show error notification
                    showPopup('resetError', 'An error occurred. Please try again later.', 'error');
                    console.error('Password update error:', error);
                });
            }
        });
    }
    
    // Go to login button
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    // Re-expose these functions globally for use in inline scripts
    window.validateEmail = validateEmail;
    window.validatePassword = validatePassword;
    window.showInputError = showInputError;
    window.clearInputError = clearInputError;
    window.showPopup = showPopup;
}

/**
 * Simulate an API request with the mock API JSON file
 * @param {string} url - The API URL (auth-api.json in this case)
 * @param {string} action - The action to perform (login, register, etc.)
 * @param {Object} data - The data to send with the request
 * @returns {Promise<Object>} - The API response
 */
function simulateApiRequest(url, action, data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(apiData => {
                    let result;
                    
                    switch (action) {
                        case 'login':
                            // Check if the email and password match a user
                            const user = apiData.users.find(u => 
                                u.email === data.email && u.password === data.password);
                            
                            if (user) {
                                // Return success response with user data
                                result = {
                                    ...apiData.loginResponse,
                                    user: {
                                        id: user.id,
                                        name: user.name,
                                        email: user.email,
                                        role: user.role,
                                        farmName: user.farmName,
                                        avatar: user.avatar
                                    }
                                };
                            } else {
                                // Return error response
                                result = apiData.loginErrorResponse;
                            }
                            break;
                            
                        case 'register':
                            // Check if the email already exists
                            const emailExists = apiData.users.some(u => u.email === data.email);
                            
                            if (emailExists) {
                                result = apiData.registerErrorResponse;
                            } else {
                                // Return success response
                                result = {
                                    ...apiData.registerResponse,
                                    user: {
                                        id: apiData.users.length + 1,
                                        name: data.name,
                                        email: data.email,
                                        role: 'Farm Owner',
                                        farmName: data.farmName
                                    }
                                };
                            }
                            break;
                            
                        case 'passwordReset':
                            // Check if email exists
                            const validEmail = apiData.users.some(u => u.email === data.email);
                            result = validEmail
                                ? apiData.passwordResetResponse
                                : apiData.passwordResetErrorResponse;
                            break;
                            
                        case 'passwordUpdate':
                            result = apiData.passwordUpdateResponse;
                            break;
                            
                        default:
                            reject(new Error('Invalid action'));
                            return;
                    }
                    
                    resolve(result);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    reject(error);
                });
        }, 1500); // Simulate network delay of 1.5 seconds
    });
} 