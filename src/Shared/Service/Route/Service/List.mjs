/**
 * Request and response for 'service/list' service.
 */
class Fl32_Leana_Shared_Service_Route_Service_List_Request {
    /** @type {String} 'es-ES' */
    locale
    /** @type {Boolean} */
    publicOnly
}

class Fl32_Leana_Shared_Service_Route_Service_List_Response {
    /** @type {Object.<number, Fl32_Leana_Shared_Service_Data_Service>} */
    items
}

export {
    Fl32_Leana_Shared_Service_Route_Service_List_Request as Request,
    Fl32_Leana_Shared_Service_Route_Service_List_Response as Response,
};
