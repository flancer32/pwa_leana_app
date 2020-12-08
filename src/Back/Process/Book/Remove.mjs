export default class Fl32_Leana_Back_Process_Book_Remove {
    /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
    eTask

    constructor(spec) {
        this.eTask = spec.Fl32_Leana_Store_RDb_Schema_Task$;
    }

    /**
     * Remove task from RDB.
     *
     * @param {Function} trx
     * @param {Number} taskId
     * @return {Promise<{removed: number}>} total number of removed records
     */
    async exec({trx, taskId}) {
        // PARSE INPUT & DEFINE WORKING VARS
        let removed = 0;


        // MAIN FUNCTIONALITY
        const query = trx(this.eTask.TABLE)
            .where(this.eTask.A_ID, taskId)
            .del();
        removed = await query;

        // COMPOSE RESULT
        return {removed};
    }
}
