'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "8f1c1771ddbd23c168a9faf9df9c06b9",
"favicon.ico": "1935503fb540eca75d601c7c96ed05de",
"index.html": "6d047c94f67fa26c711a26be3d5bea30",
"/": "6d047c94f67fa26c711a26be3d5bea30",
"main.dart.js": "f805a199795b06ed9697be50aa046d88",
"icons/favicon-16x16.png": "ff6712da61b0a536cc2689ac8058667f",
"icons/favicon.ico": "1935503fb540eca75d601c7c96ed05de",
"icons/apple-icon.png": "49afb5a3ef8ee43eebc9d7b65f462f68",
"icons/apple-icon-144x144.png": "ab5bfcbbd0812543015217af512f5546",
"icons/android-icon-192x192.png": "b96199a4c74469e966be44a04690df79",
"icons/apple-icon-precomposed.png": "49afb5a3ef8ee43eebc9d7b65f462f68",
"icons/apple-icon-114x114.png": "b9d7a2d6fe17f13c2183e8b9b4019094",
"icons/ms-icon-310x310.png": "682d07d2f9e3b477d33a7da1c86c15f8",
"icons/ms-icon-144x144.png": "ab5bfcbbd0812543015217af512f5546",
"icons/apple-icon-57x57.png": "f2915f3b3c018e927b807a183a0e9337",
"icons/apple-icon-152x152.png": "2e873122c534a06675ba6bcaebf8623f",
"icons/ms-icon-150x150.png": "989df86723dbc9a6ef71a67a1a736de4",
"icons/android-icon-72x72.png": "f9cc39bb01742059331ae09cd7b8b120",
"icons/android-icon-96x96.png": "3ce9a355c32b6e30dbb8857aeff27f9b",
"icons/android-icon-36x36.png": "d75d85c6b49d63c16eae8f0e78f7bc71",
"icons/apple-icon-180x180.png": "a05edb7e3b5462af1f7f1491bb6e6f5a",
"icons/favicon-96x96.png": "3ce9a355c32b6e30dbb8857aeff27f9b",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/android-icon-48x48.png": "1e9601f32ab73f7d946e47ac1ef677ec",
"icons/apple-icon-76x76.png": "f676411a31894b9b5dc3e45072fc1aa1",
"icons/apple-icon-60x60.png": "8e5cdb6d6bf5f2b6b8213baa9ff941be",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-144x144.png": "ab5bfcbbd0812543015217af512f5546",
"icons/apple-icon-72x72.png": "f9cc39bb01742059331ae09cd7b8b120",
"icons/apple-icon-120x120.png": "cad58b2256845b56ce64190f97d48a5d",
"icons/favicon-32x32.png": "9871ff63aa700625dd0d211a24b282ed",
"icons/ms-icon-70x70.png": "ebffa4f90329cbaa206ce93a779236e9",
"manifest.json": "f2a6f9c1def731c7835487caa9816b8e",
"assets/AssetManifest.json": "39e2baccb17467570353ff46f9e89543",
"assets/NOTICES": "8dc0a04aa50aa63e37b6986f09f8af9c",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "e0b89dcc945653983449ac038a40eced",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/2.0x/logo_dark.png": "120448bf3b991d05f10c42493cd6cc40",
"assets/assets/images/2.0x/logo.png": "9c10d7a31ab226c69d1a60feeaedd66a",
"assets/assets/images/3.0x/logo_dark.png": "93f607689a3222f744fa1c86708ffe46",
"assets/assets/images/3.0x/logo.png": "ccfc4b02e1c7e3037be2bc4d5425a6fa",
"assets/assets/images/logo_dark.png": "cbecbca86f4b87c0ec97ce9b45f21600",
"assets/assets/images/logo.png": "466fbc60536466a952186afb7aa0313c"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
