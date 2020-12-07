/**
 * Handler to process GET requests to static resources in modules.
 */
// NODE.JS IMPORTS
import $fs from 'fs';
import $mimeTypes from 'mime-types';
import $path from 'path';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
});

// MODULE'S EXPORT
export default class Fl32_Leana_App_Server_Route_Static {

    constructor(spec) {
        // dependencies
        const config = spec.Fl32_Leana_App_Config$;
        const pathMap = spec['Fl32_Leana_App_Server_Route_Static_PathMap#'];

        // instance's internal vars
        const pathRoot = config.get('/path/root');
        const pathWeb = $path.join(pathRoot, 'src/web');

        // request handler
        this.handle = async function (req, res, next) {
            /**
             * Compose absolute path to requested resource:
             *  - /node/vue/vue.global.js => /node_modules/vue/dist/vue.global.js
             *  - /favicon.ico => /src/web/favicon.ico
             *
             * @param {string} url
             * @returns {string}
             */
            function getPath(url) {
                let result;
                const mapped = pathMap(url);
                if (url === mapped) {   // URL w/o mapping should be resolved relative to web root
                    result = $path.join(pathWeb, url);
                } else {    // URL w mapping should be resolved relative to project root
                    result = $path.join(pathRoot, mapped);
                }
                return result;
            }

            /**
             * Read and return regular file (HTML, CSS, JS, imgase, ...).
             *
             * @param {string} path
             * @returns {Promise<void>}
             */
            async function processRegular(path) {
                const mimeType = $mimeTypes.lookup(path);
                if (mimeType) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Content-Type', mimeType);
                    res.sendFile(path);
                } else {
                    next();
                }
            }


            /**
             * Read, convert to HTML, sanitize and return CMS block (markdown file).
             *
             * @param {string} path
             * @returns {Promise<void>}
             */
            async function processBlock(path) {
                const md = $fs.readFileSync(path, 'utf-8');
                const dirtyHtml = await marked(md);
                // allow default tags & attrs
                // https://github.com/apostrophecms/sanitize-html#what-if-i-want-to-allow-all-tags-or-all-attributes
                const cleanHtml = sanitizeHtml(dirtyHtml);
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.end(cleanHtml);
            }

            const path = getPath(req.url);
            if ($fs.existsSync(path)) {
                if (req.url.startsWith('/static/mod/leana/block/md/')) {
                    await processBlock(path);
                } else {
                    await processRegular(path);
                }
            } else {
                next();
            }
        };
    }
}
