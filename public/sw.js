self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o novo SW a ativar logo
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// ESTE É O HANDLER QUE O CHROME EXIGE PARA A INSTALAÇÃO
self.addEventListener('fetch', (event) => {
  // Podes deixar vazio, ou colocar lógica de cache no futuro
});

// Notificações Push (o que já tinhas)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'VAPT', {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});