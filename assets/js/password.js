document.addEventListener('DOMContentLoaded', function() {
    console.log("Password page initialized");
    initPasswordPage();
    
    // Success modal functionality
    const successModal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.modal-close');
    const gotItBtn = document.querySelector('.modal-footer .btn-primary');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            if (successModal) {
                successModal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        };
    }
    
    if (gotItBtn) {
        gotItBtn.onclick = function() {
            if (successModal) {
                successModal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
            // Show a successful password change popup
            if (typeof showPopup === 'function') {
                showPopup('Your password has been updated successfully!', 'success');
            }
        };
    }
    
    // Form submission handler
    const passwordForm = document.getElementById('changePasswordForm');
    if (passwordForm) {
        passwordForm.onsubmit = function(e) {
            e.preventDefault();
            console.log("Password form submitted");
            
            // Validate form
            let isValid = true;
            const currentPassword = document.getElementById('currentPassword');
            const newPassword = document.getElementById('newPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            
            // Reset error messages
            document.getElementById('currentPasswordError').textContent = '';
            document.getElementById('newPasswordError').textContent = '';
            document.getElementById('confirmPasswordError').textContent = '';
            
            // Validate current password
            if (!currentPassword.value.trim()) {
                document.getElementById('currentPasswordError').textContent = 'Please enter your current password';
                isValid = false;
            }
            
            // Validate new password
            if (!newPassword.value.trim()) {
                document.getElementById('newPasswordError').textContent = 'Please enter a new password';
                isValid = false;
            } else if (newPassword.value.length < 8) {
                document.getElementById('newPasswordError').textContent = 'Password must be at least 8 characters';
                isValid = false;
            }
            
            // Validate confirm password
            if (confirmPassword.value !== newPassword.value) {
                document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
                isValid = false;
            }
            
            if (isValid) {
                // Show loading indicator
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(function() {
                    // Reset form
                    passwordForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success modal
                    if (successModal) {
                        console.log("Showing success modal");
                        successModal.style.display = 'block';
                        document.body.classList.add('modal-open');
                    } else {
                        console.log("Success modal not found");
                        if (typeof showPopup === 'function') {
                            showPopup('Password updated successfully!', 'success');
                        } else {
                            alert("Password updated successfully!");
                        }
                    }
                }, 1500);
            }
        };
    }
});

/**
 * Initialize the password change page functionality
 */
function initPasswordPage() {
    const passwordForm = document.getElementById('changePasswordForm');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const passwordStrengthText = document.getElementById('passwordStrengthText');
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const toggleBtns = document.querySelectorAll('.toggle-password');
    const successModal = document.getElementById('successModal');
    const activityItems = document.querySelectorAll('.activity-item');
    
    // Initialize password visibility toggles
    if (toggleBtns) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const icon = this.querySelector('i');
                
                // Toggle password visibility
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Password strength meter
    if (newPassword && passwordStrength && passwordStrengthText) {
        newPassword.addEventListener('input', function() {
            const value = this.value;
            const strength = calculatePasswordStrength(value);
            
            // Update strength meter
            passwordStrength.className = 'strength-progress';
            
            if (value.length === 0) {
                passwordStrength.style.width = '0';
                passwordStrengthText.textContent = 'Password strength';
                passwordStrength.classList.remove('weak', 'medium', 'strong', 'very-strong');
            } else if (strength < 40) {
                passwordStrength.classList.add('weak');
                passwordStrengthText.textContent = 'Weak';
            } else if (strength < 60) {
                passwordStrength.classList.add('medium');
                passwordStrengthText.textContent = 'Medium';
            } else if (strength < 80) {
                passwordStrength.classList.add('strong');
                passwordStrengthText.textContent = 'Strong';
            } else {
                passwordStrength.classList.add('very-strong');
                passwordStrengthText.textContent = 'Very strong';
            }
        });
    }
    
    // Real-time password match validation
    if (confirmPassword && newPassword && confirmPasswordError) {
        confirmPassword.addEventListener('input', function() {
            if (this.value.trim() === '') {
                confirmPasswordError.textContent = '';
            } else if (this.value !== newPassword.value) {
                confirmPasswordError.textContent = 'Passwords do not match';
            } else {
                confirmPasswordError.textContent = '';
            }
        });
        
        // Also check when changing the new password
        newPassword.addEventListener('input', function() {
            if (confirmPassword.value.trim() !== '' && confirmPassword.value !== this.value) {
                confirmPasswordError.textContent = 'Passwords do not match';
            } else if (confirmPassword.value.trim() !== '') {
                confirmPasswordError.textContent = '';
            }
        });
    }
    
    // Make activity items interactive
    if (activityItems && activityItems.length > 0) {
        activityItems.forEach(item => {
            item.addEventListener('click', function() {
                const activityType = this.querySelector('.activity-title').textContent;
                const activityDetails = this.querySelector('.activity-details').textContent;
                const device = this.querySelector('.activity-device span').textContent;
                
                showActivityDetails(activityType, activityDetails, device);
            });
            
            // Add hover effect to indicate it's clickable
            item.style.cursor = 'pointer';
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--bg-light)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
    }
    
    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose && successModal) {
        modalClose.addEventListener('click', function() {
            hideModal(successModal);
        });
    }
    
    // Close modal when clicking outside
    if (successModal) {
        const modalBackdrop = successModal.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', function() {
                hideModal(successModal);
            });
        }
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('show')) {
            hideModal(successModal);
        }
    });
    
    // Add accessibility focus outlines
    const focusableElements = document.querySelectorAll('button, input, a, [tabindex="0"]');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

