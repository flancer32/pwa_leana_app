/**
 * Service to get all working time data for employees  ("/api/employee/timeWork/list").
 */
export default class Fl32_Leana_Back_Service_Employee_TimeWork_List {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];  // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
        const eTimeWork = spec['Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$']; // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Data_Employee_TimeWork} */
        const TimeWork = spec['Fl32_Leana_Shared_Service_Data_Employee_TimeWork#']; // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List#Request']; // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List#Response'];   // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return 'employee/timeWork/list';
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.getParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request}
             * @exports Fl32_Leana_Back_Service_Employee_TimeWork_List$parse
             */
            function Fl32_Leana_Back_Service_Employee_TimeWork_List$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                const result = Object.assign(new Request(), body.data);
                if (result.dateBegin) result.dateBegin = new Date(result.dateBegin);
                if (result.dateEnd) result.dateEnd = new Date(result.dateEnd);
                return result;
            }

            return Fl32_Leana_Back_Service_Employee_TimeWork_List$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.getProcessor = function () {

            /**
             * @param {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} apiReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response>}
             * @exports Fl32_Leana_Back_Service_Employee_TimeWork_List$process
             */
            async function Fl32_Leana_Back_Service_Employee_TimeWork_List$process(apiReq) {
                // DEFINE INNER FUNCTIONS (AVAILABLE FOR CURRENT INSTANCE ONLY)
                /**
                 * Get working time for employees.
                 * @param trx
                 * @param {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} dataIn
                 * @return {Promise<Object.<number, Fl32_Leana_Shared_Service_Data_Employee_TimeWork>>}
                 */
                async function selectData(trx, dataIn) {
                    const result = {};
                    // main select
                    const query = trx.select();
                    query.from(eTimeWork.ENTITY);
                    // add filters
                    if (typeof dataIn.employeeRef === 'number') {
                        query.where(eTimeWork.A_EMPLOYEE_REF, dataIn.employeeRef);
                    }
                    if (dataIn.dateBegin instanceof Date) {
                        const date = utilDate.stampDateUtc(dataIn.dateBegin);
                        query.where(eTimeWork.A_DATE, '>=', date);
                    }
                    if (dataIn.dateEnd instanceof Date) {
                        const date = utilDate.stampDateUtc(dataIn.dateEnd);
                        query.where(eTimeWork.A_DATE, '<=', date);
                    }
                    // perform query and get data
                    const rs = await query;
                    for (const one of rs) {
                        /** @type {Fl32_Leana_Shared_Service_Data_Employee_TimeWork} */
                        const item = new TimeWork();
                        item.employeeRef = one[eTimeWork.A_EMPLOYEE_REF];
                        const ds = one[eTimeWork.A_DATE];
                        const tsFrom = one[eTimeWork.A_FROM];
                        const tsTo = one[eTimeWork.A_TO];
                        // let from-to times are in one day bounds
                        const minFrom = utilDate.convertDbHrsMinsToMins(tsFrom);
                        const minTo = utilDate.convertDbHrsMinsToMins(tsTo);
                        item.duration = minTo - minFrom;
                        item.start = utilDate.unformatDate(ds, tsFrom);
                        result[item.employeeRef] = item;
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    result.items = await selectData(trx, apiReq);
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Employee_TimeWork_List$process;
        };
    }
}
