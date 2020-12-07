/**
 * Service worker for default frontend realm.
 *
 * @type {ServiceWorkerGlobalScope} self
 */
'use strict';

const API_STATIC_FILES = '/api/app/sw/files_to_cache/desk'; // route to get list of files to cache on startup
const CACHE_STATIC = 'desk-cache-v1'; // store name to cache static resources
const ROUTE_API = 'api';            // marker for API routes (don't cache)
const ROUTE_STATIC = 'static';      // marker for static resources (to be cached)
const ROUTE_WORKER = 'sw';          // marker for Service Worker commands

/**
 * Service worker flag to use cache to process fetch requests (disabled by default).
 *
 * @type {boolean}
 * @private
 */
let _cacheEnabled = false;

/**
 * Handler for 'install' event (cache static resources).
 *
 * @param {ExtendableEvent} evt
 */
function hndlEventInstall(evt) {
    /**
     * @returns {Promise<void>}
     */
    async function cacheStaticFiles() {
        try {
            // Get list of static files
            const req = new Request(API_STATIC_FILES);
            const resp = await self.fetch(req);
            const json = await resp.json();
            const files = json.urls;
            if (Array.isArray(files)) {
                // ... and load static files to the local cache
                const cacheStat = await caches.open(CACHE_STATIC);
                // await cacheStat.addAll(files);
                await Promise.all(
                    files.map(function (url) {
                        return cacheStat.add(url).catch(function (reason) {
                            console.log(`'${url}' failed: ${String(reason)}`);
                        });
                    })
                );
            }
        } catch (e) {
            console.log('[SW] install error: ');
            console.dir(e);
        }
    }

    //  wait until all static files will be cached
    evt.waitUntil(cacheStaticFiles());
}

/**
 * Send message to `index.html` to start bootstrap.
 */
function hndlEventActivate() {
    self.clients.claim();
}

/**
 *
 * @param {FetchEvent} evt
 */
function hndlEventFetch(evt) {
    /**
     * Analyze route's URL and return route type (api, service worker or static).
     * @param {Request} req
     * @returns {string}
     */
    function getRouteType(req) {
        const API = /(.*)(\/api\/)(.*)/;
        const API_APP = /(.*)(\/js\/app\/api\/)(.*)/;
        const SW = /(.*)(\/sw\/)(.*)/;
        if (
            req.url.match(API) &&
            !req.url.match(API_APP)
        ) {
            return ROUTE_API;
        } else if (req.url.match(SW)) {
            return ROUTE_WORKER;
        }
        return ROUTE_STATIC;
    }

    /**
     * @returns {Promise<Response>}
     */
    async function getFromCacheOrFetchAndCache() {
        try {
            const cache = await self.caches.open(CACHE_STATIC);
            const cachedResponse = await cache.match(evt.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            // wait until resource will be fetched from server and stored in cache
            const resp = await fetch(evt.request);
            await cache.put(evt.request, resp.clone());
            return resp;
        } catch (e) {
            console.log('[SW] error: ');
            console.dir(e);
        }
    }

    /**
     * Processor for service worker command:
     *  - /cache/clean
     *  - /cache/disable
     *  - /cache/enable
     *  - /cache/status
     *
     * @param {FetchEvent} evt
     */
    async function processWorkerCommand(evt) {
        try {
            const url = evt.request.url;
            const dataOut = {};
            if (url.includes('/cache/clean')) {
                await self.caches.delete(CACHE_STATIC);
                _cacheEnabled = true;
                dataOut.message = 'Cache is cleaned and enabled.';
            } else if (url.includes('/cache/disable')) {
                _cacheEnabled = false;
                dataOut.message = 'Cache is disabled.';
            } else if (url.includes('/cache/enable')) {
                _cacheEnabled = true;
                dataOut.message = 'Cache is enabled.';
            } else if (url.includes('/cache/status')) {
                const status = (_cacheEnabled) ? 'enabled' : 'disabled';
                dataOut.message = `Cache status: ${status}`;
            } else {
                dataOut.message = 'Unknown command.';
            }
            return new Response(JSON.stringify({data: dataOut}), {
                headers: {'Content-Type': 'application/json'}
            });
        } catch (e) {
            return new Response(JSON.stringify({error: e}), {
                headers: {'Content-Type': 'application/json'}
            });
        }
    }

    // const url = evt.request.url;
    const routeType = getRouteType(evt.request);
    if (routeType === ROUTE_API) {
        // just pass the request to server
    } else if (routeType === ROUTE_WORKER) {
        // perform any service routines with service worker
        evt.respondWith(processWorkerCommand(evt));
    } else {
        // get static resource by default
        if (_cacheEnabled) {
            // console.log('[SW] Fetch \'%s\' as \'%s\' route.', url, routeType);
            evt.respondWith(getFromCacheOrFetchAndCache());
        } else {
            // return nothing to process fetch request natively (by browser)
        }
    }
}

// setup event handlers in service worker scope
self.addEventListener('install', hndlEventInstall);
self.addEventListener('activate', hndlEventActivate);
self.addEventListener('fetch', hndlEventFetch);
