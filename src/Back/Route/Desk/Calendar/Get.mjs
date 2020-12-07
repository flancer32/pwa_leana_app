/**
 * Get calendar state for desktop.
 */
export default class Fl32_Leana_Back_Route_Desk_Calendar_Get {

    constructor(spec) {
        /** @type {Fl32_Leana_App_Db_Connector} */
        const _db = spec.Fl32_Leana_App_Db_Connector$;
        const Employee = spec['Fl32_Leana_Shared_Api_Data_Desk_Employee#'];
        const Response = spec['Fl32_Leana_Shared_Api_Route_Desk_Calendar_Get_Response#'];
        const Service = spec['Fl32_Leana_Shared_Api_Data_Service#'];
        const Task = spec['Fl32_Leana_Shared_Api_Data_Desk_Task#'];

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

            /**
             * Get employees entries for dashboard calendar.
             * @param trx
             * @returns {Promise<Object.<string, Fl32_Leana_Shared_Api_Data_Desk_Employee>>}
             * @private
             */
            async function _getEmployees(trx) {
                const result = {};
                const query = trx.select();
                query.from('employee');
                const rs = await query;
                for (const one of rs) {
                    const target = new Employee();
                    result[one.id] = Object.assign(target, one);
                }
                return result;
            }

            /**
             * Get services entries for dashboard calendar.
             * @param trx
             * @returns {Promise<Object.<string, Fl32_Leana_Shared_Api_Data_Service>>}
             * @private
             */
            async function _getServices(trx) {
                const result = {};
                const query = trx.select();
                query.from('service');
                const rs = await query;
                for (const one of rs) {
                    const target = new Service();
                    result[one.id] = Object.assign(target, one);
                }
                return result;
            }

            /**
             *
             * @param trx
             * @returns {Promise<Object.<string, Fl32_Leana_Shared_Api_Data_Desk_Task>>}
             * @private
             */
            async function _getTasks(trx) {
                const result = {};
                // SELECT from book
                const query = trx.select();
                query.from({b: 'book'});
                query.select([
                    {id: 'b.id'},
                    {dateCreated: 'b.created'},
                ]);
                // JOIN book_detail
                query.leftOuterJoin({d: 'book_detail'}, 'd.book_ref', 'b.id');
                query.select([
                    {employeeRef: 'd.employee_ref'},
                    {serviceRef: 'd.service_ref'},
                    {bookedDate: 'd.date'},
                    {bookedBegin: 'd.from'},
                    {bookedEnd: 'd.to'},
                    {customerName: 'd.customer'},
                    {customerPhone: 'd.phone'},
                    {customerEmail: 'd.email'},
                    {lang: 'd.lang'},
                    {note: 'd.note'},
                ]);
                // const sql = query.toString();
                // console.log(sql);
                // COMPOSE RESULTS
                const rs = await query;
                for (const one of rs) {
                    const target = new Task();
                    result[one.id] = Object.assign(target, one);
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            /** @type {Fl32_Leana_Shared_Api_Route_Book_State_Get_Response} */
            const data = new Response();
            const trx = await _db.startTransaction();
            try {
                const employees = await _getEmployees(trx);
                const services = await _getServices(trx);
                const tasks = await _getTasks(trx);
                Object.assign(data, {employees, services, tasks});
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
