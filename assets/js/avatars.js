/**
 * PIPA Farm - Avatar Fallback System
 * 
 * This script enhances all avatar images in the application with:
 * 1. Consistent error handling for missing images
 * 2. User initials display as fallback
 * 3. Default avatar paths
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAvatarSystem();
});

/**
 * Initializes the avatar fallback system across the application
 */
function initializeAvatarSystem() {
    // Create local image paths for known users
    const avatarMap = {
        'Tahir M': 'assets/images/avatar1.jpg',
        'Sam Pritchard': 'assets/images/avatar2.jpg',
        'John Smith': 'assets/images/avatar3.jpg',
        'Jane Doe': 'assets/images/avatar4.jpg'
    };
    
    // Find all avatar images
    const avatarImages = document.querySelectorAll('.profile-avatar img, .avatar img, .profile-photo img, .conversation-avatar img, .message-avatar img');
    console.log(`Avatar fallback system initialized for ${avatarImages.length} images`);
    
    // Enhance each avatar with fallback
    avatarImages.forEach(img => {
        // Make sure img is valid
        if (!img || img.hasAttribute('data-avatar-processed')) return;
        
        // Mark as processed to avoid duplication
        img.setAttribute('data-avatar-processed', 'true');
        
        // Get the alt text (usually contains the user name)
        const userName = img.getAttribute('alt') || '';
        
        // Calculate user initials for fallback
        let initials = '';
        if (userName) {
            const nameParts = userName.split(' ');
            if (nameParts.length >= 2) {
                initials = nameParts[0][0] + nameParts[1][0];
            } else if (nameParts.length === 1) {
                initials = nameParts[0].substring(0, 2);
            }
        }
        
        // Set fallback functionality
        if (initials) {
            img.onerror = function() {
                this.style.display = 'none';
                if (!this.parentElement.querySelector('.avatar-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'avatar-fallback';
                    fallback.textContent = initials;
                    this.parentElement.appendChild(fallback);
                }
            };
        }
        
        // If we have a mapped avatar for this user, use it
        if (avatarMap[userName] && !img.src.includes(avatarMap[userName])) {
            img.src = avatarMap[userName];
        }
        
        // Force onerror if image is already loaded but failed
        if (img.complete && img.naturalHeight === 0) {
            img.onerror();
        }
    });
}

// Expose function globally for potential dynamic elements
window.initializeAvatarSystem = initializeAvatarSystem; 