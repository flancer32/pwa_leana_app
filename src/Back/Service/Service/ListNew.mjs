/**
 * Service to get services listing ("/api/service/list").
 */
export default class Fl32_Leana_Back_Service_Service_ListNew {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;  // singleton object
        /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
        const eSrv = spec.Fl32_Leana_Store_RDb_Schema_Service$; // singleton object
        const Request = spec['Fl32_Leana_Shared_Service_Route_Service_List#Request'];   // class constructor
        const Response = spec['Fl32_Leana_Shared_Service_Route_Service_List#Response'];   // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Data_Service} */
        const Service = spec['Fl32_Leana_Shared_Service_Data_Service#']; // class constructor

        this.getRoute = function () {
            return 'service/list'; // route w/o module starts w/o slash
        };

        /**
         * Create function to validate and structure incoming data.
         * @return {Function}
         */
        this.getParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_Service_List_Request}
             * @exports Fl32_Leana_Back_Service_Service_ListNew$parse
             */
            function Fl32_Leana_Back_Service_Service_ListNew$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                return Object.assign(new Request(), body.data);
            }

            return Fl32_Leana_Back_Service_Service_ListNew$parse;
        };

        /**
         * Create function to perform requested operation.
         * @return {Function}
         */
        this.getProcessor = function () {
            /**
             * @param {Fl32_Leana_Shared_Service_Route_Service_List_Request} apiReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_Service_List_Response>}
             * @exports Fl32_Leana_Back_Service_Service_ListNew$process
             */
            async function Fl32_Leana_Back_Service_Service_ListNew$process(apiReq) {
                // DEFINE INNER FUNCTIONS
                /**
                 * Get relations between services and employees.
                 * @param trx
                 * @param {Fl32_Leana_Shared_Service_Route_Service_List_Request} req
                 * @return {Promise<{Number: Fl32_Leana_Shared_Api_Data_Employee}>}
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

            return Fl32_Leana_Back_Service_Service_ListNew$process;
        };
    }

}
