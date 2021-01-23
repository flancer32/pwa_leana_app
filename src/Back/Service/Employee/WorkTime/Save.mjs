/**
 * Service to save work time data  ("/api/employee/workTime/save").
 */
export default class Fl32_Leana_Back_Service_Employee_WorkTime_Save {

    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF_USER = spec['Fl32_Teq_User_Defaults$'];  // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];   // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
        const eWorkTime = spec['Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$'];  // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
        const WorkTime = spec['Fl32_Leana_Shared_Service_Data_Employee_WorkTime#'];  // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save#Request']; // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save#Response'];   // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return DEF.API_ROUTE_EMPL_WTIME_SAVE;
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Request}
             * @exports Fl32_Leana_Back_Service_Employee_WorkTime_Save$parse
             */
            function Fl32_Leana_Back_Service_Employee_WorkTime_Save$parse(httpReq) {
                const body = httpReq.body;
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Request} */
                const result = Object.assign(new Request(), body.data); // clone HTTP body into API request object
                result.item = Object.assign(new WorkTime(), result.item);
                result.item.start = new Date(result.item.start);
                return result;
            }

            return Fl32_Leana_Back_Service_Employee_WorkTime_Save$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {

            /**
             * @param {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Response>}
             * @exports Fl32_Leana_Back_Service_Employee_WorkTime_Save$process
             */
            async function Fl32_Leana_Back_Service_Employee_WorkTime_Save$process(apiReq, httpReq) {
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

                /**
                 * @param trx
                 * @param {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} item
                 * @return {Promise<void>}
                 */
                async function process(trx, item) {
                    // DEFINE INNER FUNCTIONS (AVAILABLE FOR CURRENT INSTANCE ONLY)
                    async function addToDb(trx, emplId, date, from, to) {
                        await trx(eWorkTime.ENTITY)
                            .insert({
                                [eWorkTime.A_EMPLOYEE_REF]: emplId,
                                [eWorkTime.A_DATE]: date,
                                [eWorkTime.A_FROM]: from,
                                [eWorkTime.A_TO]: to,
                            });
                    }

                    /**
                     * @param trx
                     * @param {String} date
                     * @return {Promise<boolean>}
                     */
                    async function found(trx, date) {
                        let result = false;
                        // Get the last work time record
                        const query = trx(eWorkTime.ENTITY)
                            .where(eWorkTime.A_DATE, date);
                        const rs = await query;
                        if (rs[0] && (rs[0][eWorkTime.A_DATE] === date)) result = true;
                        return result;
                    }

                    /**
                     * @param trx
                     * @param {Number} emplId
                     * @param {String} date UTC date stamp (YYYYMMDD)
                     * @param {String} from UTC time for start (HHMM)
                     * @param {String} to UTC time for end (HHMM)
                     * @return {Promise<void>}
                     */
                    async function saveToDb(trx, emplId, date, from, to) {
                        await trx(eWorkTime.ENTITY)
                            .update({
                                [eWorkTime.A_EMPLOYEE_REF]: emplId,
                                [eWorkTime.A_FROM]: from,
                                [eWorkTime.A_TO]: to,
                            })
                            .where({[eWorkTime.A_DATE]: date});
                    }

                    // MAIN FUNCTIONALITY
                    const date = utilDate.stampDateUtc(item.start);
                    const emplId = item.employeeRef;
                    const fromMins = item.start.getUTCHours() * 60;
                    const toMins = fromMins + item.duration;
                    const from = utilDate.convertMinsToDbHrsMins(fromMins);
                    const to = utilDate.convertMinsToDbHrsMins(toMins);
                    if (await found(trx, date)) {
                        await saveToDb(trx, emplId, date, from, to);
                    } else {
                        await addToDb(trx, emplId, date, from, to);
                    }
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Response} */
                const result = new Response();
                if (hasPermissions(httpReq, DEF.ACL_IS_EMPLOYEE)) {
                    const trx = await rdb.startTransaction();
                    try {
                        await process(trx, apiReq.item);
                        await trx.commit();
                    } catch (error) {
                        await trx.rollback();
                        throw error;
                    }
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Employee_WorkTime_Save$process;
        };
    }
}
