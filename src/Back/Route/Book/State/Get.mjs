/**
 * Get booking state (categories, services, masters, ...).
 */
export default class Fl32_Leana_Back_Route_Book_State_Get {

    constructor(spec) {
        /** @type {TeqFw_Di_Container} */
        const _container = spec.TeqFw_Di_Container$;
        /** @type {Fl32_Leana_App_Db_Connector} */
        const _db = spec.Fl32_Leana_App_Db_Connector$;

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)
        /**
         * API route handler to get booking state.
         *
         * @param req
         * @param res
         * @returns {Promise<void>}
         * @see Fl32_Leana_App_Server.addApiRoute
         */
        this.handle = async function (req, res) {
            // PARSE INPUT & DEFINE WORKING VARS

            // DEFINE INNER FUNCTIONS (AVAILABLE FOR CURRENT INSTANCE ONLY)

            async function _getEmployees(trx) {
                const result = [];
                const query = trx.select();
                query.from('employee');
                const rs = await query;
                for (const one of rs) {
                    const target = await _container.get('Fl32_Leana_Shared_Api_Data_Employee$$');
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
                query.from('service');
                query.where('public', true);
                const rs = await query;
                for (const one of rs) {
                    const target = await _container.get('Fl32_Leana_Shared_Api_Data_Service$$');
                    result.push(Object.assign(target, one));
                }
                return result;
            }

            async function _getServicesMap(trx) {
                const result = [];
                const query = trx.select();
                query.from('employee_service');
                const rs = await query;
                for (const one of rs) {
                    result.push(Object.assign({}, one));
                }
                return result;
            }

            async function _getWorkTime(trx) {
                const result = [];
                const query = trx.select();
                query.from('employee_time_work');
                const rs = await query;
                for (const one of rs) {
                    result.push(Object.assign({}, one));
                }
                return result;
            }

            async function _getBookedTime(trx) {
                const result = [];
                const query = trx.select();
                query.from('book_detail');
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
                    const bookRef = one.book_ref;
                    const employeeRef = one.employee_ref;
                    const serviceRef = one.service_ref;
                    const date = one.date;
                    const from = one.from;
                    const to = one.to;
                    if (!mapped[employeeRef]) mapped[employeeRef] = {};
                    if (!mapped[employeeRef][date]) mapped[employeeRef][date] = {};
                    const item = await _container.get('Fl32_Leana_Shared_Api_Data_Employee_BookedTime$$'); // create
                    mapped[employeeRef][date][from] = Object.assign(item, {bookRef, serviceRef, to});
                }
                for (const one of result) {
                    const id = one.id;
                    one.bookedTime = (mapped[id]) ? mapped[id] : {};
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            /** @type {Fl32_Leana_Shared_Api_Route_Book_State_Get_Response} */
            const data = await _container.get('Fl32_Leana_Shared_Api_Route_Book_State_Get_Response$$');
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
