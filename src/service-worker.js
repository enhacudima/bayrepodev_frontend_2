
import {precacheAndRoute} from 'workbox-precaching';
import { setCatchHandler, registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
//import { expiration } from 'workbox-expiration';
import {matchPrecache} from 'workbox-precaching';
import { ExpirationPlugin } from 'workbox-expiration';


precacheAndRoute(self.__WB_MANIFEST);

//precacheAndRoute(self.__precacheManifest);

// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
  // Return the precached offline page if a document is being requested
  if (event.request.destination === 'document') {
    return matchPrecache('/public/offline.html');
  }

  return Response.error();
});

registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg|jfif)$/,
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})