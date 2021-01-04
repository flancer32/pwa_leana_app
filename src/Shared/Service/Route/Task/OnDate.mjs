/**
 * Request and response for 'task/on_date' service.
 */
class Fl32_Leana_Shared_Service_Route_Task_OnDate_Request {
    /** @type {Date}  */
    date
}

class Fl32_Leana_Shared_Service_Route_Task_OnDate_Response {
    /** @type {Object.<number, Fl32_Leana_Shared_Service_Data_Task>} */
    items
}

export {
    Fl32_Leana_Shared_Service_Route_Task_OnDate_Request as Request,
    Fl32_Leana_Shared_Service_Route_Task_OnDate_Response as Response,
};