/**
 * Show activity details in a popup
 * @param {string} type - Activity type
 * @param {string} details - Activity details
 * @param {string} device - Device type
 */
function showActivityDetails(type, details, device) {
    // Check if popup function exists in main.js
    if (typeof showPopup === 'function') {
        showPopup(
            'activityDetails',
            `<div class="activity-details-popup">
                <h4>${type} Activity</h4>
                <p>${details}</p>
                <p>Device: ${device}</p>
                <p class="activity-note">If this wasn't you, please contact support immediately.</p>
            </div>`,
            'info'
        );
        return;
    }
    
    // Fallback to alert if showPopup isn't available
    alert(`${type} Activity\n${details}\nDevice: ${device}\n\nIf this wasn't you, please contact support immediately.`);
}

/**
 * Calculate password strength
 * @param {string} password - Password to calculate strength for
 * @returns {number} - Strength score (0-100)
 */
function calculatePasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length contribution (up to 30 points)
    strength += Math.min(30, password.length * 2);
    
    // Character variety
    if (/[A-Z]/.test(password)) strength += 10; // Uppercase
    if (/[a-z]/.test(password)) strength += 10; // Lowercase
    if (/[0-9]/.test(password)) strength += 10; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 15; // Special characters
    
    // Mix of characters (up to 20 points)
    const uniqueChars = new Set(password.split('')).size;
    strength += Math.min(20, uniqueChars * 2);
    
    // Penalize patterns
    if (/^[A-Za-z]+$/.test(password)) strength -= 10; // Letters only
    if (/^[0-9]+$/.test(password)) strength -= 15; // Numbers only
    if (/(.)\1{2,}/.test(password)) strength -= 10; // Repeated characters
    
    return Math.max(0, Math.min(100, strength));
}

/**
 * Check if password meets requirements
 * @param {string} password - Password to check
 * @returns {boolean} - Whether password is strong
 */
function isStrongPassword(password) {
    // At least 8 characters
    if (password.length < 8) return false;
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // At least one lowercase letter
    if (!/[a-z]/.test(password)) return false;
    
    // At least one number
    if (!/[0-9]/.test(password)) return false;
    
    // At least one special character
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    
    return true;
}

/**
 * Show modal
 * @param {HTMLElement} modal - Modal element
 */
function showModal(modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus the first focusable element in the modal
    setTimeout(() => {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }, 100);
}

/**
 * Hide modal
 * @param {HTMLElement} modal - Modal element
 */
function hideModal(modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Return focus to the element that had focus before opening the modal
    if (document.activeElement) {
        document.activeElement.blur();
    }
    
    // After successful password change, redirect to profile
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 500);
} 