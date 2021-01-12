/**
 * Application itself.
 */
// NODE.JS IMPORTS
import $commander from 'commander';
import $path from 'path';

/**
 * Define data structure.
 *
 * @typedef {Object} Fl32_Leana_App.Bootstrap
 * @property {string} root absolute path to the root folder of the project (`/.../pwa_leana`)
 * @property {string} version current version of the application (`0.1.0`)
 */

// MODULE'S EXPORT
export default class Fl32_Leana_App {
    /** @type {Fl32_Leana_App.Bootstrap} */
    _bootCfg
    /** @type {Command} */
    _commander
    /** @type {TeqFw_Di_Container} */
    _container
    /** @type {TeqFw_Core_App_Config} */
    _config
    /** @type {TeqFw_Core_App_Db_Connector} */
    _db
    /** @type {TeqFw_Core_App_Logger} */
    _logger

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE
        this._bootCfg = spec.bootstrap;   // use bootstrap configuration manually defined in '../bin/tequila.js'
        this._container = spec.container; // use DI container manually defined in 'TeqFw_Di_Container'
        this._config = spec.TeqFw_Core_App_Config$;
        this._db = spec.TeqFw_Core_App_Db_Connector$;
        this._logger = spec.TeqFw_Core_App_Logger$;     // singleton
        const logTransport = spec.TeqFw_Core_App_Logger_Transport_Console$; // singleton
        // INIT OWN PROPERTIES AND DEFINE WORKING VARS
        this._logger.addTransport(logTransport);
        this._commander = new $commander.Command();
    }

    /**
     * Add single command to the app's commander.
     *
     * @param {string} className 'Vendor_Module_Fw_Cli_Command_Name'
     * @returns {Promise<void>}
     */
    async addCommand(className) {
        /** @type {TeqFw_Core_App_Cli_Command} */
        const cmd = await this._container.get(className);
        const {ns, name, desc, action} = cmd.getCommandData();
        const fullName = (ns) ? `${ns}-${name}` : name;
        this._commander.command(fullName)
            .description(desc)
            .action(action);
    }

    async init() {
        // PARSE INPUT & DEFINE WORKING VARS
        const me = this;

        // DEFINE INNER FUNCTIONS
        async function addCliActions() {
            await me.addCommand('Fl32_Leana_Back_Cli_Db_Schema_Upgrade$');
            await me.addCommand('Fl32_Leana_Back_Cli_Start$');
            await me.addCommand('Fl32_Leana_Back_Cli_Stop$');
        }

        function setupDiContainer() {
            const pathRoot = me._config.get('path/root');
            const pathNode = $path.join(pathRoot, 'node_modules');
            const teqAclPath = $path.join(pathNode, '@flancer32/teq_acl/src');
            const teqUserPath = $path.join(pathNode, '@flancer32/teq_user/src');
            me._container.addSourceMapping('Fl32_Teq_Acl', teqAclPath, true);
            me._container.addSourceMapping('Fl32_Teq_User', teqUserPath, true);
        }

        // MAIN FUNCTIONALITY
        this._config.load({rootPath: this._bootCfg.root});
        setupDiContainer();
        await this._db.init();
        await addCliActions();
    }

    async run() {
        this._commander.parse(process.argv);
        // print out help and stop by default
        if (!process.argv.slice(2).length) {
            this._commander.outputHelp();
            await this.stop();
        }
    }

    async stop() {
        console.log('Stopping...');
    }
}
