/**
 * Service to get all working time data for employees.
 */
export default class Fl32_Leana_Back_Service_Employee_TimeWork_List {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
        const eTimeWork = spec.Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$;
        const TimeWork = spec['Fl32_Leana_Shared_Service_Data_Employee_TimeWork#'];
        const Request = spec['Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List#Request'];
        const Response = spec['Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List#Response'];

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * API route handler to get booking state.
         *
         * @param req
         * @param res
         * @returns {Promise<void>}
         * @see TeqFw_Core_App_Server.addApiRoute
         */
        this.handle = async function (req, res) {
            // PARSE INPUT & DEFINE WORKING VARS

            // DEFINE INNER FUNCTIONS (AVAILABLE FOR CURRENT INSTANCE ONLY)
            /**
             * Get working time for employees.
             * @param trx
             * @param {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} dataIn
             * @return {Promise<Array.<Fl32_Leana_Shared_Service_Data_Employee_TimeWork>>}
             */
            async function selectData(trx, dataIn) {
                // DEFINE INNER FUNCTIONS


                // MAIN FUNCTIONALITY
                const result = [];
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
                    result.push(item);
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const body = req.body;
            /** @type {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} */
            const dataIn = Object.assign(new Request(), body.data);
            if (dataIn.dateBegin) dataIn.dateBegin = new Date(dataIn.dateBegin);
            if (dataIn.dateEnd) dataIn.dateEnd = new Date(dataIn.dateEnd);
            const trx = await rdb.startTransaction();
            try {
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response} */
                const dataOut = new Response();
                dataOut.items = await selectData(trx, dataIn);
                trx.commit();
                // COMPOSE SUCCESS RESPONSE
                res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                res.end(JSON.stringify({data: dataOut}));
            } catch (error) {
                trx.rollback();
                // COMPOSE FAILURE RESPONSE
                console.error(error);
                res.setHeader('Content-Type', 'application/json');
                res.code = 500;
                res.end(JSON.stringify({error}));
            }
        };
    }
}
