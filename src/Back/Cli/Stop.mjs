/**
 * CLI action to stop web server.
 */
import $path from 'path';
import $fs from 'fs';

// MODULE'S EXPORT
export default class Fl32_Leana_Back_Cli_Stop {
    // these 4 props are used in the base class 'Fl32_Leana_App_Cli_Command'
    action
    description = 'Stop web server.'
    name = 'stop'
    namespace = ''

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE (PROPS AND VARS IN THE CLOSURE OF THE CONSTRUCTOR)
        /** @type {Fl32_Leana_App_Defaults} */
        const _defaults = spec.Fl32_Leana_App_Defaults$;
        /** @type {Fl32_Leana_App_Logger} */
        const _logger = spec.Fl32_Leana_App_Logger$;
        /** @type {Fl32_Leana_App_Config} */
        const _config = spec.Fl32_Leana_App_Config$;
        /** @type {Fl32_Leana_App_Obj_Factory} */
        const objFactory = spec.Fl32_Leana_App_Obj_Factory$;
        /** @type {Fl32_Leana_App_Cli_Command} */
        const base = spec.Fl32_Leana_App_Cli_Command$;

        // POPULATE CURRENT INSTANCE WITH BASE CLASSES METHODS (COMPOSITION INSTEAD OF INHERITANCE)
        objFactory.assignPrototypeMethods(this, base);

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)
        this.action = async function () {
            try {
                const pathRoot = _config.get('path/root');
                const pidPath = $path.join(pathRoot, _defaults.PID_FILE_NAME);
                const data = $fs.readFileSync(pidPath);
                const strData = data.toString();
                _logger.info(`Stop web server (PID: ${strData}).`);
                process.kill(strData, 'SIGINT');
            } catch (e) {
                _logger.error('Cannot kill API server process.');
            }
        };
    }
}
