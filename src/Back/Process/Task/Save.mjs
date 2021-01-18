export default class Fl32_Leana_Back_Process_Task_Save {

    /**  @param {Object} spec */
    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
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
         * @param {Number} userId if request is received from public realm
         * @returns {Promise<Number>}
         */
        this.exec = async function ({trx, req, userId}) {
            // PARSE INPUT & DEFINE WORKING VARS
            let result = null;
            const apiDate = new Date(req.date);

            // DEFINE INNER FUNCTIONS

            async function addToDb() {
                const date = utilDate.stampDateUtc(apiDate);
                const hh = `${apiDate.getUTCHours()}`.padStart(2, 0);
                const mm = `${apiDate.getUTCMinutes()}`.padStart(2, 0);
                const from = `${hh}${mm}`;
                const fromMin = utilDate.convertDbHrsMinsToMins(from);
                const toMin = fromMin + Number.parseInt(req.duration);
                const to = utilDate.convertMinsToDbHrsMins(toMin);
                const customer = req.name ?? undefined;
                const email = req.email ?? undefined;
                const locale = req.locale ?? undefined;
                const madeOnFront = req.madeOnFront ?? false;
                const note = req.note ?? undefined;
                const phone = req.phone ?? undefined;
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

            async function saveToDb() {
                const date = utilDate.stampDateUtc(apiDate);
                const hh = `${apiDate.getUTCHours()}`.padStart(2, 0);
                const mm = `${apiDate.getUTCMinutes()}`.padStart(2, 0);
                const from = `${hh}${mm}`;
                const fromMin = utilDate.convertDbHrsMinsToMins(from);
                const toMin = fromMin + Number.parseInt(req.duration);
                const to = utilDate.convertMinsToDbHrsMins(toMin);
                const customer = req.name ?? undefined;
                const email = req.email ?? undefined;
                const phone = req.phone ?? undefined;
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
                await saveToDb();
                result = req.id;
            } else {
                result = await addToDb();
            }
            // COMPOSE RESULT
            return result;
        };
    }
}
