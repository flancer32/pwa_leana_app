import $path from 'path';

/**
 * Compose list of static files to cache on 'install' event in service worker for '/pub/' realm.
 */
export default class Fl32_Leana_Back_Service_App_Sw_FilesToCache_Pub {

    constructor(spec) {
        // dependencies
        const config = spec.TeqFw_Core_App_Config$;
        const scan = spec['TeqFw_Core_App_Util_Back_Scan#FilesRecursively'];

        // instance's internal vars
        const pathRoot = config.get('/path/root');

        this.handle = async function (req, res) {
            /**
             * Map files from one folder recursively.
             *
             * @param {string} path
             * @param {string} replacement
             * @return {Array.<string>}
             */
            function scanFolder(path, replacement) {
                const files = scan(path);
                return files.map(item => item.replace(path, replacement));
            }

            // define paths to scan
            const pathWeb = $path.join(pathRoot, 'node_modules/@flancer32/pwa_leana_app/web/pub');
            const pathSrcFront = $path.join(pathRoot, 'node_modules/@flancer32/pwa_leana_app/src/Front/Pub');
            const pathSrcFrontShared = $path.join(pathRoot, 'node_modules/@flancer32/pwa_leana_app/src/Front/Shared');
            const pathSrcShared = $path.join(pathRoot, 'node_modules/@flancer32/pwa_leana_app/src/Shared');

            // scan paths and compose one array with URLs to cache
            const urlWeb = scanFolder(pathWeb, '.');
            const urlSrcFront = scanFolder(pathSrcFront, './src/app/Front/Pub');
            const urlSrcFrontShared = scanFolder(pathSrcFrontShared, './src/app/Front/Shared');
            const urlSrcShared = scanFolder(pathSrcShared, './src/app/Shared');
            const urls = [].concat(urlWeb, urlSrcFront, urlSrcFrontShared, urlSrcShared);

            // manually add files from the root & parent
            urls.push('.');
            urls.push('..');
            urls.push('../favicon.ico');
            urls.push('../index.html');
            res.end(JSON.stringify({urls}));
        };
    }
}
