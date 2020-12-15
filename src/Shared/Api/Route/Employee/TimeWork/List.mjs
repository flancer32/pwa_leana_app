/**
 * Request and response for 'employee/time_work/list' service.
 */
class Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Request {
    /**
     * Employee ID to get working time for. If missed - working time for all employees will be selected.
     * @type {Number}
     */
    employeeRef
    /**
     * UTC date for beginning of the period to select.
     * @type {Date}
     */
    dateBegin
    /**
     * UTC date for end of the period to select.
     * @type {Date}
     */
    dateEnd
}

class Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Response {
    /** @type {Object.<number, Fl32_Leana_Shared_Api_Data_Employee_Time_Work>} */
    items
}

export {
    Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Request as Request,
    Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Response as Response,
};
