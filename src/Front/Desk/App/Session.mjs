export default class Fl32_Leana_Front_Desk_App_Session {
    constructor(spec) {
        const gate = spec.Fl32_Teq_Acl_Shared_Service_Gate_User_Get$;
        /** @type {typeof Fl32_Teq_Acl_Shared_Service_Route_User_Get_Request} */
        const Request = spec['Fl32_Teq_Acl_Shared_Service_Route_User_Get#Request'];
        /** @type {typeof Fl32_Teq_Acl_Shared_Service_Data_UserAcl} */
        const UserAcl = spec['Fl32_Teq_Acl_Shared_Service_Data_UserAcl#'];

        /** @type {Fl32_Teq_Acl_Shared_Service_Route_User_Get_Response} */
        let userAcl = null;
        let routeToRedirect = null;

        this.init = async function () {
            const req = new Request();
            /** @type {Fl32_Teq_Acl_Shared_Service_Route_User_Get_Response} */
            const res = await gate(req);
            if (res.user) {
                userAcl = Object.assign(new UserAcl(), res);
            }
        };

        this.hasPermission = function (perm) {
            return userAcl.permissions && Object.values(userAcl.permissions).includes(perm);
        };

        this.getRouteToRedirect = function () {
            return routeToRedirect ?? '/';
        };
        this.setRouteToRedirect = function (route) {
            routeToRedirect = route;
        };
    }

}
