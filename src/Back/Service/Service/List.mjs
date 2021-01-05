/**
 * Service to get services listing ("/api/service/list").
 */
export default class Fl32_Leana_Back_Service_Service_List {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton class instance
        /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
        const eSrv = spec.Fl32_Leana_Store_RDb_Schema_Service$; // singleton class instance
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Service_List_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_Service_List#Request'];   // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_Service_List_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_Service_List#Response'];   // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Data_Service} */
        const Service = spec['Fl32_Leana_Shared_Service_Data_Service#']; // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return 'service/list';
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Service_List_Request}
             * @exports Fl32_Leana_Back_Service_Service_List$parse
             */
            function Fl32_Leana_Back_Service_Service_List$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Leana_Back_Service_Service_List$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Leana_Shared_Service_Route_Service_List_Request} apiReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Service_List_Response>}
             * @exports Fl32_Leana_Back_Service_Service_List$process
             */
            async function Fl32_Leana_Back_Service_Service_List$process(apiReq) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Get relations between services and employees.
                 * @param trx
                 * @param {Fl32_Leana_Shared_Service_Route_Service_List_Request} req
                 * @return {Promise<{Number: Fl32_Leana_Shared_Service_Data_Employee}>}
                 */
                async function selectData(trx, req) {
                    const result = {};

                    const query = trx.select();
                    query.from(eSrv.ENTITY);
                    if (req.publicOnly) {
                        query.where(eSrv.A_PUBLIC, true);
                    }
                    const rs = await query;
                    for (const one of rs) {
                        /** @type {Fl32_Leana_Shared_Service_Data_Service} */
                        const service = new Service();
                        service.id = one[eSrv.A_ID];
                        service.code = one[eSrv.A_CODE];
                        service.duration = one[eSrv.A_DURATION];
                        service.public = one[eSrv.A_PUBLIC];
                        service.name = (req.locale === 'ru-RU') ? one[eSrv.A_NAME_RU] : one[eSrv.A_NAME_LV];
                        result[one.id] = service;
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    result.items = await selectData(trx, apiReq);
                    trx.commit();
                } catch (error) {
                    trx.rollback();
                    throw error;
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_Service_List$process;
        };
    }

}
