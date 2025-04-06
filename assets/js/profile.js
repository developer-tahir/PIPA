document.addEventListener('DOMContentLoaded', function() {
    console.log("Profile page initialized");
    initProfilePage();
    
    // Add direct event handlers for key elements
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        console.log("Edit profile button found");
        editProfileBtn.onclick = function() {
            console.log("Edit profile button clicked");
            document.querySelector('.profile-info').style.display = 'none';
            document.getElementById('editProfileForm').style.display = 'block';
        };
    }
    
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        console.log("Cancel edit button found");
        cancelEditBtn.onclick = function() {
            console.log("Cancel edit button clicked");
            document.getElementById('editProfileForm').style.display = 'none';
            document.querySelector('.profile-info').style.display = 'block';
        };
    }
    
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        console.log("Profile form found");
        profileForm.onsubmit = function(e) {
            e.preventDefault();
            console.log("Profile form submitted");
            
            // Show loading
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(function() {
                // Update profile info
                updateProfileInfo(profileForm);
                
                // Hide form, show profile
                document.getElementById('editProfileForm').style.display = 'none';
                document.querySelector('.profile-info').style.display = 'block';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                alert('Profile updated successfully!');
            }, 1000);
        };
    }
});

/**
 * Initialize the profile page functionality
 */
function initProfilePage() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const profileForm = document.getElementById('profileForm');
    const profileSection = document.querySelector('.profile-info');
    const editProfileForm = document.getElementById('editProfileForm');
    const photoUploadBtn = document.querySelector('.photo-upload-btn');
    const securityButtons = document.querySelectorAll('.security-options .btn');
    
    // Initialize profile photo upload
    if (photoUploadBtn) {
        photoUploadBtn.addEventListener('click', function() {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // Trigger click on the file input
            fileInput.click();
            
            // Handle file selection
            fileInput.addEventListener('change', function() {
                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Update profile image
                        const profileImage = document.querySelector('.profile-photo img');
                        if (profileImage) {
                            profileImage.src = e.target.result;
                            profileImage.style.display = 'block';
                        }
                        
                        // Update sidebar avatar
                        const sidebarAvatar = document.querySelector('.user-profile .avatar img');
                        if (sidebarAvatar) {
                            sidebarAvatar.src = e.target.result;
                            sidebarAvatar.style.display = 'block';
                        }
                        
                        // Show success message
                        showPopup('photoUploadSuccess', 'Profile photo updated successfully', 'success');
                    };
                    
                    reader.readAsDataURL(fileInput.files[0]);
                }
                
                // Clean up
                document.body.removeChild(fileInput);
            });
        });
    }
    
    // Edit profile button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Hide profile info, show edit form
            if (profileSection) profileSection.style.display = 'none';
            if (editProfileForm) editProfileForm.style.display = 'block';
        });
    }
    
    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            // Show confirmation dialog
            if (typeof showConfirmDialog === 'function') {
                showConfirmDialog(
                    'Discard Changes', 
                    'Are you sure you want to discard your changes?',
                    function() {
                        // Hide edit form, show profile info
                        if (editProfileForm) editProfileForm.style.display = 'none';
                        if (profileSection) profileSection.style.display = 'block';
                        if (profileForm) profileForm.reset();
                    }
                );
            } else {
                // Fallback if showConfirmDialog isn't available
                if (confirm('Are you sure you want to discard your changes?')) {
                    if (editProfileForm) editProfileForm.style.display = 'none';
                    if (profileSection) profileSection.style.display = 'block';
                    if (profileForm) profileForm.reset();
                }
            }
        });
    }
    
    // Handle form submission
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading indicator
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual API call)
            setTimeout(function() {
                // Update profile info
                updateProfileInfo(profileForm);
                
                // Hide form, show profile info
                if (editProfileForm) editProfileForm.style.display = 'none';
                if (profileSection) profileSection.style.display = 'block';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                if (typeof showPopup === 'function') {
                    showPopup('profileUpdateSuccess', 'Profile updated successfully', 'success');
                } else {
                    alert('Profile updated successfully');
                }
            }, 1000);
        });
    }
    
    // Add context menus to security buttons
    if (securityButtons) {
        securityButtons.forEach(button => {
            if (!button.closest('.option-card').querySelector('a')) {  // Skip buttons that are links
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const optionType = this.textContent.trim();
                    
                    if (optionType === 'Set Up') {
                        showConfirmDialog(
                            "Set Up Two-Factor Authentication", 
                            "This will enable two-factor authentication for your account. You will need to verify your identity using your mobile device each time you log in. Would you like to continue?",
                            () => {
                                showToast('Two-factor authentication setup initiated', 'info');
                                // This would typically redirect to a 2FA setup page
                            }
                        );
                    } else if (optionType === 'Manage') {
                        showToast('Notification preferences coming soon!', 'info');
                    }
                });
            }
        });
    }
    
    // Add right-click context menu on profile photo
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            
            showContextMenu(e, [
                { 
                    text: 'Change Photo', 
                    icon: 'fa-camera',
                    onClick: () => photoUploadBtn.click() 
                },
                { 
                    text: 'View Full Size', 
                    icon: 'fa-search-plus',
                    onClick: () => {
                        const img = profilePhoto.querySelector('img');
                        if (img) {
                            window.open(img.src, '_blank');
                        }
                    } 
                },
                { divider: true },
                { 
                    text: 'Remove Photo', 
                    icon: 'fa-trash-alt',
                    onClick: () => {
                        showConfirmDialog(
                            "Remove Profile Photo", 
                            "Are you sure you want to remove your profile photo?",
                            () => {
                                const img = profilePhoto.querySelector('img');
                                const sidebarAvatar = document.querySelector('.user-profile .avatar img');
                                
                                if (img) {
                                    img.src = 'assets/images/avatar-placeholder.png';
                                }
                                
                                if (sidebarAvatar) {
                                    sidebarAvatar.src = 'assets/images/avatar-placeholder.png';
                                }
                                
                                showToast('Profile photo removed', 'success');
                            }
                        );
                    } 
                }
            ]);
        });
    }
}

