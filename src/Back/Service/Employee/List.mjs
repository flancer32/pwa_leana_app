/**
 * Service to get all employees data ("/api/employee/list").
 */
export default class Fl32_Leana_Back_Service_Employee_List {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];   // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
        const eEmpl = spec['Fl32_Leana_Store_RDb_Schema_Employee$'];    // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Service} */
        const eEmplSrv = spec['Fl32_Leana_Store_RDb_Schema_Employee_Service$']; // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Api_Data_Employee} */
        const DEmployee = spec['Fl32_Leana_Shared_Api_Data_Employee#'];  // class constructor
        /** @type {typeof Fl32_Leana_Shared_Api_Route_Employee_List_Request} */
        const Request = spec['Fl32_Leana_Shared_Api_Route_Employee_List#Request'];  // class constructor
        /** @type {typeof Fl32_Leana_Shared_Api_Route_Employee_List_Response} */
        const Response = spec['Fl32_Leana_Shared_Api_Route_Employee_List#Response'];    // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return 'employee/list'; // route w/o module starts w/o slash
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.getParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Api_Route_Employee_List_Request}
             * @exports Fl32_Leana_Back_Service_Employee_List$parse
             */
            function Fl32_Leana_Back_Service_Employee_List$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Leana_Back_Service_Employee_List$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.getProcessor = function () {
            /**
             *
             * @param {Fl32_Leana_Shared_Api_Route_Employee_List_Request} apiReq
             * @return {Promise<Fl32_Leana_Shared_Api_Route_Employee_List_Response>}
             * @exports Fl32_Leana_Back_Service_Employee_List$process
             */
            async function Fl32_Leana_Back_Service_Employee_List$process(apiReq) {
                // DEFINE INNER FUNCTIONS (AVAILABLE FOR CURRENT INSTANCE ONLY)
                /**
                 * Get relations between services and employees.
                 * @param trx
                 * @param {String} locale 'es-ES'
                 * @return {Promise<{Number: Fl32_Leana_Shared_Api_Data_Employee}>}
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
                        /** @type {Fl32_Leana_Shared_Api_Data_Employee} */
                        const employee = new DEmployee();
                        employee.id = one[eEmpl.A_USER_REF];
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
                /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    // result.items = await selectData(trx, apiReq);
                    result.items = await selectData(trx, apiReq.locale);
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            return Fl32_Leana_Back_Service_Employee_List$process;
        };

    }
}
