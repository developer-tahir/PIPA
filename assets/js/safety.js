/**
 * PIPA Farm - Safety Reports Page
 * This file contains functionality specific to the safety reports page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize safety report cards
    initSafetyReportCards();
    
    // Initialize action buttons
    initActionButtons();
    
    // Initialize floating action button
    initFloatingActionButton();
});

/**
 * Initialize safety report cards with interactive features
 */
function initSafetyReportCards() {
    const reportCards = document.querySelectorAll('.report-card');
    
    reportCards.forEach(card => {
        // Add click listener to View Details buttons
        const viewDetailsBtn = card.querySelector('.btn-outline');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function() {
                const reportTitle = card.querySelector('h4').textContent;
                showReportDetails(reportTitle, card);
            });
        }
        
        // Add click listener to Edit buttons
        const editBtn = card.querySelector('.btn-secondary');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                showEditReportForm(card);
            });
        }
        
        // Add click listener to Mark as Started buttons
        const startBtn = card.querySelector('.btn-primary');
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                updateReportStatus(card, 'In Progress');
            });
        }
        
        // Make report images clickable to show larger view
        const reportImages = card.querySelectorAll('.report-image');
        reportImages.forEach(img => {
            img.addEventListener('click', function() {
                showImageFullscreen(this.src, this.alt);
            });
        });
    });
}

/**
 * Initialize action buttons in the header section
 */
function initActionButtons() {
    const actionButtons = document.querySelectorAll('.header-actions .btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            showActionForm(buttonText);
        });
    });
}

/**
 * Initialize floating action button functionality
 */
function initFloatingActionButton() {
    const fab = document.querySelector('.fab');
    
    if (fab) {
        fab.addEventListener('click', function() {
            // Show a menu with options when clicking the FAB
            const menuItems = [
                {
                    text: 'Report Hazard',
                    icon: 'fas fa-exclamation-triangle',
                    action: () => showActionForm('Hazard Report')
                },
                {
                    text: 'Report Incident',
                    icon: 'fas fa-exclamation-circle',
                    action: () => showActionForm('Near Miss or Incident')
                },
                {
                    text: 'Maintenance Request',
                    icon: 'fas fa-wrench',
                    action: () => showActionForm('Maintenance Request')
                },
                {
                    text: 'Pre-start Check',
                    icon: 'fas fa-clipboard-check',
                    action: () => showActionForm('Pre-start Check')
                }
            ];
            
            const fabRect = fab.getBoundingClientRect();
            const event = { 
                preventDefault: () => {},
                pageX: fabRect.left, 
                pageY: fabRect.top - 10
            };
            
            showContextMenu(event, menuItems);
        });
    }
}

/**
 * Show a detailed view of a safety report
 * @param {string} title - The report title
 * @param {HTMLElement} reportCard - The report card element
 */
function showReportDetails(title, reportCard) {
    // In a real application, this would fetch the full report details
    // For now, we'll just show what's in the card with a popup
    
    const reportType = reportCard.classList.contains('incident') ? 'Incident' : 
                      reportCard.classList.contains('hazard') ? 'Hazard' : 'Safety Report';
    const reportDate = reportCard.querySelector('.report-date').textContent.trim();
    const reportDesc = reportCard.querySelector('p').textContent.trim();
    const reportLocation = reportCard.querySelector('.report-location').textContent.trim();
    
    // Get the assignee/reporter name
    const personName = reportCard.querySelector('.report-name') ? 
                      reportCard.querySelector('.report-name').textContent.trim() :
                      reportCard.querySelector('.report-user span').textContent.trim();
    
    // Create dialog content
    const dialogContent = `
        <div class="report-detail-view">
            <div class="report-detail-header">
                <span class="report-type">${reportType}</span>
                <span class="report-date">${reportDate}</span>
            </div>
            <h3>${title}</h3>
            <p class="report-detail-desc">${reportDesc}</p>
            <div class="report-detail-meta">
                <div class="meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${reportLocation}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <span>Reported by: ${personName}</span>
                </div>
            </div>
            <div class="report-actions detail-actions">
                <button class="btn btn-outline-primary report-detail-action" data-action="reassign">
                    <i class="fas fa-user-plus"></i> Reassign
                </button>
                <button class="btn btn-outline-warning report-detail-action" data-action="update">
                    <i class="fas fa-edit"></i> Update Status
                </button>
            </div>
        </div>
    `;
    
    // Show dialog with details
    showDialog('Safety Report Details', dialogContent);
}

/**
 * Show a form to edit a safety report
 * @param {HTMLElement} reportCard - The report card element
 */
function showEditReportForm(reportCard) {
    // For demo purposes, just show a dialog with a message
    showPopup('notification', 'Edit report feature coming soon', 'info');
}

