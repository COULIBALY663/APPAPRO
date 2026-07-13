/**
 * Service Worker "Pass-Through" pour Académie Pro
 * Permet l'installabilité (PWA) sans mise en cache bloquante.
 */

// Force le nouveau Service Worker à s'activer immédiatement
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Devient le contrôleur de la page sans attendre un rechargement
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Écoute les requêtes mais ne met RIEN en cache (Laisse passer le réseau en direct)
self.addEventListener('fetch', (event) => {
  return; 
});