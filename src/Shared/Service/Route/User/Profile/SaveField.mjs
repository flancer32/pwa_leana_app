/**
 * Request and response for "Save one field of user profile" service.
 */
class Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Request {
    static TYPE_EMAIL = 'email';
    static TYPE_LOGIN = 'login';
    static TYPE_NAME = 'name';
    static TYPE_PHONE = 'phone';
    /**
     * Type for value to be checked (see static 'TYPE_...' props for available types).
     * @type {String}
     */
    type;
    /**
     * Value to be checked for existence.
     * @type {String}
     */
    value;
}

class Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Response {
    /** @type {Boolean} */
    success;
}

export {
    Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Request as Request,
    Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Response as Response,
};
