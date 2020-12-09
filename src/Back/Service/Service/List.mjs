/**
 * Service to get all services data.
 */
export default class Fl32_Leana_Back_Service_Service_List {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
        const eSrv = spec.Fl32_Leana_Store_RDb_Schema_Service$;
        const Service = spec['Fl32_Leana_Shared_Api_Data_New_Service#'];
        const Request = spec['Fl32_Leana_Shared_Api_Route_Service_List#Request'];
        const Response = spec['Fl32_Leana_Shared_Api_Route_Service_List#Response'];

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * API route handler to get booking state.
         *
         * @param req
         * @param res
         * @returns {Promise<void>}
         * @see TeqFw_Core_App_Server.addApiRoute
         */
        this.handle = async function (req, res) {
            // PARSE INPUT & DEFINE WORKING VARS

            // DEFINE INNER FUNCTIONS (AVAILABLE FOR CURRENT INSTANCE ONLY)
            /**
             * Get relations between services and employees.
             * @param trx
             * @param {String} locale 'en_US'
             * @return {Promise<{Number: Fl32_Leana_Shared_Api_Data_New_Employee}>}
             */
            async function selectData(trx, locale) {
                const result = {};
                // const services = await getServicesMap(trx);
                const query = trx.select();
                query.from(eSrv.ENTITY);
                const rs = await query;
                for (const one of rs) {
                    /** @type {Fl32_Leana_Shared_Api_Data_New_Service} */
                    const service = new Service();
                    service.id = one[eSrv.A_ID];
                    service.code = one[eSrv.A_CODE];
                    service.duration = one[eSrv.A_DURATION];
                    service.public = one[eSrv.A_PUBLIC];
                    service.name = (locale === 'ru_RU') ? one[eSrv.A_NAME_RU] : one[eSrv.A_NAME_LV];
                    result[one.id] = service;
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            const body = req.body;
            /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Request} */
            const dataIn = Object.assign(new Request(), body.data);
            const trx = await rdb.startTransaction();
            try {
                /** @type {Fl32_Leana_Shared_Api_Route_Service_List_Response} */
                const dataOut = new Response();
                dataOut.items = await selectData(trx, dataIn.locale);
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
