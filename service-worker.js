// PIPA Farm Service Worker for Offline Support
const CACHE_NAME = 'pipa-farm-cache-v2';

// Files to cache for offline use
const CACHE_FILES = [
  '/',
  '/index.html',
  '/tasks.html',
  '/timesheet.html',
  '/safety.html',
  '/calendar.html',
  '/employees.html',
  '/find-workers.html',
  '/chat.html',
  '/training.html',
  '/settings.html',
  '/profile.html',
  '/change-password.html',
  '/accessibility.html',
  '/register.html',
  '/login.html',
  '/forgot-password.html',
  '/assets/css/style.css',
  '/assets/css/sidebar.css',
  '/assets/css/dashboard.css',
  '/assets/css/enhanced-buttons.css',
  '/assets/css/notifications.css',
  '/assets/css/profile.css',
  '/assets/css/safety.css',
  '/assets/css/auth.css',
  '/assets/js/common.js',
  '/assets/js/common-links.js',
  '/assets/js/main.js',
  '/assets/js/profile.js',
  '/assets/js/auth.js',
  '/assets/js/avatars.js',
  '/assets/images/avatar1.jpg',
  '/assets/images/avatar2.jpg',
  '/assets/images/logo.png',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install the service worker and cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker caching files');
        return cache.addAll(CACHE_FILES);
      })
      .catch(error => {
        console.error('Service Worker cache failed:', error);
      })
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  // Claim clients to ensure the service worker is in control
  event.waitUntil(self.clients.claim());
  
  // Delete old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle network requests with offline support
self.addEventListener('fetch', event => {
  // Skip cross-origin requests to avoid CORS issues
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('googleapis.com') && 
      !event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }
  
  // For HTML pages, try network first then fallback to cache
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('accept').includes('text/html'))) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache and return the original
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          console.log('Service Worker serving cached page for:', event.request.url);
          return caches.match(event.request)
            .then(cachedResponse => {
              // Return cached response or offline fallback
              return cachedResponse || caches.match('/index.html');
            });
        })
    );
    return;
  }
  
  // For other requests, try cache first, then network (with cache update)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response immediately
          
          // Update cache in the background (for CSS, JS, etc.)
          if (event.request.method === 'GET' && 
              (event.request.url.endsWith('.css') || 
               event.request.url.endsWith('.js') || 
               event.request.url.includes('/assets/'))) {
            
            fetch(event.request)
              .then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              })
              .catch(error => {
                console.error('Background fetch failed:', error);
              });
          }
          
          return cachedResponse;
        }
        
        // Not in cache, get from network
        return fetch(event.request)
          .then(response => {
            // Clone the response
            const responseClone = response.clone();
            
            // Open the cache
            caches.open(CACHE_NAME).then(cache => {
              // Put the response in the cache
              cache.put(event.request, responseClone);
            });
            
            // Return the original response
            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            
            // For images, return a placeholder
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
              return caches.match('/assets/images/placeholder.png');
            }
            
            // For other resources, just propagate the error
            throw error;
          });
      })
  );
});

// Handle background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'submit-form') {
    event.waitUntil(syncForms());
  }
});

// Function to sync forms that were submitted while offline
async function syncForms() {
  try {
    const storedRequests = await getStoredRequests();
    
    await Promise.all(storedRequests.map(async (request) => {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });
        
        if (response.ok) {
          await removeStoredRequest(request.id);
          
          // Notify the client that sync was successful
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'FORM_SYNCED',
              success: true,
              requestId: request.id
            });
          });
        }
      } catch (error) {
        console.error('Failed to sync request:', error);
      }
    }));
  } catch (error) {
    console.error('Error during form sync:', error);
  }
}

// Helper function to get stored requests from IndexedDB
async function getStoredRequests() {
  // This would be implemented using IndexedDB in a production environment
  // For this example, we just return an empty array
  return [];
}

// Helper function to remove a successfully synced request
async function removeStoredRequest(id) {
  // This would remove the synced request from IndexedDB
  console.log('Removed synced request with ID:', id);
}

// Listen for messages from clients
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data.type === 'CACHE_UPDATED') {
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(event.data.urls);
    });
  }
});

// Periodic background sync for data updates (when supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
      event.waitUntil(updateContent());
    }
  });
}

async function updateContent() {
  // Update critical content when online
  try {
    const response = await fetch('/api/latest-data');
    if (response.ok) {
      const data = await response.json();
      
      // Notify clients about new data
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'CONTENT_UPDATED',
          data: data
        });
      });
      
      // Store in cache
      const cache = await caches.open(CACHE_NAME);
      for (const url of data.urls) {
        try {
          const response = await fetch(url);
          await cache.put(url, response);
        } catch (error) {
          console.error('Failed to cache updated content:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error updating content:', error);
  }
} 