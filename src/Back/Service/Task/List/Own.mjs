/**
 * Get list of user's tasks ("/api/task/list/own").
 */
export default class Fl32_Leana_Back_Service_Task_List_Own {

    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF_USER = spec['Fl32_Teq_User_Defaults$'];  // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];  // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const eTask = spec['Fl32_Leana_Store_RDb_Schema_Task$'];    // singleton instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const eTaskDet = spec['Fl32_Leana_Store_RDb_Schema_Task_Detail$'];    // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_List_Own_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Task_List_Own#Request']; // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_List_Own_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Task_List_Own#Response'];   // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Data_Task} */
        const DTask = spec['Fl32_Leana_Shared_Service_Data_Task#']; // class constructor
        /** @type {typeof Fl32_Teq_Acl_Shared_Service_Data_UserAcl} */
        const DUser = spec['Fl32_Teq_Acl_Shared_Service_Data_UserAcl#'];  // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return 'task/list/own';
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Task_List_Own_Request}
             * @exports Fl32_Leana_Back_Service_Task_List_Own$parse
             */
            function Fl32_Leana_Back_Service_Task_List_Own$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                const result = Object.assign(new Request(), body.data);
                if (result.date) result.date = new Date(result.date);
                return result;
            }

            return Fl32_Leana_Back_Service_Task_List_Own$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Leana_Shared_Service_Route_Task_List_Own_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_List_Own_Response>}
             * @exports Fl32_Leana_Back_Service_Task_List_Own$process
             */
            async function Fl32_Leana_Back_Service_Task_List_Own$process(apiReq, httpReq) {
                // DEFINE INNER FUNCTIONS
                async function getTasksData(trx, userId) {
                    // columns aliases
                    const AS_DATE = 'date';
                    const AS_FROM = 'from';
                    const AS_TO = 'to';
                    // tables aliases
                    const D = 'd';
                    const T = 't';
                    // select from task
                    const query = trx.from({[T]: eTask.ENTITY});
                    query.select([
                        {[DTask.A_ID]: `${T}.${eTask.A_ID}`},
                        {[DTask.A_DATE_CREATED]: `${T}.${eTask.A_CREATED}`},
                    ]);
                    // join task_detail
                    query.leftOuterJoin(
                        {[D]: eTaskDet.ENTITY},
                        `${D}.${eTaskDet.A_TASK_REF}`,
                        `${T}.${eTask.A_ID}`);
                    query.select([
                        {[DTask.A_CUSTOMER_EMAIL]: `${D}.${eTaskDet.A_EMAIL}`},
                        {[DTask.A_CUSTOMER_NAME]: `${D}.${eTaskDet.A_CUSTOMER}`},
                        {[DTask.A_CUSTOMER_PHONE]: `${D}.${eTaskDet.A_PHONE}`},
                        {[DTask.A_EMPLOYEE_REF]: `${D}.${eTaskDet.A_EMPLOYEE_REF}`},
                        {[DTask.A_LOCALE]: `${D}.${eTaskDet.A_LOCALE}`},
                        {[DTask.A_MADE_ON_FRONT]: `${D}.${eTaskDet.A_MADE_ON_FRONT}`},
                        {[DTask.A_NOTE]: `${D}.${eTaskDet.A_NOTE}`},
                        {[DTask.A_SERVICE_REF]: `${D}.${eTaskDet.A_SERVICE_REF}`},
                        {[DTask.A_USER_REF]: `${D}.${eTaskDet.A_USER_REF}`},
                        // these props should be postprocessed
                        {[AS_DATE]: `${D}.${eTaskDet.A_DATE}`},
                        {[AS_FROM]: `${D}.${eTaskDet.A_FROM}`},
                        {[AS_TO]: `${D}.${eTaskDet.A_TO}`},
                    ]);
                    // WHERE
                    query.where(`${T}.${eTask.A_STATE}`, DEF.E_TASK_STATE_ACTIVE);
                    query.where(`${D}.${eTaskDet.A_MADE_ON_FRONT}`, true);
                    query.where(`${D}.${eTaskDet.A_USER_REF}`, userId);
                    // ORDER
                    query.orderBy(`${D}.${eTaskDet.A_DATE}`, 'desc');
                    query.orderBy(`${D}.${eTaskDet.A_FROM}`, 'desc');
                    // compose result
                    const rs = await query;
                    const result = [];
                    for (const one of rs) {
                        // put data into data object
                        /** @type {Fl32_Leana_Shared_Service_Data_Task} */
                        const item = Object.assign(new DTask, one);
                        // postprocess data object props
                        item.dateCreated = new Date(item[DTask.A_DATE_CREATED]);
                        item.dateBook = utilDate.unformatDate(item[AS_DATE]);
                        const hh = item[AS_FROM].substring(0, 2);
                        const mm = item[AS_FROM].substring(2, 4);
                        item.dateBook.setUTCHours(hh, mm);
                        const minsBegin = utilDate.convertDbHrsMinsToMins(item[AS_FROM]);
                        const minsEnd = utilDate.convertDbHrsMinsToMins(item[AS_TO]);
                        item.duration = minsEnd - minsBegin;
                        delete item[AS_DATE];
                        delete item[AS_FROM];
                        delete item[AS_TO];
                        result.push(item);
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Leana_Shared_Service_Route_Task_List_Own_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    /** @type {Fl32_Teq_Acl_Shared_Service_Data_UserAcl} */
                    const user = httpReq[DEF_USER.HTTP_REQ_USER];
                    if (user && (user instanceof DUser)) {
                        result.items = await getTasksData(trx, user.id);
                    }
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Task_List_Own$process;
        };
    }
}
