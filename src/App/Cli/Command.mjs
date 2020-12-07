/**
 * Base class for application commands.
 */

// MODULE'S EXPORT
export default class Fl32_Leana_App_Cli_Command {

    getCommandData() {
        return {
            ns: this.namespace || '',
            name: this.name || 'unknown',
            desc: this.description || '',
            action: this.action || function () {
            }
        };
    }
}
