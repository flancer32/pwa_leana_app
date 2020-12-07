export default class Fl32_Leana_Back_Service_Book_Remove {
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
        const query = trx('book')
            .where('id', taskId)
            .del();
        removed = await query;

        // COMPOSE RESULT
        return {removed};
    }
}
