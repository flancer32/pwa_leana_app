/**
 * Initialize development environment to run dev tests.
 */
import $path from 'path';
import $url from 'url';
import Container from '@teqfw/di';

/* Resolve paths to main folders */
const {path: currentScript} = $url.parse(import.meta.url);
const pathScript = $path.dirname(currentScript);
const pathRoot = $path.join(pathScript, '..');
const pathSrc = $path.join(pathRoot, 'src');

/* Create and setup DI container (once per all imports) */

/** @type {TeqFw_Di_Container} */
const container = new Container();
// add backend sources to map
container.addSourceMapping('Fl32_Leana', pathSrc, true, 'mjs');

/**
 * Setup development environment (if not set before) and return DI container.
 *
 * @returns {Promise<TeqFw_Di_Container>}
 */
export default async function init() {
    /** @type {Fl32_Leana_App_Config} */
    const config = await container.get('Fl32_Leana_App_Config$');
    if (!config.get()) {
        // load local configuration if has not been loaded before
        config.load({rootPath: pathRoot});
        /** @type {Fl32_Leana_App_Logger} */
        const logger = await container.get('Fl32_Leana_App_Logger$');
        /** @type {Fl32_Leana_App_Logger_Transport_Console} */
        const logTransport = await container.get('Fl32_Leana_App_Logger_Transport_Console$');
        logger.addTransport(logTransport);
    }
    return container;
}
