/**
 * Request and response for 'remove task' operation.
 */
class Fl32_Leana_Shared_Service_Route_Task_Remove_Request {
    taskId
}

class Fl32_Leana_Shared_Service_Route_Task_Remove_Response {
    /** @type {boolean} */
    removed
}

export {
    Fl32_Leana_Shared_Service_Route_Task_Remove_Request as Request,
    Fl32_Leana_Shared_Service_Route_Task_Remove_Response as Response,
};
