/**
 * Compose list of static files to cache on 'install' event in service worker for '/desk/' realm.
 */
import $fs from 'fs';
import $path from 'path';

/* see https://stackoverflow.com/a/47492545/4073821 */
/**
 * Module level function to get list of files from directory and all subdirectories.
 *
 * @param {string} path
 * @return {Array.<string>}
 */
function getFilesRecursively(path) {
    /* internal functions */
    const isDirectory = path =>
        $fs.statSync(path).isDirectory();
    const getDirectories = path =>
        $fs.readdirSync(path).map(name => $path.join(path, name)).filter(isDirectory);
    const isFile = path =>
        $fs.statSync(path).isFile();
    const getFiles = path =>
        $fs.readdirSync(path).map(name => $path.join(path, name)).filter(isFile);

    /* main body */
    const dirs = getDirectories(path);
    const files = dirs
        .map(dir => getFilesRecursively(dir))  // go through each directory
        .reduce((a, b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
    return files.concat(getFiles(path));
}

/* end of SO */

export default class Fl32_Leana_Back_Route_App_Sw_FilesToCache_Desk {

    constructor(spec) {
        // dependencies
        const config = spec.Fl32_Leana_App_Config$;

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
            function scanOneFolder(path, replacement) {
                const files = getFilesRecursively(path);
                return files.map(item => item.replace(path, replacement));
            }

            // define paths to scan
            const pathWeb = $path.join(pathRoot, 'web/desk');
            const pathSrcRealm = $path.join(pathRoot, 'src/Realm/Desk');
            const pathSrcRealmShared = $path.join(pathRoot, 'src/Realm/Shared');
            const pathSrcShared = $path.join(pathRoot, 'src/Shared');

            // scan paths and compose one array with URLs to cache
            const urlWeb = scanOneFolder(pathWeb, '.');
            const urlSrcRealm = scanOneFolder(pathSrcRealm, './src/leana/Realm/Desk');
            const urlSrcRealmShared = scanOneFolder(pathSrcRealmShared, './src/leana/Realm/Shared');
            const urlSrcShared = scanOneFolder(pathSrcShared, './src/leana/Shared');
            const urls = [].concat(urlWeb, urlSrcRealm, urlSrcRealmShared, urlSrcShared);

            // manually add files from the root & parent
            urls.push('.');
            urls.push('..');
            urls.push('../favicon.ico');
            urls.push('../index.html');
            res.end(JSON.stringify({urls}));
        };
    }
}
