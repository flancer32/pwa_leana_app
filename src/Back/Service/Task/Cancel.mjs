/**
 * Remove single task ("/api/task/cancel").
 */
export default class Fl32_Leana_Back_Service_Task_Cancel {

    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF_USER = spec['Fl32_Teq_User_Defaults$'];  // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Leana_Back_Process_Task_Cancel} */
        const procCancel = spec['Fl32_Leana_Back_Process_Task_Cancel$'];    // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Cancel_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Task_Cancel#Request']; // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Cancel_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Task_Cancel#Response'];   // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return DEF.API_ROUTE_TASK_CANCEL;
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Task_Cancel_Request}
             * @exports Fl32_Leana_Back_Service_Task_Cancel$parse
             */
            function Fl32_Leana_Back_Service_Task_Cancel$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                const result = Object.assign(new Request(), body.data);
                if (result.date) result.date = new Date(result.date);
                return result;
            }

            return Fl32_Leana_Back_Service_Task_Cancel$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Leana_Shared_Service_Route_Task_Cancel_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_Cancel_Response>}
             * @exports Fl32_Leana_Back_Service_Task_Cancel$process
             */
            async function Fl32_Leana_Back_Service_Task_Cancel$process(apiReq, httpReq) {
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

                /** @type {Fl32_Leana_Shared_Service_Route_Task_Cancel_Response} */
                const result = new Response();
                if (hasPermissions(httpReq, DEF.ACL_IS_EMPLOYEE)) {
                    const trx = await rdb.startTransaction();
                    try {
                        const {removed} = await procCancel.exec({trx, taskId: apiReq.taskId});
                        result.removed = (removed >= 1);
                        trx.commit();
                    } catch (error) {
                        trx.rollback();
                        throw error;
                    }
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Task_Cancel$process;
        };
    }
}
