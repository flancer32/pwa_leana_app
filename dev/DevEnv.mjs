/**
 * Initialize development environment to run dev tests.
 */
import $path from 'path';
import $url from 'url';
import Container from '@teqfw/di';

/* Resolve paths to main folders */
const {path: currentScript} = $url.parse(import.meta.url);
const pathScript = $path.dirname(currentScript);
const pathMod = $path.join(pathScript, '..');
const pathPrj = $path.join(pathScript, '../../../../');
const pathNode = $path.join(pathPrj, 'node_modules');
const srcMod = $path.join(pathMod, 'src');
const srcTeqFwCore = $path.join(pathNode, '@teqfw/core-app/src');
const srcTeqFwDi = $path.join(pathNode, '@teqfw/di/src');
/* Create and setup DI container (once per all imports) */

/** @type {TeqFw_Di_Container} */
const container = new Container();
// add backend sources to map
container.addSourceMapping('Fl32_Leana', srcMod, true, 'mjs');
container.addSourceMapping('TeqFw_Core_App', srcTeqFwCore, true, 'mjs');
container.addSourceMapping('TeqFw_Di', srcTeqFwDi, true, 'mjs');

/**
 * Setup development environment (if not set before) and return DI container.
 *
 * @returns {Promise<TeqFw_Di_Container>}
 */
export default async function init() {
    // DEFINE INNER FUNCTIONS

    async function initDb(container) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = await container.get('TeqFw_Core_App_Db_Connector$');  // singleton instance
        await rdb.init();
    }

    async function initLogger(container) {
        /** @type {TeqFw_Core_App_Logger} */
        const logger = await container.get('TeqFw_Core_App_Logger$');
        /** @type {TeqFw_Core_App_Logger_Transport_Console} */
        const logTransport = await container.get('TeqFw_Core_App_Logger_Transport_Console$');
        logger.addTransport(logTransport);
    }

    // MAIN FUNCTIONALITY
    /** @type {TeqFw_Core_App_Config} */
    const config = await container.get('TeqFw_Core_App_Config$');
    if (!config.get()) {
        // load local configuration if has not been loaded before
        config.load({rootPath: pathPrj});
        await initLogger(container);
        await initDb(container);
    }
    return container;
}
