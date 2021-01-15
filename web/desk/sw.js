/**
 * Service worker for 'desk' frontend realm.
 *
 * @type {ServiceWorkerGlobalScope} self
 */
'use strict';

const API_STATIC_FILES = '/api/app/sw/files_to_cache/desk'; // route to get list of files to cache on startup
const AREA_API = 'api';            // marker for API routes (don't cache)
const AREA_STATIC = 'static';      // marker for static resources (to be cached)
const AREA_WORKER = 'sw';          // marker for Service Worker commands
const CACHE_STATIC = 'desk-cache-v1'; // store name to cache static resources
const ROUTE_CACHE_CLEAN = `/${AREA_WORKER}/cache/clean`;   // SW control route to enable SW cache
const ROUTE_CACHE_DISABLE = `/${AREA_WORKER}/cache/disable`;   // SW control route to enable SW cache
const ROUTE_CACHE_ENABLE = `/${AREA_WORKER}/cache/enable`;   // SW control route to enable SW cache
const ROUTE_CACHE_STATE = `/${AREA_WORKER}/cache/state`;   // SW control route to get cache state
const VERSION = '0.1.0';    // SW version to trace app consistency on the client side
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
            return AREA_API;
        } else if (req.url.match(SW)) {
            return AREA_WORKER;
        }
        return AREA_STATIC;
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
            const data = {};
            if (url.includes(ROUTE_CACHE_CLEAN)) {
                await self.caches.delete(CACHE_STATIC);
                _cacheEnabled = true;
                data.message = 'Cache is cleaned and enabled.';
                data.success = true;
            } else if (url.includes(ROUTE_CACHE_DISABLE)) {
                _cacheEnabled = false;
                data.message = 'Cache is disabled.';
                data.success = true;
            } else if (url.includes(ROUTE_CACHE_ENABLE)) {
                _cacheEnabled = true;
                data.message = 'Cache is enabled.';
                data.success = true;
            } else if (url.includes(ROUTE_CACHE_STATE)) {
                const state = (_cacheEnabled) ? 'enabled' : 'disabled';
                data.message = `Cache state: ${state}`;
                data.state = _cacheEnabled;
            } else {
                data.message = 'Unknown command.';
            }
            return new Response(JSON.stringify(data), {
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
    if (routeType === AREA_API) {
        // just pass the request to server
    } else if (routeType === AREA_WORKER) {
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
