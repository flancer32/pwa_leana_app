/**
 * Employee data.
 */
export default class Fl32_Leana_Shared_Api_Data_Employee {
    /**
     * Internal id.
     * @type {number}
     */
    id
    /**
     * Unique code of the employee.
     * @type {string}
     */
    code
    /**
     * IDs of the services available for this employee.
     * @type {Array<number>}
     */
    services
    /**
     * @type {Object.<string, Fl32_Leana_Shared_Api_Data_Employee_WorkTime>}
     */
    workTime
    /**
     * @type {Object.<string, Object.<string, Fl32_Leana_Shared_Api_Data_Employee_BookedTime>>}
     */
    bookedTime
}
