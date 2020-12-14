/**
 * Service to get all employees data.
 */
export default class Fl32_Leana_Back_Service_Employee_List {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
        const eEmpl = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Service} */
        const eEmplSrv = spec.Fl32_Leana_Store_RDb_Schema_Employee_Service$;
        const Employee = spec['Fl32_Leana_Shared_Api_Data_New_Employee#'];
        const Request = spec['Fl32_Leana_Shared_Api_Route_Employee_List#Request'];
        const Response = spec['Fl32_Leana_Shared_Api_Route_Employee_List#Response'];

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
             * Get relations between services and employees.
             * @param trx
             * @param {String} locale 'en_US'
             * @return {Promise<{Number: Fl32_Leana_Shared_Api_Data_New_Employee}>}
             */
            async function selectData(trx, locale) {
                // DEFINE INNER FUNCTIONS
                async function getServicesMap(trx) {
                    const result = {};
                    const query = trx.select();
                    query.from(eEmplSrv.ENTITY);
                    const rs = await query;
                    for (const one of rs) {
                        const serviceRef = one[eEmplSrv.A_SERVICE_REF];
                        const employeeRef = one[eEmplSrv.A_EMPLOYEE_REF];
                        if (!result[employeeRef]) result[employeeRef] = [];
                        result[employeeRef].push(serviceRef);
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                const result = {};
                const services = await getServicesMap(trx);
                const query = trx.select();
                query.from(eEmpl.ENTITY);
                const rs = await query;
                for (const one of rs) {
                    /** @type {Fl32_Leana_Shared_Api_Data_New_Employee} */
                    const employee = new Employee();
                    employee.id = one[eEmpl.A_ID];
                    employee.code = one[eEmpl.A_CODE];
                    employee.name = (locale === 'ru-RU') ? one[eEmpl.A_NAME_RU] : one[eEmpl.A_NAME_LV];
                    if (Array.isArray(services[employee.id])) {
                        employee.services = [...services[employee.id]];
                    }
                    result[one.id] = employee;
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const body = req.body;
            /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Request} */
            const dataIn = Object.assign(new Request(), body.data);
            const trx = await rdb.startTransaction();
            try {
                /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Response} */
                const dataOut = new Response();
                dataOut.items = await selectData(trx, dataIn.locale);
                trx.commit();
                // COMPOSE SUCCESS RESPONSE
                res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                res.end(JSON.stringify({data: dataOut}));
            } catch (err) {
                trx.rollback();
                // COMPOSE FAILURE RESPONSE
                // TODO: move error processing in HANDLERS proto
                const stack = (err.stack) ? err.stack : (new Error()).stack;
                const message = err.message;
                const error = {message, stack};
                const str = JSON.stringify({error});
                console.error(str);
                res.setHeader('Content-Type', 'application/json');
                res.code = 500;
                res.end(str);
            }
        };
    }
}
