/**
 * Save single task ("/api/task/save").
 */
export default class Fl32_Leana_Back_Service_Task_Save {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Leana_Back_Process_Book_Save} */
        const procSave = spec['Fl32_Leana_Back_Process_Book_Save$'];    // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Request'];  // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Save_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Response'];  // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return 'task/save';
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Task_Save_Request}
             * @exports Fl32_Leana_Back_Service_Task_Save$parse
             */
            function Fl32_Leana_Back_Service_Task_Save$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                const result = Object.assign(new Request(), body.data);
                if (result.date) result.date = new Date(result.date);
                return result;
            }

            return Fl32_Leana_Back_Service_Task_Save$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Leana_Shared_Service_Route_Task_Save_Request} apiReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_Save_Response>}
             * @exports Fl32_Leana_Back_Service_Task_Save$process
             */
            async function Fl32_Leana_Back_Service_Task_Save$process(apiReq) {
                // DEFINE INNER FUNCTIONS

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Leana_Shared_Service_Route_Task_Save_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    result.id = await procSave.exec({trx, req: apiReq});
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Task_Save$process;
        };
    }
}