/**
 * Update the status of a safety report
 * @param {HTMLElement} reportCard - The report card element
 * @param {string} newStatus - The new status to set
 */
function updateReportStatus(reportCard, newStatus) {
    const statusElement = reportCard.querySelector('.report-status');
    
    if (statusElement) {
        // Remove existing status classes
        statusElement.classList.remove('status-not-started', 'status-in-progress', 'status-completed');
        
        // Add new status class
        const statusClass = newStatus.toLowerCase().replace(/\s+/g, '-');
        statusElement.classList.add(`status-${statusClass}`);
        
        // Update icon and text
        const icon = statusElement.querySelector('i');
        if (icon) {
            // Change icon based on status
            icon.className = newStatus === 'In Progress' ? 'fas fa-spinner' :
                          newStatus === 'Completed' ? 'fas fa-check-circle' :
                          'fas fa-exclamation-circle';
        }
        
        // Update the text
        statusElement.innerHTML = statusElement.innerHTML.replace(
            statusElement.textContent.trim(),
            newStatus
        );
        
        // Update button
        const startBtn = reportCard.querySelector('.btn-primary');
        if (startBtn) {
            if (newStatus === 'In Progress') {
                startBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Completed';
                startBtn.onclick = function() { updateReportStatus(reportCard, 'Completed'); };
            } else if (newStatus === 'Completed') {
                startBtn.remove(); // Or disable: startBtn.disabled = true;
            }
        }
        
        // Show notification
        showPopup('notification', `Report status updated to ${newStatus}`, 'success');
    }
}

/**
 * Show a form for creating a new safety report or related action
 * @param {string} actionType - The type of action/report
 */
function showActionForm(actionType) {
    // For demo purposes, just show a notification
    showPopup('notification', `${actionType} form coming soon`, 'info');
}

/**
 * Show a dialog with custom content
 * @param {string} title - Dialog title
 * @param {string} content - HTML content for the dialog
 */
function showDialog(title, content) {
    // Create dialog background
    const dialogBackground = document.createElement('div');
    dialogBackground.className = 'dialog-background';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'dialog';
    
    // Add dialog content
    dialog.innerHTML = `
        <div class="dialog-header">
            <h3>${title}</h3>
            <button class="dialog-close" aria-label="Close dialog">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="dialog-content">
            ${content}
        </div>
    `;
    
    // Add to document
    dialogBackground.appendChild(dialog);
    document.body.appendChild(dialogBackground);
    
    // Add event listeners for close button
    const closeButton = dialog.querySelector('.dialog-close');
    closeButton.addEventListener('click', function() {
        dialogBackground.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(dialogBackground);
        }, 300);
    });
    
    // Add event listeners for action buttons if they exist
    const actionButtons = dialog.querySelectorAll('.report-detail-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleDetailAction(action, dialog);
        });
    });
    
    // Show dialog with animation
    setTimeout(() => {
        dialogBackground.classList.add('active');
    }, 10);
}

/**
 * Handle actions from the detail view
 * @param {string} action - The action to perform
 * @param {HTMLElement} dialog - The dialog element
 */
function handleDetailAction(action, dialog) {
    // Close the dialog
    const dialogBackground = dialog.parentElement;
    dialogBackground.classList.remove('active');
    setTimeout(() => {
        if (dialogBackground.parentNode) {
            document.body.removeChild(dialogBackground);
        }
    }, 300);
    
    // Handle the action
    switch (action) {
        case 'reassign':
            showPopup('notification', 'Reassign feature coming soon', 'info');
            break;
        case 'update':
            showPopup('notification', 'Update status feature coming soon', 'info');
            break;
        default:
            break;
    }
}

/**
 * Show a full-screen view of an image
 * @param {string} src - The image source URL
 * @param {string} alt - The image alt text
 */
function showImageFullscreen(src, alt) {
    // Create fullscreen container
    const container = document.createElement('div');
    container.className = 'fullscreen-image-container';
    
    // Create image element
    container.innerHTML = `
        <div class="fullscreen-image-wrapper">
            <img src="${src}" alt="${alt}" class="fullscreen-image">
            <button class="fullscreen-close" aria-label="Close image">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(container);
    
    // Add close functionality
    const closeButton = container.querySelector('.fullscreen-close');
    closeButton.addEventListener('click', function() {
        document.body.removeChild(container);
    });
    
    // Close on click outside the image
    container.addEventListener('click', function(e) {
        if (e.target === container) {
            document.body.removeChild(container);
        }
    });
    
    // Add ESC key handler
    const escHandler = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(container);
            document.removeEventListener('keydown', escHandler);
        }
    };
    
    document.addEventListener('keydown', escHandler);
} 