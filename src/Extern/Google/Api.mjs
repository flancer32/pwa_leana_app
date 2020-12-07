/**
 * Module description.
 */
// NODE.JS IMPORTS
import $googleapis from 'googleapis';


// MODULE'S PRIVATE MEMBERS
// Google API authorization scopes
const SCOPE_CALENDAR = 'https://www.googleapis.com/auth/calendar';
const SCOPE_EVENTS = 'https://www.googleapis.com/auth/calendar.events';
const google = $googleapis.google;
/**
 * Google API authorization.
 *
 * @param {string} email
 * @param {string} key
 * @returns {Promise<JWT>}
 */
async function $authorize(email, key) {
    const jwt = new google.auth.JWT(email, null, key, [SCOPE_CALENDAR, SCOPE_EVENTS]);
    await jwt.authorize();
    return jwt;
}

export default class Fl32_Leana_Extern_Google_Api {
    /** @type {Fl32_Leana_App_Logger} */
    _logger
    _calendar

    /**  @param {Object} spec */
    constructor(spec) {
        this._config = spec.Fl32_Leana_App_Config$;
        this._calendar = google.calendar('v3');
    }


    /**
     * Create new event in Google Calendar.
     *
     * @param {string} summary
     * @param {string} description
     * @param {Date} start
     * @param {Date} end
     * @returns {Promise<{}>}
     */
    async addEvent({summary, description, start, end}) {
        const api = this._config.get('local/service/google/api');
        const {email, key} = api.access;
        const auth = await $authorize(email, key);
        const event = {
            summary,
            description,
            start: {
                'dateTime': start.toJSON()
            },
            end: {
                'dateTime': end.toJSON()
            }
        };
        const res = await this._calendar.events.insert({
            auth: auth,
            calendarId: api.calendarId,
            resource: event,
        });
        if (res.status && res.status === 200) {
            // this._logger.debug('');
        } else {
            // this._logger.error('Cannot add new event: ' + JSON.stringify(res));
        }
    }
}
