/**
 * Get configuration for frontend.
 *
 * TODO: this service should be moved to framework level (not app level)
 */
// MODULE'S EXPORT
export default class Fl32_Leana_Back_Service_App_Config_Get {
    /** @type {TeqFw_Core_App_Config} */
    #config

    constructor(spec) {
        this.#config = spec.TeqFw_Core_App_Config$; // singleton
        const me = this;

        this.handle = function (req, res) {
            const data = {};
            data.web = me.#config.get('/local/web');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({response: {data}}));
        };
    }
}
