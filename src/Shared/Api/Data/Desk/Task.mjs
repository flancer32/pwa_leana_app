/**
 * Task data for dashboard.
 */
export default class Fl32_Leana_Shared_Api_Data_Desk_Task {
    /**
     * Internal id.
     *
     * @type {number}
     */
    id
    /**
     * Created date for the task.
     *
     * @type {Date}
     */
    dateCreated
    /**
     * Reference to related employee.
     *
     * @type {number}
     */
    employeeRef
    /**
     * Reference to related service.
     *
     * @type {number}
     */
    serviceRef
    /**
     * @type {string} YYYYMMDD
     */
    bookedDate
    /**
     * Beginning time of the booked interval (inclusive).
     * @type {string} HHMM
     */
    bookedBegin
    /**
     * Ending time of the booked interval (exclusive).
     * @type {string} YYYYMMDD
     */
    bookedEnd
    /** @type {String} */
    customerEmail
    /** @type {String} */
    customerName
    /** @type {String} */
    customerPhone
    /** @type {String} */
    note
    /** @type {String} */
    lang
}
