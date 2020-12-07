/**
 * CLI action to start web server.
 */
import $path from 'path';
import $fs from 'fs';

// MODULE'S EXPORT
export default class Fl32_Leana_Back_Cli_Start {
    // these 4 props are used in the base class 'Fl32_Leana_App_Cli_Command'
    action
    description = 'Start web server.'
    name = 'start'
    namespace = ''

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE (PROPS AND VARS IN THE CLOSURE OF THE CONSTRUCTOR)
        /** @type {Fl32_Leana_App_Defaults} */
        const _defaults = spec.Fl32_Leana_App_Defaults$;
        /** @type {Fl32_Leana_App_Logger} */
        const _logger = spec.Fl32_Leana_App_Logger$;
        /** @type {Fl32_Leana_App_Config} */
        const _config = spec.Fl32_Leana_App_Config$;
        /** @type {Fl32_Leana_App_Server} */
        const _server = spec.Fl32_Leana_App_Server$;
        /** @type {Fl32_Leana_App_Obj_Factory} */
        const objFactory = spec.Fl32_Leana_App_Obj_Factory$;
        /** @type {Fl32_Leana_App_Cli_Command} */
        const base = spec.Fl32_Leana_App_Cli_Command$;

        // POPULATE CURRENT INSTANCE WITH BASE CLASSES METHODS (COMPOSITION INSTEAD OF INHERITANCE)
        objFactory.assignPrototypeMethods(this, base);

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)
        this.action = async function () {
            // initialize server
            await _server.init();
            _logger.info('Web server is initialized.');
            // collect startup configuration then compose path to PID file
            const portCfg = _config.get('local/server/port');
            const port = portCfg || _defaults.SERVER_DEFAULT_PORT;
            const pid = process.pid.toString();
            const pathRoot = _config.get('path/root');
            const pidPath = $path.join(pathRoot, _defaults.PID_FILE_NAME);
            // write PID to file then start the server
            try {
                $fs.writeFileSync(pidPath, pid);
                // PID is wrote => start the server
                await _server.listen(
                    port,
                    () => _logger.info(`Web server is listening on port ${port}. PID: ${pid}.`)
                );
            } catch (e) {
                _logger.error('%s', e);
            }
        };
    }
}
