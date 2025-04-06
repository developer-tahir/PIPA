/**
 * PIPA Farm - Settings Page JavaScript
 * This file contains functionality specific to the settings page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings tabs
    initializeSettingsTabs();
    
    // Initialize form actions
    initializeFormActions();
});

/**
 * Initialize settings tabs functionality
 */
function initializeSettingsTabs() {
    const navItems = document.querySelectorAll('.settings-nav .nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetSection)?.classList.add('active');
        });
    });
}

/**
 * Initialize form actions (save, reset, etc.)
 */
function initializeFormActions() {
    // Save changes button
    const saveButton = document.querySelector('.header-actions .btn-primary');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Simulate saving
            showPopup('notificationSuccess', 'Settings saved successfully', 'success');
        });
    }
    
    // Reset changes button
    const resetButton = document.querySelector('.header-actions .btn-secondary');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            showConfirmDialog(
                'Reset Changes', 
                'Are you sure you want to reset all changes? This action cannot be undone.', 
                function() {
                    // This function is called when confirmed
                    resetForms();
                    showPopup('notificationReset', 'Settings have been reset', 'info');
                }
            );
        });
    }
    
    // Initialize modal buttons for Location and Activities
    initializeModalButtons();
}

/**
 * Initialize modal buttons for Location and Activities sections
 */
function initializeModalButtons() {
    // Location add button
    const addLocationButton = document.querySelector('.locations-card .btn-primary');
    if (addLocationButton) {
        addLocationButton.addEventListener('click', function() {
            showPopup('notificationLocation', 'Add location feature coming soon', 'info');
        });
    }
    
    // Activities add button
    const addActivityButton = document.querySelector('.activities-card .btn-primary');
    if (addActivityButton) {
        addActivityButton.addEventListener('click', function() {
            showPopup('notificationActivity', 'Add activity feature coming soon', 'info');
        });
    }
    
    // Edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.querySelector('td:first-child').textContent;
            showPopup('notificationEdit', `Edit "${name}" feature coming soon`, 'info');
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const name = row.querySelector('td:first-child').textContent;
            
            showConfirmDialog(
                'Confirm Deletion', 
                `Are you sure you want to delete "${name}"? This action cannot be undone.`, 
                function() {
                    // Actually remove the row for demo purposes
                    row.remove();
                    showPopup('notificationDelete', `"${name}" has been deleted`, 'success');
                }
            );
        });
    });
}

/**
 * Reset all form fields to their default values
 */
function resetForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    // For non-form elements that need resetting
    const inputs = document.querySelectorAll('input:not([type="submit"]), textarea, select');
    inputs.forEach(input => {
        if (input.defaultValue) {
            input.value = input.defaultValue;
        }
    });
} 