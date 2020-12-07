/**
 * Request to save task details.
 */
export default class Fl32_Leana_Shared_Api_Route_Book_Save_Request {
    /** @type {Date} date-time of the appointment's beginning */
    date
    /** @type {number} appointment duration in minutes */
    duration
    /** @type {string} customer email */
    email
    /** @type {Number|null} */
    id
    /** @type {string} language code (lv_LV, ru_RU, ...) */
    lang
    /** @type {number} */
    masterId
    /** @type {string} customer name */
    name
    /** @type {String} */
    note
    /** @type {string} customer phone */
    phone
    /** @type {number} */
    serviceId
}
