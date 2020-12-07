/**
 * Get frontend configuration.
 */
// MODULE'S EXPORT
export default class Fl32_Leana_Back_Route_App_Config_Get {
    /** @type {Fl32_Leana_App_Config} */
    _config

    constructor(spec) {
        this._config = spec.Fl32_Leana_App_Config$;
        const me = this;

        this.handle = function (req, res) {
            const config = {};
            config.web = me._config.get('/local/web');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({response: {config}}));
        };
    }
}
