// Nama cache untuk aplikasi Anda
const CACHE_NAME = 'e-laporan-cache-v1';
// Daftar aset yang akan di-cache
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  // Tambahkan URL ikon placeholder yang digunakan di manifest.json
  'https://placehold.co/48x48/4A90E2/FFFFFF?text=EL',
  'https://placehold.co/72x72/4A90E2/FFFFFF?text=EL',
  'https://placehold.co/96x96/4A90E2/FFFFFF?text=EL',
  'https://placehold.co/144x144/4A90E2/FFFFFF?text=EL',
  'https://placehold.co/192x192/4A90E2/FFFFFF?text=EL',
  'https://placehold.co/512x512/4A90E2/FFFFFF?text=EL'
];

// Event: Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: Fetch (mengambil sumber daya)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, lakukan fetch dari jaringan
        return fetch(event.request).then(
          function(response) {
            // Periksa apakah kami menerima respons yang valid
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Kloning respons karena stream respons hanya dapat dikonsumsi sekali
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Event: Activate Service Worker (membersihkan cache lama)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
                // Hapus cache lama
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
