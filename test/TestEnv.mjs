/**
 * Initialize test environment to run unit tests.
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
 * Setup test environment (if not set before) and return DI container.
 *
 * @returns {Promise<TeqFw_Di_Container>}
 */
export default async function init() {
    return container;
}
