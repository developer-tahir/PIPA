/**
 * Avatar Fallback Script for PIPA Farm
 * This script ensures that all avatars across the site have proper fallbacks
 * if the image fails to load, generating a text-based avatar with initials.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix all avatar images on the page
    fixAvatarImages();
    
    // Set up a mutation observer to handle dynamically added avatar images
    setupAvatarObserver();
});

/**
 * Fix all avatar images on the page
 */
function fixAvatarImages() {
    // Find all avatar elements
    const avatarContainers = document.querySelectorAll('.profile-avatar, .worker-avatar, .avatar');
    
    avatarContainers.forEach(container => {
        const img = container.querySelector('img');
        if (img) {
            // Extract the alt text which should contain the user's name
            const altText = img.getAttribute('alt') || 'User';
            const initials = getInitials(altText);
            
            // Set the background color based on the name
            const backgroundColor = getAvatarColor(altText);
            
            // Ensure the image has proper error handling
            if (!img.hasAttribute('onerror') || img.getAttribute('onerror').indexOf('this.onerror=null') === -1) {
                img.setAttribute('onerror', `this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='${initials}'; this.parentElement.style.backgroundColor='${backgroundColor}';`);
            }
            
            // If the image is already loaded but broken, trigger the fallback
            if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
                img.style.display = 'none';
                container.innerHTML = initials;
                container.style.backgroundColor = backgroundColor;
            }
        } else {
            // If there's no image at all, create a fallback
            const containerText = container.textContent.trim();
            if (!containerText) {
                const initials = 'U'; // Default user
                const backgroundColor = getAvatarColor('User');
                container.innerHTML = initials;
                container.style.backgroundColor = backgroundColor;
            }
        }
    });
}

/**
 * Set up a mutation observer to watch for dynamically added avatar images
 */
function setupAvatarObserver() {
    const observer = new MutationObserver(mutations => {
        let shouldFixAvatars = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (
                            node.classList && 
                            (node.classList.contains('profile-avatar') || 
                             node.classList.contains('worker-avatar') || 
                             node.classList.contains('avatar'))
                        ) {
                            shouldFixAvatars = true;
                            break;
                        }
                        
                        if (node.querySelector && (
                            node.querySelector('.profile-avatar') || 
                            node.querySelector('.worker-avatar') || 
                            node.querySelector('.avatar'))
                        ) {
                            shouldFixAvatars = true;
                            break;
                        }
                    }
                }
            }
        });
        
        if (shouldFixAvatars) {
            fixAvatarImages();
        }
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
}

/**
 * Get initials from a name
 * @param {string} name - The name to extract initials from
 * @returns {string} - The initials (max 2 characters)
 */
function getInitials(name) {
    if (!name || typeof name !== 'string') return 'U';
    
    const nameParts = name.split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) return 'U';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a consistent color based on the name
 * @param {string} name - The name to generate a color for
 * @returns {string} - A hex color code
 */
function getAvatarColor(name) {
    if (!name || typeof name !== 'string') {
        name = 'User';
    }
    
    // Generate a hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // List of good background colors that work well with white text
    const colors = [
        '#4CAF50', // Green
        '#2196F3', // Blue
        '#9C27B0', // Purple
        '#FF5722', // Deep Orange
        '#607D8B', // Blue Grey
        '#795548', // Brown
        '#F44336', // Red
        '#009688', // Teal
        '#673AB7', // Deep Purple
        '#3F51B5', // Indigo
        '#FFC107', // Amber
        '#FF9800', // Orange
        '#8BC34A', // Light Green
        '#CDDC39', // Lime
        '#00BCD4', // Cyan
        '#E91E63'  // Pink
    ];
    
    // Use the hash to pick a color
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

// Export functions for use in other modules
window.avatarUtils = {
    fixAvatarImages,
    getInitials,
    getAvatarColor
}; 