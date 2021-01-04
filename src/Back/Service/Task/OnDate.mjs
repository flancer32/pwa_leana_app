/**
 * Get all tasks on the date.
 */
export default class Fl32_Leana_Back_Service_Task_OnDate {

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE (PROPS AND VARS IN THE CLOSURE OF THE CONSTRUCTOR)
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const eTask = spec.Fl32_Leana_Store_RDb_Schema_Task$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const eTaskDet = spec.Fl32_Leana_Store_RDb_Schema_Task_Detail$;
        //
        const Task = spec['Fl32_Leana_Shared_Service_Data_Task#'];
        const Request = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request'];
        const Response = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Response'];

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)
        /**
         * API route handler to get all tasks on the date.
         *
         * @param req
         * @param res
         * @returns {Promise<void>}
         * @see TeqFw_Core_App_Server.addApiRoute
         */
        this.handle = async function (req, res) {

            // DEFINE INNER FUNCTIONS
            async function selectData(trx, date) {
                // DEFINE INNER FUNCTIONS
                /**
                 *
                 * @param {TextRow} data
                 * @return {Fl32_Leana_Shared_Service_Data_Task}
                 */
                function composeItem(data) {
                    /** @type {Fl32_Leana_Shared_Service_Data_Task} */
                    const result = new Task();
                    result.customerEmail = data['customerEmail'];
                    result.customerName = data['customerName'];
                    result.customerPhone = data['customerPhone'];
                    result.dateBook = utilDate.unformatDate(data['bookedDate']);
                    const hh = data['bookedBegin'].substring(0, 2);
                    const mm = data['bookedBegin'].substring(2, 4);
                    result.dateBook.setUTCHours(hh, mm);
                    result.dateCreated = new Date(data['dateCreated']);
                    const minsBegin = utilDate.convertDbHrsMinsToMins(data['bookedBegin']);
                    const minsEnd = utilDate.convertDbHrsMinsToMins(data['bookedEnd']);
                    result.duration = minsEnd - minsBegin;
                    result.employeeRef = data['employeeRef'];
                    result.id = data['id'];
                    result.locale = data['locale'];
                    result.note = data['note'];
                    result.madeOnFront = data['madeOnFront'];
                    result.serviceRef = data['serviceRef'];
                    return result;
                }

                // MAIN FUNCTIONALITY
                const result = {};
                // main select
                const query = trx.select();
                query.from({t: eTask.ENTITY});
                query.select([
                    {id: `t.${eTask.A_ID}`},
                    {dateCreated: `t.${eTask.A_CREATED}`},
                ]);
                // JOIN book_detail
                query.leftOuterJoin({d: eTaskDet.ENTITY}, `d.${eTaskDet.A_TASK_REF}`, `t.${eTask.A_ID}`);
                query.select([
                    {bookedBegin: `d.${eTaskDet.A_FROM}`},
                    {bookedDate: `d.${eTaskDet.A_DATE}`},
                    {bookedEnd: `d.${eTaskDet.A_TO}`},
                    {customerEmail: `d.${eTaskDet.A_EMAIL}`},
                    {customerName: `d.${eTaskDet.A_CUSTOMER}`},
                    {customerPhone: `d.${eTaskDet.A_PHONE}`},
                    {employeeRef: `d.${eTaskDet.A_EMPLOYEE_REF}`},
                    {locale: `d.${eTaskDet.A_LOCALE}`},
                    {madeOnFront: `d.${eTaskDet.A_MADE_ON_FRONT}`},
                    {note: `d.${eTaskDet.A_NOTE}`},
                    {serviceRef: `d.${eTaskDet.A_SERVICE_REF}`},
                ]);
                // WHERE
                const datestamp = utilDate.stampDateUtc(date);
                query.where(`d.${eTaskDet.A_DATE}`, datestamp);
                // perform query
                const rs = await query;
                for (const one of rs) {
                    const item = composeItem(one);
                    result[item.id] = item;
                }
                return result;

            }

            // MAIN FUNCTIONALITY
            const body = req.body;
            /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
            const dataIn = Object.assign(new Request(), body.data);
            if (dataIn.date) dataIn.date = new Date(dataIn.date);
            const trx = await rdb.startTransaction();
            try {
                /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
                const dataOut = new Response();
                dataOut.items = await selectData(trx, dataIn.date);
                trx.commit();
                // COMPOSE SUCCESS RESPONSE
                res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                res.end(JSON.stringify({data: dataOut}));
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
