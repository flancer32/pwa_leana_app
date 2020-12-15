/**
 * Task common data for dashboard widgets.
 */
export default class Fl32_Leana_Front_Desk_Widget_Api_Task {
    /** @type {Fl32_Leana_Front_Desk_Widget_Api_Customer} */
    customer
    /**
     * Scheduled date and time.
     * @type {Date}
     */
    dateBook
    /**
     * Created date.
     * @type {Date}
     */
    dateCreated
    /**
     * Actual duration of the task in minutes.
     * @type {number} 30
     */
    duration
    /** @type {Fl32_Leana_Front_Desk_Widget_Api_Employee} */
    employee
    /**
     * Task id (from backend).
     * @type {number}
     */
    id
    /** @type {String} */
    locale
    /** @type {Boolean} */
    madeOnFront
    /** @type {String} */
    note
    /** @type {Fl32_Leana_Front_Desk_Widget_Api_Service} */
    service
}
