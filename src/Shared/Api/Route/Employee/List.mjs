/**
 * Request and response for 'employee/list' service.
 */
class Fl32_Leana_Shared_Api_Route_Employee_List_Request {
    /** @type {String} 'es_ES' */
    locale
}

class Fl32_Leana_Shared_Api_Route_Employee_List_Response {
    /** @type {Object.<number, Fl32_Leana_Shared_Api_Data_Employee>} */
    items
}

export {
    Fl32_Leana_Shared_Api_Route_Employee_List_Request as Request,
    Fl32_Leana_Shared_Api_Route_Employee_List_Response as Response,
};
