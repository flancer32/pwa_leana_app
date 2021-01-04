/**
 * Get all tasks on the date ("/api/task/onDate").
 */
export default class Fl32_Leana_Back_Service_Task_OnDate {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];  // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const eTask = spec['Fl32_Leana_Store_RDb_Schema_Task$'];    // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const eTaskDet = spec['Fl32_Leana_Store_RDb_Schema_Task_Detail$'];  // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Data_Task} */
        const Task = spec['Fl32_Leana_Shared_Service_Data_Task#'];  // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request'];    // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_OnDate_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Response'];  // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return 'task/onDate';
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.getParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request}
             * @exports Fl32_Leana_Back_Service_Task_OnDate$parse
             */
            function Fl32_Leana_Back_Service_Task_OnDate$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                const result = Object.assign(new Request(), body.data);
                if (result.date) result.date = new Date(result.date);
                return result;
            }

            return Fl32_Leana_Back_Service_Task_OnDate$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.getProcessor = function () {
            /**
             * @param {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} apiReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_OnDate_Response>}
             * @exports Fl32_Leana_Back_Service_Task_OnDate$process
             */
            async function Fl32_Leana_Back_Service_Task_OnDate$process(apiReq) {
                // DEFINE INNER FUNCTIONS

                /**
                 *
                 * @param trx
                 * @param {Date} date
                 * @return {Promise<Object.<number, Fl32_Leana_Shared_Service_Data_Task>>}
                 */
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
                /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    result.items = await selectData(trx, apiReq.date);
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Task_OnDate$process;
        };
    }
}