/**
 * Reset form to match display values
 */
function resetForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    // Reset first name and last name
    const fullName = document.querySelector('.profile-details .detail-value');
    if (fullName) {
        const nameParts = fullName.textContent.split(' ');
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        
        if (firstName && nameParts.length > 0) {
            firstName.value = nameParts[0];
        }
        
        if (lastName && nameParts.length > 1) {
            lastName.value = nameParts.slice(1).join(' ');
        }
    }
    
    // Reset email
    const emailEl = document.querySelectorAll('.profile-details .detail-value')[1];
    const emailInput = document.getElementById('email');
    if (emailEl && emailInput) {
        emailInput.value = emailEl.textContent;
    }
    
    // Reset phone
    const phoneEl = document.querySelectorAll('.profile-details .detail-value')[2];
    const phoneInput = document.getElementById('phone');
    if (phoneEl && phoneInput) {
        phoneInput.value = phoneEl.textContent;
    }
    
    // Reset location
    const locationEl = document.querySelectorAll('.profile-details .detail-value')[4];
    const locationInput = document.getElementById('location');
    if (locationEl && locationInput) {
        locationInput.value = locationEl.textContent;
    }
}

/**
 * Reset form default values to current values
 */
function resetFormDefaults(form) {
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.defaultValue = input.value;
    });
}

/**
 * Update profile display with new data
 * @param {Object} data - Profile data
 */
