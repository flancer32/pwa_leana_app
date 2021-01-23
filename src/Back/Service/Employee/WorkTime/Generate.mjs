/**
 * Service to generate working time schedule for one week forward  ("/api/employee/workTime/generate").
 */
export default class Fl32_Leana_Back_Service_Employee_WorkTime_Generate {

    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF_USER = spec['Fl32_Teq_User_Defaults$'];  // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Leana_Back_Process_WorkTime_Generate} */
        const proc = spec['Fl32_Leana_Back_Process_WorkTime_Generate$'];    // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate#Request']; // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate#Response'];   // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return DEF.API_ROUTE_EMPL_WTIME_GENERATE;
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate_Request}
             * @exports Fl32_Leana_Back_Service_Employee_WorkTime_Generate$parse
             */
            function Fl32_Leana_Back_Service_Employee_WorkTime_Generate$parse(httpReq) {
                const body = httpReq.body;
                return Object.assign(new Request(), body.data); // clone HTTP body into API request object
            }

            return Fl32_Leana_Back_Service_Employee_WorkTime_Generate$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {

            /**
             * @param {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate_Response>}
             * @exports Fl32_Leana_Back_Service_Employee_WorkTime_Generate$process
             */
            async function Fl32_Leana_Back_Service_Employee_WorkTime_Generate$process(apiReq, httpReq, httpRes) {
                // DEFINE INNER FUNCTIONS (AVAILABLE FOR CURRENT INSTANCE ONLY)

                /**
                 * Return 'true' if user is authenticated and has required permission.
                 * @param httpReq
                 * @param {String} perm
                 * @return {boolean}
                 */
                function hasPermissions(httpReq, perm) {
                    let result = false;
                    /** @type {Fl32_Teq_Acl_Shared_Service_Data_UserAcl} */
                    const user = httpReq[DEF_USER.HTTP_REQ_USER];
                    if (user && user.permissions) {
                        const perms = Object.values(user.permissions);
                        if (Array.isArray(perms) && perms.includes(perm)) {
                            result = true;
                        }
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate_Response} */
                const result = new Response();
                if (hasPermissions(httpReq, DEF.ACL_IS_EMPLOYEE)) {
                    const trx = await rdb.startTransaction();
                    try {
                        result.totalInserted = await proc.exec({trx});
                        await trx.commit();
                    } catch (error) {
                        await trx.rollback();
                        throw error;
                    }
                } else {
                    // HTTP 401
                    httpRes.status(401);
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Employee_WorkTime_Generate$process;
        };
    }
}
