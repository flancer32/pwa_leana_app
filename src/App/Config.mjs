import $fs from 'fs';
import $path from 'path';

/**
 * TODO:
 *  - add ACL to configuration (is it possible? we should prevent access to certain configuration nodes for some modules)
 */
export default class Fl32_Leana_App_Config {
    /** @type {null|Object} storage for configuration options */
    _store = null

    /**
     * Place given configuration into internal storage and replace old values if exist.
     *
     * @param {Object} cfg
     */
    init(cfg) {
        this._store = cfg;
    }

    /**
     * Load local configuration and init internal storage.
     *
     * @param {string} rootPath absolute path to application root folder ('/home/alex/work/pwa/')
     * @param {string} cfgPath path to local configuration JSON (by default: './cfg/local.json')
     */
    load({rootPath, cfgPath = './cfg/local.json'}) {
        const pathToLocalCfg = $path.join(rootPath, cfgPath);
        const data = $fs.readFileSync(pathToLocalCfg);
        const local = JSON.parse(data.toString());
        // save local configuration to 'local' node
        const json = {local};
        // add path to app root folder
        json.path = {root: rootPath};
        this.init(json);
    }

    /**
     * Get configuration value by path (`path/to/the/node`).
     *
     * @param {string} cfgPath - Path to the node of the configuration tree (`path/to/the/node`).
     * @return {null|string|boolean|number|Object} - Configuration value.
     */
    get(cfgPath) {
        let result = this._store;
        if (typeof cfgPath === 'string') {
            const parts = cfgPath.split('/');
            for (const one of parts) {
                if (one) {
                    if (result[one]) {
                        result = result[one];
                    } else {
                        result = null;
                        break;
                    }
                }
            }
            // We can analyze stack trace and apply ACL rules to caller
            // const stack = new Error().stack;
        }
        return result;
    }

    /**
     * Set configuration value by path (`path/to/the/node`).
     *
     * @param {string} cfgPath - Path to the node of the configuration tree (`path/to/the/node`).
     * @param {string|boolean|number|Object} data - Value to save into configuration tree.
     */
    set(cfgPath, data) {
        const parts = cfgPath.split('/');
        let current = this._store;
        let ndx = 1;
        for (const one of parts) {
            if (one) {
                if (!current[one]) {
                    current[one] = {};
                }
                if (ndx < parts.length) {
                    current = current[one];
                } else {
                    current[one] = data;
                }
            }
            ndx += 1;
        }
    }
}
