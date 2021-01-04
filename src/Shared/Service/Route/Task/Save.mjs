/**
 * Request and response for 'task/save' service.
 */
class Fl32_Leana_Shared_Service_Route_Task_Save_Request {
    /** @type {Date} date-time of the appointment's beginning */
    date
    /** @type {Number} appointment duration in minutes */
    duration
    /** @type {String} customer email */
    email
    /** @type {Number|null} */
    id
    /** @type {String} language code (lv-LV, ru-RU, ...) */
    locale
    /** @type {Boolean} */
    madeOnFront
    /** @type {Number} */
    employeeId
    /** @type {String} customer name */
    name
    /** @type {String} */
    note
    /** @type {String} customer phone */
    phone
    /** @type {Number} */
    serviceId
}

class Fl32_Leana_Shared_Service_Route_Task_Save_Response {
    /** @type {Number} */
    id
}

export {
    Fl32_Leana_Shared_Service_Route_Task_Save_Request as Request,
    Fl32_Leana_Shared_Service_Route_Task_Save_Response as Response,
};
