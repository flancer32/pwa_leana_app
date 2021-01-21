export default class Fl32_Leana_Back_Process_Task_Save {

    /**  @param {Object} spec */
    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
        /** @type {Fl32_Leana_Shared_Util_Mix} */
        const utilMix = spec['Fl32_Leana_Shared_Util_Mix$'];  // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_State_Trans} */
        const eStateTrans = spec['Fl32_Leana_Store_RDb_Schema_Task_State_Trans$'];   // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const eTask = spec['Fl32_Leana_Store_RDb_Schema_Task$']; // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const eTaskDet = spec['Fl32_Leana_Store_RDb_Schema_Task_Detail$'];   // singleton instance
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];  // singleton instance

        /**
         * Save booking details from front into RDB.
         *
         * @param {Function} trx
         * @param {Fl32_Leana_Shared_Service_Route_Task_Save_Request} req
         * @param {Fl32_Teq_Acl_Shared_Service_Data_UserAcl|null} user if request is received from public realm
         * @returns {Promise<Number>}
         */
        this.exec = async function ({trx, req, user}) {
            // PARSE INPUT & DEFINE WORKING VARS
            let result = null;

            // DEFINE INNER FUNCTIONS
            /**
             * @param {Fl32_Leana_Shared_Service_Route_Task_Save_Request} req
             * @param {Fl32_Teq_Acl_Shared_Service_Data_UserAcl|null} user if request is received from public realm
             * @return {string}
             */
            function extractEmail(req, user) {
                let result = req.email;
                if (utilMix.isEmpty(req.email)) {
                    if (user && Array.isArray(user.emails)) {
                        const [first] = user.emails;
                        result = first;
                    }
                }
                return result;
            }

            /**
             * @param {Fl32_Leana_Shared_Service_Route_Task_Save_Request} req
             * @param {Fl32_Teq_Acl_Shared_Service_Data_UserAcl|null} user if request is received from public realm
             * @return {string}
             */
            function extractPhone(req, user) {
                let result = req.phone;
                if (utilMix.isEmpty(req.phone)) {
                    if (user && Array.isArray(user.phones)) {
                        const [first] = user.phones;
                        result = first;
                    }
                }
                return result;
            }

            /**
             * @param {Fl32_Leana_Shared_Service_Route_Task_Save_Request} req
             * @param {Fl32_Teq_Acl_Shared_Service_Data_UserAcl|null} user if request is received from public realm
             * @return {string}
             */
            function extractName(req, user) {
                return (utilMix.isEmpty(req.name) && user && user.name) ? user.name : req.name;
            }

            function expandDateTime(dateIn) {
                const apiDate = new Date(dateIn);
                const date = utilDate.stampDateUtc(apiDate);
                const hh = `${apiDate.getUTCHours()}`.padStart(2, 0);
                const mm = `${apiDate.getUTCMinutes()}`.padStart(2, 0);
                const from = `${hh}${mm}`;
                return {date, from};
            }

            /**
             * Register new task if taskId is omitted.
             *
             * @param {Function} trx
             * @param {Fl32_Leana_Shared_Service_Route_Task_Save_Request} req
             * @param {Fl32_Teq_Acl_Shared_Service_Data_UserAcl|null} user
             * @return {Promise<Number>}
             */
            async function addToDb(trx, req, user) {
                const {date, from} = expandDateTime(req.date);
                const fromMin = utilDate.convertDbHrsMinsToMins(from);
                const toMin = fromMin + Number.parseInt(req.duration);
                const to = utilDate.convertMinsToDbHrsMins(toMin);
                const customer = extractName(req, user);
                const email = extractEmail(req, user);
                const locale = req.locale ?? undefined;
                const madeOnFront = req.madeOnFront ?? false;
                const note = req.note ?? undefined;
                const phone = extractPhone(req, user);
                const userId = (user && user.id) ? user.id : undefined;
                // register ID for entity
                const rs = await trx(eTask.ENTITY).insert({});
                const taskId = rs[0];
                // add details for new entity
                await trx(eTaskDet.ENTITY).insert({
                    [eTaskDet.A_CUSTOMER]: customer,
                    [eTaskDet.A_DATE]: date,
                    [eTaskDet.A_EMAIL]: email,
                    [eTaskDet.A_EMPLOYEE_REF]: req.employeeId,
                    [eTaskDet.A_FROM]: from,
                    [eTaskDet.A_LOCALE]: locale,
                    [eTaskDet.A_MADE_ON_FRONT]: madeOnFront,
                    [eTaskDet.A_NOTE]: note,
                    [eTaskDet.A_PHONE]: phone,
                    [eTaskDet.A_SERVICE_REF]: req.serviceId,
                    [eTaskDet.A_TASK_REF]: taskId,
                    [eTaskDet.A_TO]: to,
                    [eTaskDet.A_USER_REF]: userId,
                });
                // register state transition
                await trx(eStateTrans.ENTITY).insert({
                    [eStateTrans.A_TASK_REF]: taskId,
                    [eStateTrans.A_STATE_OLD]: DEF.E_TASK_STATE_ACTIVE,
                    [eStateTrans.A_STATE_NEW]: DEF.E_TASK_STATE_ACTIVE,
                });
                return taskId;
            }

            async function saveToDb(trx, req) {
                const {date, from} = expandDateTime(req.date);
                const fromMin = utilDate.convertDbHrsMinsToMins(from);
                const toMin = fromMin + Number.parseInt(req.duration);
                const to = utilDate.convertMinsToDbHrsMins(toMin);
                const customer = extractName(req, user);
                const email = extractEmail(req, user);
                const phone = extractPhone(req, user);
                const note = req.note ?? undefined;
                const locale = req.locale ?? undefined;
                // update details for existing entity
                await trx(eTaskDet.ENTITY)
                    .update({
                        [eTaskDet.A_CUSTOMER]: customer,
                        [eTaskDet.A_DATE]: date,
                        [eTaskDet.A_EMAIL]: email,
                        [eTaskDet.A_EMPLOYEE_REF]: req.employeeId,
                        [eTaskDet.A_FROM]: from,
                        [eTaskDet.A_LOCALE]: locale,
                        [eTaskDet.A_NOTE]: note,
                        [eTaskDet.A_PHONE]: phone,
                        [eTaskDet.A_SERVICE_REF]: req.serviceId,
                        [eTaskDet.A_TO]: to,
                    })
                    .where({[eTaskDet.A_TASK_REF]: req.id,});
                return req.id;
            }

            // MAIN FUNCTIONALITY
            if (typeof req.id === 'number') {
                await saveToDb(trx, req, user);
                result = req.id;
            } else {
                result = await addToDb(trx, req, user);
            }
            // COMPOSE RESULT
            return result;
        };
    }
}