function updateProfileDisplay(data) {
    // Update name
    const fullNameEl = document.querySelector('.profile-details .detail-value');
    if (fullNameEl && data.firstName && data.lastName) {
        fullNameEl.textContent = `${data.firstName} ${data.lastName}`;
    }
    
    // Update email
    const emailEl = document.querySelectorAll('.profile-details .detail-value')[1];
    if (emailEl && data.email) {
        emailEl.textContent = data.email;
    }
    
    // Update phone
    const phoneEl = document.querySelectorAll('.profile-details .detail-value')[2];
    if (phoneEl && data.phone) {
        phoneEl.textContent = data.phone;
    }
    
    // Update location
    const locationEl = document.querySelectorAll('.profile-details .detail-value')[4];
    if (locationEl && data.location) {
        locationEl.textContent = data.location;
    }
    
    // Update sidebar user name
    const sidebarName = document.querySelector('.user-profile .name');
    if (sidebarName && data.firstName && data.lastName) {
        sidebarName.textContent = `${data.firstName} ${data.lastName}`;
    }
}

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} confirmCallback - Callback on confirm
 * @param {Function} cancelCallback - Callback on cancel
 */
function showConfirmDialog(title, message, confirmCallback, cancelCallback) {
    // Check if function exists in main.js, otherwise create local version
    if (typeof window.showConfirmDialog === 'function') {
        window.showConfirmDialog(title, message, confirmCallback, cancelCallback);
        return;
    }
    
    if (confirm(`${title}\n\n${message}`)) {
        if (confirmCallback) confirmCallback();
    } else {
        if (cancelCallback) cancelCallback();
    }
}

/**
 * Show context menu
 * @param {Event} event - Mouse event
 * @param {Array} items - Menu items
 */
function showContextMenu(event, items) {
    // Check if function exists in main.js, otherwise create local version
    if (typeof window.showContextMenu === 'function') {
        window.showContextMenu(event, items);
        return;
    }
    
    // Simple fallback for context menu
    const action = prompt(`Choose an action:\n${items.map((item, i) => item.divider ? '---' : `${i+1}. ${item.text}`).join('\n')}`);
    
    if (action) {
        const index = parseInt(action) - 1;
        if (!isNaN(index) && items[index] && items[index].onClick) {
            items[index].onClick();
        }
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
function showToast(message, type = 'info') {
    // Check if function exists in main.js
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }
    
    // Fallback to showNotification or alert
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else {
        alert(message);
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1060;
                }
                .notification {
                    background-color: var(--white);
                    border-radius: var(--border-radius-md);
                    box-shadow: var(--shadow-md);
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                    display: flex;
                    align-items: center;
                    max-width: 300px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-icon {
                    margin-right: 12px;
                    font-size: 1.25rem;
                }
                .notification-success .notification-icon {
                    color: var(--success-color);
                }
                .notification-error .notification-icon {
                    color: var(--danger-color);
                }
                .notification-info .notification-icon {
                    color: var(--info-color);
                }
                .notification-message {
                    flex: 1;
                    color: var(--text-color);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 1rem;
                    margin-left: 12px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
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
    
    // Add content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show notification (with slight delay for animation)
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        
        // Remove after animation completes
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            
            // Remove after animation completes
            notification.addEventListener('transitionend', () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            });
        }
    }, 5000);
}

// Toggle between display and edit modes
function toggleEditMode(editMode) {
    const profileCard = document.querySelector('.profile-info');
    const editForm = document.getElementById('editProfileForm');
    
    if (editMode) {
        profileCard.style.display = 'none';
        editForm.style.display = 'block';
    } else {
        profileCard.style.display = 'block';
        editForm.style.display = 'none';
    }
}

/**
 * Update the profile information display from form data
 */
