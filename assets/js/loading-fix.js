/**
 * Loading Screen Fix for PIPA Farm
 * This script ensures the loading screen is properly hidden regardless of any issues
 * in the main.js or other scripts. Multiple approaches are used for redundancy.
 */

// Approach 1: Run immediately when script is loaded
(function() {
    // Try to hide any existing loaders right away
    hideLoaders();
    
    // Set additional timeouts for redundancy
    setTimeout(hideLoaders, 500);
    setTimeout(hideLoaders, 1000);
    setTimeout(hideLoaders, 2000);
    
    // Function to hide all loaders
    function hideLoaders() {
        var loaders = document.querySelectorAll('.loading');
        loaders.forEach(function(loader) {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 300);
        });
    }
})();

// Approach 2: Handle DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    hideAllLoaders();
    
    // Also set up a mutation observer to catch any dynamically added loaders
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.classList && node.classList.contains('loading')) {
                        setTimeout(function() {
                            hideLoader(node);
                        }, 1000);
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});

// Approach 3: Handle window load event
window.addEventListener('load', function() {
    hideAllLoaders();
});

// Helper function to hide a specific loader
function hideLoader(loader) {
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(function() {
            loader.style.display = 'none';
        }, 300);
    }
}

// Helper function to hide all loaders
function hideAllLoaders() {
    var loaders = document.querySelectorAll('.loading');
    loaders.forEach(hideLoader);
    console.log('Loading screens hidden:', loaders.length);
}

// Approach 4: Last resort - if all else fails, hide after a fixed timeout
setTimeout(function() {
    var loaders = document.querySelectorAll('.loading');
    if (loaders.length > 0) {
        console.log('Emergency loader removal triggered');
        loaders.forEach(function(loader) {
            loader.style.opacity = '0';
            loader.style.display = 'none';
        });
    }
}, 5000); 