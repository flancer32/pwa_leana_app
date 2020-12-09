/**
 * Get calendar state for desktop.
 */
export default class Fl32_Leana_Back_Service_Desk_Calendar_Get {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const _db = spec.TeqFw_Core_App_Db_Connector$;
        const Employee = spec['Fl32_Leana_Shared_Api_Data_Desk_Employee#'];
        const Response = spec['Fl32_Leana_Shared_Api_Route_Desk_Calendar_Get_Response#'];
        const Service = spec['Fl32_Leana_Shared_Api_Data_Service#'];
        const Task = spec['Fl32_Leana_Shared_Api_Data_Desk_Task#'];
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
        const eEmpl = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
        const eSrv = spec.Fl32_Leana_Store_RDb_Schema_Service$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const eTask = spec.Fl32_Leana_Store_RDb_Schema_Task$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const eTaskDet = spec.Fl32_Leana_Store_RDb_Schema_Task_Detail$;


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
             * Get employees entries for dashboard calendar.
             * @param trx
             * @returns {Promise<Object.<string, Fl32_Leana_Shared_Api_Data_Desk_Employee>>}
             * @private
             */
            async function _getEmployees(trx) {
                const result = {};
                const query = trx.select();
                query.from(eEmpl.ENTITY);
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
                query.from(eSrv.ENTITY);
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
                query.from({b: eTask.ENTITY});
                query.select([
                    {id: `b.${eTask.A_ID}`},
                    {dateCreated: `b.${eTask.A_CREATED}`},
                ]);
                // JOIN book_detail
                query.leftOuterJoin({d: eTaskDet.ENTITY}, `d.${eTaskDet.A_TASK_REF}`, `b.${eTask.A_ID}`);
                query.select([
                    {employeeRef: `d.${eTaskDet.A_EMPLOYEE_REF}`},
                    {serviceRef: `d.${eTaskDet.A_SERVICE_REF}`},
                    {bookedDate: `d.${eTaskDet.A_DATE}`},
                    {bookedBegin: `d.${eTaskDet.A_FROM}`},
                    {bookedEnd: `d.${eTaskDet.A_TO}`},
                    {customerName: `d.${eTaskDet.A_CUSTOMER}`},
                    {customerPhone: `d.${eTaskDet.A_PHONE}`},
                    {customerEmail: `d.${eTaskDet.A_EMAIL}`},
                    {lang: `d.${eTaskDet.A_LANG}`},
                    {note: `d.${eTaskDet.A_NOTE}`},
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
