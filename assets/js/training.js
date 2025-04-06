/**
 * PIPA Farm - Training Page JavaScript
 * 
 * This script handles specific functionality for the training page,
 * including video controls, course navigation, and progress tracking.
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeTrainingPage();
});

/**
 * Initialize all training page functionality
 */
function initializeTrainingPage() {
    // Initialize video player controls
    initializeVideoPlayer();
    
    // Initialize course navigation
    initializeCourseNavigation();
    
    // Initialize course cards
    initializeCourseCards();
    
    // Handle external video thumbnails
    handleExternalThumbnails();
}

/**
 * Initialize video player and its controls
 */
function initializeVideoPlayer() {
    const videoPlayer = document.querySelector('video');
    if (!videoPlayer) return;
    
    // Handle video playback controls
    const captionButton = document.querySelector('.video-control-btn:nth-child(1)');
    if (captionButton) {
        captionButton.addEventListener('click', function() {
            const tracks = videoPlayer.textTracks;
            if (tracks.length > 0) {
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i].kind === 'subtitles' || tracks[i].kind === 'captions') {
                        if (tracks[i].mode === 'showing') {
                            tracks[i].mode = 'hidden';
                            this.classList.remove('active');
                        } else {
                            tracks[i].mode = 'showing';
                            this.classList.add('active');
                        }
                    }
                }
            }
        });
    }
    
    // Handle download button
    const downloadButton = document.querySelector('.video-control-btn:nth-child(2)');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            const videoSrc = videoPlayer.querySelector('source').src;
            const a = document.createElement('a');
            a.href = videoSrc;
            a.download = 'training-video.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
    
    // Handle notes button
    const notesButton = document.querySelector('.video-control-btn:nth-child(3)');
    if (notesButton) {
        notesButton.addEventListener('click', function() {
            // Create notes container if it doesn't exist
            if (!document.querySelector('.video-notes')) {
                const notesContainer = document.createElement('div');
                notesContainer.className = 'video-notes';
                notesContainer.innerHTML = `
                    <h4>Notes</h4>
                    <textarea placeholder="Take notes while watching the video..."></textarea>
                    <button class="btn btn-primary btn-sm save-notes">Save Notes</button>
                `;
                document.querySelector('.video-info').appendChild(notesContainer);
                
                // Add save functionality
                document.querySelector('.save-notes').addEventListener('click', function() {
                    const notes = document.querySelector('.video-notes textarea').value;
                    // Save to localStorage
                    localStorage.setItem('training-notes', notes);
                    showNotification('Success', 'Notes saved successfully!', 'success');
                });
            } else {
                // Toggle notes visibility
                const notesElement = document.querySelector('.video-notes');
                notesElement.style.display = notesElement.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
}

/**
 * Initialize course navigation functionality
 */
function initializeCourseNavigation() {
    const prevButton = document.querySelector('.course-navigation button:first-child');
    const nextButton = document.querySelector('.course-navigation button:last-child');
    
    if (!prevButton || !nextButton) return;
    
    prevButton.addEventListener('click', function() {
        const activeItem = document.querySelector('.module-item.active');
        if (!activeItem) return;
        
        const prevItem = activeItem.previousElementSibling;
        if (prevItem && !prevItem.classList.contains('locked')) {
            prevItem.click();
        }
    });
    
    nextButton.addEventListener('click', function() {
        const activeItem = document.querySelector('.module-item.active');
        if (!activeItem) return;
        
        const nextItem = activeItem.nextElementSibling;
        if (nextItem && !nextItem.classList.contains('locked')) {
            nextItem.click();
        }
    });
    
    // Make module items clickable
    const moduleItems = document.querySelectorAll('.module-item');
    moduleItems.forEach(item => {
        if (!item.classList.contains('locked')) {
            item.addEventListener('click', function() {
                // Remove active class from all items
                moduleItems.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Update module progress text
                const progressText = document.querySelector('.course-progress-text');
                if (progressText) {
                    const currentIndex = Array.from(moduleItems).indexOf(this) + 1;
                    progressText.textContent = `Module ${currentIndex} of ${moduleItems.length}`;
                }
                
                // You would typically load the corresponding video/content here
                showNotification('Info', `Loading module content...`, 'info');
            });
        }
    });
}

/**
 * Initialize course cards with click handlers
 */
function initializeCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseTitle = this.querySelector('.course-title').textContent;
            // Navigate to course detail page or expand course content
            showNotification('Info', `Opening course: ${courseTitle}`, 'info');
            
            // For demo purposes - in a real app this would navigate to the course page
            setTimeout(() => {
                document.querySelector('.course-review-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }, 1000);
        });
    });
    
    // Handle certification download buttons
    const certButtons = document.querySelectorAll('.cert-btn');
    certButtons.forEach(button => {
        if (button.innerHTML.includes('Download')) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const certName = this.closest('.certification-card').querySelector('h3').textContent;
                showNotification('Success', `Downloading certificate: ${certName}`, 'success');
            });
        } else if (button.innerHTML.includes('Start')) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const certName = this.closest('.certification-card').querySelector('h3').textContent;
                showNotification('Info', `Starting certification: ${certName}`, 'info');
            });
        }
    });
}

/**
 * Replace external video thumbnails with local placeholders if they fail to load
 */
function handleExternalThumbnails() {
    const thumbnails = document.querySelectorAll('.course-thumbnail img, .video-player video[poster]');
    
    thumbnails.forEach(img => {
        // Add error handler for images
        img.addEventListener('error', function() {
            // For video posters
            if (this.parentElement.tagName === 'VIDEO') {
                this.parentElement.setAttribute('poster', 'assets/images/video-placeholder.jpg');
            } else {
                // For regular images
                this.src = 'assets/images/course-placeholder.jpg';
            }
        });
    });
} 