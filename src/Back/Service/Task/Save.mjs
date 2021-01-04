/**
 * Save single task.
 */
export default class Fl32_Leana_Back_Service_Task_Save {

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE (PROPS AND VARS IN THE CLOSURE OF THE CONSTRUCTOR)
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec.TeqFw_Core_App_Db_Connector$;
        /** @type {Fl32_Leana_Back_Process_Book_Save} */
        const procSave = spec.Fl32_Leana_Back_Process_Book_Save$;
        const Request = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Request'];  // class
        const Response = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Response'];  // class

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)
        /**
         * API route handler to save single booking.
         *
         * @param req
         * @param res
         * @returns {Promise<void>}
         * @see TeqFw_Core_App_Server.addApiRoute
         */
        this.handle = async function (req, res) {

            // MAIN FUNCTIONALITY
            const body = req.body;
            /** @type {Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
            const dataIn = Object.assign(new Request(), body.data);
            const trx = await rdb.startTransaction();
            try {
                /** @type {Fl32_Leana_Shared_Service_Route_Task_Save_Response} */
                const dataOut = new Response();
                const taskId = await procSave.exec({trx, req: dataIn});
                await trx.commit();
                // COMPOSE SUCCESS RESPONSE
                dataOut.id = taskId;
                res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                res.end(JSON.stringify({data: dataOut}));
            } catch (err) {
                trx.rollback();
                // COMPOSE FAILURE RESPONSE
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