function updateProfileInfo(form) {
    console.log("Updating profile info");
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    
    // Update profile details
    const detailRows = document.querySelectorAll('.detail-row');
    console.log("Found detail rows:", detailRows.length);
    
    detailRows.forEach(row => {
        const label = row.querySelector('.detail-label').textContent.trim();
        const valueElement = row.querySelector('.detail-value');
        
        if (valueElement) {
            console.log("Processing row with label:", label);
            
            switch(label) {
                case 'Full Name':
                    valueElement.textContent = `${firstName} ${lastName}`;
                    break;
                case 'Email':
                    valueElement.textContent = email;
                    break;
                case 'Phone':
                    valueElement.textContent = phone;
                    break;
                case 'Location':
                    valueElement.textContent = location;
                    break;
            }
        }
    });
    
    // Update user name in sidebar
    const sidebarUserName = document.querySelector('.user-profile .user-name');
    if (sidebarUserName) {
        console.log("Updating sidebar user name");
        sidebarUserName.textContent = `${firstName} ${lastName}`;
    }
    
    // Show success popup
    if (typeof showPopup === 'function') {
        showPopup('Profile updated successfully!', 'success');
    }
}

// If showPopup is not defined in main.js, define it here
if (typeof showPopup !== 'function') {
    function showPopup(popupId, message, type = 'info') {
        // Create popup if it doesn't exist
        let popup = document.getElementById(popupId);
        
        if (!popup) {
            popup = document.createElement('div');
            popup.id = popupId;
            popup.className = `popup popup-${type}`;
            document.body.appendChild(popup);
        }
        
        // Set icon based on type
        let icon;
        switch (type) {
            case 'success':
                icon = 'fa-check-circle';
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                break;
            default:
                icon = 'fa-info-circle';
        }
        
        // Set content
        popup.innerHTML = `
            <div class="popup-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="popup-content">${message}</div>
            <button class="popup-close" onclick="document.getElementById('${popupId}').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if needed
        if (!document.getElementById('popup-styles')) {
            const style = document.createElement('style');
            style.id = 'popup-styles';
            style.textContent = `
                .popup {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    padding: 15px 20px;
                    z-index: 1060;
                    display: flex;
                    align-items: center;
                    max-width: 350px;
                    transform: translateY(-100%);
                    opacity: 0;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
                .popup.show {
                    transform: translateY(0);
                    opacity: 1;
                }
                .popup-icon {
                    margin-right: 12px;
                    font-size: 1.25rem;
                }
                .popup-success .popup-icon { color: #28a745; }
                .popup-warning .popup-icon { color: #ffc107; }
                .popup-error .popup-icon { color: #dc3545; }
                .popup-info .popup-icon { color: #17a2b8; }
                
                .popup-content {
                    flex: 1;
                }
                
                .popup-close {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-left: 12px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            
            // Remove from DOM after animation
            popup.addEventListener('transitionend', function() {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, { once: true });
        }, 3000);
    }
}

// If showConfirmDialog is not defined in main.js, define it here
if (typeof showConfirmDialog !== 'function') {
    function showConfirmDialog(title, message, confirmCallback, cancelCallback = null) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('confirmModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'confirmModal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 id="confirmTitle">${title}</h4>
                        <button class="modal-close" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p id="confirmMessage">${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
                        <button class="btn btn-primary" id="confirmBtn">Confirm</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        } else {
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmMessage').textContent = message;
        }
        
        // Show modal
        modal.classList.add('show');
        
        // Set up buttons
        const confirmBtn = document.getElementById('confirmBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const closeBtn = modal.querySelector('.modal-close');
        
        // Remove previous event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        const newCloseBtn = closeBtn.cloneNode(true);
        
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        // Add new event listeners
        newConfirmBtn.addEventListener('click', function() {
            hideModal(modal);
            if (confirmCallback) confirmCallback();
        });
        
        newCancelBtn.addEventListener('click', function() {
            hideModal(modal);
            if (cancelCallback) cancelCallback();
        });
        
        newCloseBtn.addEventListener('click', function() {
            hideModal(modal);
            if (cancelCallback) cancelCallback();
        });
    }
    
    function hideModal(modal) {
        modal.classList.remove('show');
    }
} 