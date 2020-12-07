/**
 * Transport to print out logs to console.
 */
export default class Fl32_Leana_App_Logger_Transport_Console {
    /**
     * Process all log entries.
     *
     * @param logs
     */
    process(logs) {
        for (const one of logs) {
            console.log(JSON.stringify(one));
        }
    }
}
