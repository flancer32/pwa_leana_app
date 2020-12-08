/**
 * Get booking state (categories, services, masters, ...).
 */
export default class Fl32_Leana_Back_Service_Task_State_Get {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const _db = spec.TeqFw_Core_App_Db_Connector$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
        const eEmpl = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Service} */
        const eEmplSrv = spec.Fl32_Leana_Store_RDb_Schema_Employee_Service$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
        const eEmplTimeWork = spec.Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
        const eSrv = spec.Fl32_Leana_Store_RDb_Schema_Service$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const eTaskDet = spec.Fl32_Leana_Store_RDb_Schema_Task_Detail$;
        const Employee = spec['Fl32_Leana_Shared_Api_Data_Employee#'];
        const Service = spec['Fl32_Leana_Shared_Api_Data_Service#'];
        const BookedTime = spec['Fl32_Leana_Shared_Api_Data_Employee_BookedTime#'];
        const Response = spec['Fl32_Leana_Shared_Api_Route_Book_State_Get_Response#'];


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

            async function _getEmployees(trx) {
                const result = [];
                const query = trx.select();
                query.from(eEmpl.TABLE);
                const rs = await query;
                for (const one of rs) {
                    /** @type {Fl32_Leana_Shared_Api_Data_Employee} */
                    const target = new Employee();
                    result.push(Object.assign(target, one));
                }
                return result;
            }

            /**
             *
             * @param trx
             * @returns {Promise<[Array<Fl32_Leana_Shared_Api_Data_Service>]>}
             * @private
             */
            async function _getServices(trx) {
                const result = [];
                const query = trx.select();
                query.from(eSrv.TABLE);
                query.where(eSrv.A_PUBLIC, true);
                const rs = await query;
                for (const one of rs) {
                    const target = new Service();
                    result.push(Object.assign(target, one));
                }
                return result;
            }

            async function _getServicesMap(trx) {
                const result = [];
                const query = trx.select();
                query.from(eEmplSrv.TABLE);
                const rs = await query;
                for (const one of rs) {
                    result.push(Object.assign({}, one));
                }
                return result;
            }

            async function _getWorkTime(trx) {
                const result = [];
                const query = trx.select();
                query.from(eEmplTimeWork.TABLE);
                const rs = await query;
                for (const one of rs) {
                    result.push(Object.assign({}, one));
                }
                return result;
            }

            async function _getBookedTime(trx) {
                const result = [];
                const query = trx.select();
                query.from(eTaskDet.TABLE);
                const rs = await query;
                for (const one of rs) {
                    result.push(Object.assign({}, one));
                }
                return result;
            }

            /**
             * Put services data into employees.
             *
             * @param {Array<Fl32_Leana_Shared_Api_Data_Employee>} result
             * @param {Array<{employee_ref:number, service_ref:number}>} map
             * @return {Array<Fl32_Leana_Shared_Api_Data_Employee>}
             * @private
             */
            function _populateWithServices(result, map) {
                const mapped = {};
                for (const one of map) {
                    const employeeRef = one.employee_ref;
                    if (!mapped[employeeRef]) mapped[employeeRef] = [];
                    mapped[employeeRef].push(one.service_ref);
                }
                for (const one of result) {
                    const id = one.id;
                    one.services = (mapped[id]) ? mapped[id] : [];
                }
                return result;
            }

            /**
             *
             * @param {Array<Fl32_Leana_Shared_Api_Data_Employee>} result
             * @param {Array<{}>} map
             * @return {*}
             * @private
             */
            function _populateWithWorkTime(result, map) {
                const mapped = {};
                for (const one of map) {
                    const employeeRef = one.employee_ref;
                    const date = one.date;
                    const from = one.from;
                    const to = one.to;
                    if (!mapped[employeeRef]) mapped[employeeRef] = {};
                    if (!mapped[employeeRef][date]) mapped[employeeRef][date] = {};
                    mapped[employeeRef][date] = {from, to};
                }
                for (const one of result) {
                    const id = one.id;
                    one.workTime = (mapped[id]) ? mapped[id] : {};
                }
                return result;
            }

            async function _populateWithBookedTime(result, map) {
                const mapped = {};
                for (const one of map) {
                    const taskRef = one[eTaskDet.A_TASK_REF];
                    const employeeRef = one[eTaskDet.A_EMPLOYEE_REF];
                    const serviceRef = one[eTaskDet.A_SERVICE_REF];
                    const date = one[eTaskDet.A_DATE];
                    const from = one[eTaskDet.A_FROM];
                    const to = one[eTaskDet.A_TO];
                    if (!mapped[employeeRef]) mapped[employeeRef] = {};
                    if (!mapped[employeeRef][date]) mapped[employeeRef][date] = {};
                    /** @type {Fl32_Leana_Shared_Api_Data_Employee_BookedTime} */
                    const item = new BookedTime();
                    mapped[employeeRef][date][from] = Object.assign(item, {taskRef, serviceRef, to, date, from});
                }
                for (const one of result) {
                    const id = one.id;
                    one.bookedTime = (mapped[id]) ? mapped[id] : {};
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            /** @type {Fl32_Leana_Shared_Api_Route_Book_State_Get_Response} */
            const data = new Response();
            const trx = await _db.startTransaction();
            try {
                const workTime = await _getWorkTime(trx);
                const bookedTime = await _getBookedTime(trx);
                const servicesMap = await _getServicesMap(trx);
                const employees = await _getEmployees(trx);
                const services = await _getServices(trx);
                _populateWithServices(employees, servicesMap);
                _populateWithWorkTime(employees, workTime);
                await _populateWithBookedTime(employees, bookedTime);
                Object.assign(data, {employees, services});
                trx.commit();
                // COMPOSE SUCCESS RESPONSE
                res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                res.end(JSON.stringify({data}));
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
