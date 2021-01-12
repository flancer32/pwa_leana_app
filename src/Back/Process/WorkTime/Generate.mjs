/**
 * Generate work time schedule one week forward.
 */
class Fl32_Leana_Back_Process_WorkTime_Generate {
    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utiDate = spec['Fl32_Leana_Shared_Util_DateTime$'];   // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
        const eWorkTime = spec['Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$'];  // singleton instance

        this.exec = async function ({trx}) {
            // PARSE INPUT & DEFINE WORKING VARS

            // DEFINE INNER FUNCTIONS
            /**
             * Get interval for schedule generation. Interval obviously starts from Sunday and end with Sunday
             * on the next week.
             *
             * @param trx
             * @return {Promise<{from: Date, to: Date}>}
             */
            async function getDatesInterval(trx) {
                let from, to;
                // Get the last work time record
                const query = trx(eWorkTime.ENTITY)
                    .orderBy(eWorkTime.A_DATE, 'desc')
                    .limit(1);
                const rs = await query;
                if (rs[0]) {
                    const date = rs[0][eWorkTime.A_DATE];
                    const last = utiDate.unformatDate(date, '0000');
                    from = new Date(last.getTime());
                    from.setUTCDate(from.getUTCDate() + 1);
                    const weekday = from.getUTCDay();
                    const diff = 7 - weekday;
                    to = new Date(from.getTime());
                    to.setUTCDate(to.getUTCDate() + diff);
                } else {
                    // there is no work time data, start from today and end with the closest sunday
                    from = new Date();
                    from.setUTCHours(0, 0, 0, 0);
                    const weekday = from.getUTCDay();
                    const diff = 7 - weekday;
                    to = new Date(from.getTime());
                    to.setUTCDate(to.getUTCDate() + diff);
                }
                return {from, to};
            }

            /**
             * Compose entries for the schedule and save its.
             * @param trx
             * @param {Date} from
             * @param {Date} to
             * @return {Promise<Number>} total number of the inserted records
             */
            async function generateSchedule(trx, from, to) {
                // DEFINE INNER FUNCTIONS

                /**
                 * Insert one record into DB.
                 * @param trx
                 * @param {Number} emplId
                 * @param {String} date
                 * @param {String} from
                 * @param {String} to
                 * @return {Promise<boolean>} 'true' if new entry is inserted
                 */
                async function insertEntry(trx, emplId, date, from, to) {
                    const rs = await trx(eWorkTime.ENTITY).insert({
                        [eWorkTime.A_EMPLOYEE_REF]: emplId,
                        [eWorkTime.A_DATE]: date,
                        [eWorkTime.A_FROM]: from,
                        [eWorkTime.A_TO]: to,
                    });
                    return (rs[0] !== undefined);
                }

                // MAIN FUNCTIONALITY
                let current = from;
                let result = 0;
                while (current <= to) {
                    const weekday = current.getUTCDay();
                    if (weekday !== 0) {
                        // from Monday to Saturday
                        const date = utiDate.formatDate(current);
                        const employeeId = ((weekday === 1) || (weekday === 3) || (weekday === 5))
                            ? DEF.USER_ID_LENA : DEF.USER_ID_NATA;
                        const from = `0${DEF.DAY_START_HOUR_UTC}00`;
                        const to = (weekday === 6)
                            ? `${DEF.DAY_END_HOUR_UTC_SAT}00` : `${DEF.DAY_END_HOUR_UTC}00`;
                        const inserted = await insertEntry(trx, employeeId, date, from, to);
                        if (inserted) result++;
                    }
                    current.setUTCDate(current.getUTCDate() + 1);
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const {from, to} = await getDatesInterval(trx);
            const totalInserted = await generateSchedule(trx, from, to);

            // COMPOSE RESULT
            return {totalInserted};
        };
    }

}

export default Fl32_Leana_Back_Process_WorkTime_Generate;
