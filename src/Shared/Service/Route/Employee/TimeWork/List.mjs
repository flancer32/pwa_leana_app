/**
 * Request and response for 'employee/timeWork/list' service.
 */
class Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request {
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

class Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response {
    /** @type {Array.<Fl32_Leana_Shared_Service_Data_Employee_TimeWork>} */
    items
}

export {
    Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request as Request,
    Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response as Response,
};
