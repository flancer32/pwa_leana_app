/**
 * Task common data for dashboard widgets.
 */
export default class Fl32_Leana_Realm_Desk_Widget_Api_Task {
    /**
     * Task id (from backend).
     * @type {number}
     */
    id
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
    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Employee} */
    employee
    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Service} */
    service
    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Customer} */
    customer
    /** @type {String} */
    note
    /** @type {String} */
    lang
}
