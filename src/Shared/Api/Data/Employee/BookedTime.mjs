/**
 * Work time from 'book_detail'.
 */
export default class Fl32_Leana_Shared_Api_Data_Employee_BookedTime {
    /**
     * Reference to the related booking entry.
     * @type {number}
     */
    bookRef
    /**
     * Reference to the employee.
     * Optional if substructure of Employee.
     * @type {number}
     */
    employeeRef
    /**
     * Reference to the related service.
     * @type {number}
     */
    serviceRef
    /**
     * Date as 'YYYYMMDD' string.
     * Optional if substructure of Employee.
     * @type {string}
     */
    date
    /**
     * First available working time  as 'HHMM' string.
     * @type {string}
     */
    from
    /**
     * Last available working time  as 'HHMM' string.
     * @type {string}
     */
    to
}
