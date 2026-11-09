/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // Let an installed client finish its current form before it takes over.
  skipWaiting: false,
  clientsClaim: false,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && /^\/assets\/species\/[^/]+\.[a-f0-9]+\.webp$/.test(url.pathname),
      handler: new CacheFirst({
        cacheName: "bangwit-species-art-v1",
        plugins: [new ExpirationPlugin({ maxEntries: 24, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true })],
      }),
    },
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname === "/api/advisories",
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
