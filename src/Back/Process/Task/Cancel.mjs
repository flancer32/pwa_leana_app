class Fl32_Leana_Back_Process_Task_Cancel {
    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_State_Trans} */
        const eStateTrans = spec['Fl32_Leana_Store_RDb_Schema_Task_State_Trans$'];   // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const eTask = spec['Fl32_Leana_Store_RDb_Schema_Task$'];  // singleton instance

        /**
         * Set task state as cancelled.
         *
         * @param {Function} trx
         * @param {Number} taskId
         * @return {Promise<{removed: number}>} total number of removed records
         */
        this.exec = async function ({trx, taskId}) {
            // PARSE INPUT & DEFINE WORKING VARS
            let updated = 0;

            // MAIN FUNCTIONALITY
            const query = trx(eTask.ENTITY)
                .where(eTask.A_ID, taskId)
                .update({[eTask.A_STATE]: DEF.E_TASK_STATE_CANCELLED});
            updated = await query;

            // register state transition
            await trx(eStateTrans.ENTITY).insert({
                [eStateTrans.A_TASK_REF]: taskId,
                [eStateTrans.A_STATE_OLD]: DEF.E_TASK_STATE_ACTIVE,
                [eStateTrans.A_STATE_NEW]: DEF.E_TASK_STATE_CANCELLED,
            });

            // COMPOSE RESULT
            return {updated};
        };
    }

}

export default Fl32_Leana_Back_Process_Task_Cancel;
