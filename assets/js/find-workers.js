/**
 * PIPA Farm - Find Workers Page
 * Handles functionality specific to the Find Workers page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive elements specific to Find Workers page
    
    // Save worker functionality
    const saveButtons = document.querySelectorAll('.worker-actions .btn-outline-secondary');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isSaved = icon.classList.contains('fas');
            
            if (isSaved) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showPopup('notification', 'Worker removed from saved list', 'info');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showPopup('notification', 'Worker saved to your list', 'success');
            }
        });
    });
    
    // Contact worker functionality
    const contactButtons = document.querySelectorAll('.worker-actions .btn-primary');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the worker name from the card
            const workerName = this.closest('.worker-card').querySelector('.worker-info h4').textContent;
            showPopup('notification', `Contact request sent to ${workerName}`, 'success');
            
            // In a real app, this would open a contact form or chat
            console.log(`Contact ${workerName}`);
        });
    });
    
    // Reset filter button
    const resetButton = document.querySelector('.filter-actions .btn-outline-secondary');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.checkbox-label input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            
            // Reset search fields
            document.getElementById('keyword').value = '';
            document.getElementById('location').value = '';
            document.getElementById('distance').value = '50';
            
            showPopup('notification', 'Filters have been reset', 'info');
        });
    }
    
    // Initialize availability filter buttons
    initAvailabilityFilters();
    
    // Initialize worker card functionality
    initWorkerCards();
});

/**
 * Initialize availability filter buttons
 */
function initAvailabilityFilters() {
    const availabilityChips = document.querySelectorAll('.availability-filter-chip');
    
    availabilityChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Filter workers based on selected availability
            filterWorkersByAvailability();
        });
    });
}

/**
 * Filter worker cards based on selected availability filters
 */
function filterWorkersByAvailability() {
    const selectedAvailabilities = [];
    document.querySelectorAll('.availability-filter-chip.active').forEach(chip => {
        selectedAvailabilities.push(chip.getAttribute('data-day'));
    });
    
    // If no filters are selected, show all
    if (selectedAvailabilities.length === 0) {
        document.querySelectorAll('.worker-card').forEach(card => {
            card.style.display = 'flex';
        });
        return;
    }
    
    // Filter workers
    document.querySelectorAll('.worker-card').forEach(card => {
        const workerAvailabilities = [];
        card.querySelectorAll('.availability-badge').forEach(badge => {
            workerAvailabilities.push(badge.getAttribute('data-day'));
        });
        
        // Check if any of the worker's availabilities match the selected filters
        const hasMatch = selectedAvailabilities.some(day => workerAvailabilities.includes(day));
        
        card.style.display = hasMatch ? 'flex' : 'none';
    });
}

/**
 * Initialize functionality for worker cards
 */
function initWorkerCards() {
    // Add effect when hovering over worker cards
    const workerCards = document.querySelectorAll('.worker-card');
    
    workerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // Add click event to cards for mobile view
        card.addEventListener('click', function(e) {
            // Ignore clicks on buttons
            if (e.target.closest('button')) {
                return;
            }
            
            // Toggle expanded state (only affects mobile view)
            this.classList.toggle('expanded');
        });
    });
}

/**
 * Apply search filters
 */
function applyFilters() {
    const keyword = document.getElementById('keyword').value.toLowerCase();
    const location = document.getElementById('location').value.toLowerCase();
    const distance = parseInt(document.getElementById('distance').value);
    
    // Get selected job types
    const selectedJobTypes = [];
    document.querySelectorAll('.job-type-filter input:checked').forEach(checkbox => {
        selectedJobTypes.push(checkbox.value);
    });
    
    // Apply filters to worker cards
    document.querySelectorAll('.worker-card').forEach(card => {
        const workerName = card.querySelector('.worker-info h4').textContent.toLowerCase();
        const workerSkills = card.querySelector('.worker-skills').textContent.toLowerCase();
        const workerLocation = card.querySelector('.worker-location').textContent.toLowerCase();
        const workerJobType = card.getAttribute('data-job-type');
        
        // Check if worker matches all selected filters
        const matchesKeyword = !keyword || workerName.includes(keyword) || workerSkills.includes(keyword);
        const matchesLocation = !location || workerLocation.includes(location);
        const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.includes(workerJobType);
        
        // Show/hide card based on filter results
        card.style.display = (matchesKeyword && matchesLocation && matchesJobType) ? 'flex' : 'none';
    });
    
    // Show message if no results
    const visibleCards = document.querySelectorAll('.worker-card[style="display: flex"]').length;
    const noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleCards === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No workers found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                    <button class="btn btn-primary" onclick="document.querySelector('.filter-actions .btn-outline-secondary').click()">
                        Reset Filters
                    </button>
                </div>
            `;
            document.querySelector('.worker-grid').appendChild(message);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    showPopup('notification', 'Filters applied', 'info');
} 