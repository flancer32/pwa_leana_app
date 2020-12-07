/**
 * Save single task.
 */
export default class Fl32_Leana_Back_Route_Book_Save {

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE (PROPS AND VARS IN THE CLOSURE OF THE CONSTRUCTOR)
        /** @type {Fl32_Leana_App_Db_Connector} */
        const _db = spec.Fl32_Leana_App_Db_Connector$;
        /** @type {Fl32_Leana_Back_Service_Book_Save} */
        const _srvSave = spec.Fl32_Leana_Back_Service_Book_Save$;
        const ServiceRequest = spec['Fl32_Leana_Shared_Api_Route_Book_Save_Request#'];  // class

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)
        /**
         * API route handler to save single booking.
         *
         * @param req
         * @param res
         * @returns {Promise<void>}
         * @see Fl32_Leana_App_Server.addApiRoute
         */
        this.handle = async function (req, res) {
            // PARSE INPUT & DEFINE WORKING VARS
            const body = req.body;
            /** @type {Fl32_Leana_Shared_Api_Route_Book_Save_Request} */
            const dataIn = body.data;
            /** @type {Fl32_Leana_Shared_Api_Route_Book_Save_Request} */
            const data = {};
            Object.assign(data, dataIn);

            const trx = await _db.startTransaction();
            try {
                const req = Object.assign(new ServiceRequest(), dataIn);
                await _srvSave.exec({trx, req});
                trx.commit();
                res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                res.end(JSON.stringify({data}));
            } catch (err) {
                // TODO: move error processing in HANDLERS proto
                const stack = (err.stack) ? err.stack : (new Error()).stack;
                const message = err.message;
                const error = {message, stack};
                const str = JSON.stringify({error});
                console.error(str);
                res.setHeader('Content-Type', 'application/json');
                res.code = 500;
                res.end(str);
            }
        };
    }
}
