/**
 * Frontend gate to 'task/list/own' service.
 */
export default function (spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    const config = spec[DEF.DI_CONFIG]; // named singleton
    /** @type {TeqFw_Di_Container} */
    const container = spec['TeqFw_Di_Container$'];  // singleton instance
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_List_Own_Response} */
    const Response = spec['Fl32_Leana_Shared_Service_Route_Task_List_Own#Response'];  // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Data_Task} */
    const DTask = spec['Fl32_Leana_Shared_Service_Data_Task#']; // class constructor
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.web.urlBase}/api/task/list/own`;

    /**
     * @param {Fl32_Leana_Shared_Service_Route_Task_List_Own_Request} data
     * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_List_Own_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @exports Fl32_Leana_Front_Gate_Task_List_Own
     */
    async function Fl32_Leana_Front_Gate_Task_List_Own(data) {
        try {
            const store = await container.get(DEF.DI_STORE); // named singleton
            store.commit('app/startLoader');
            const res = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
            });
            store.commit('app/stopLoader');
            const json = await res.json();
            let result;
            if (json.data) {
                // normal result
                /** @type {Fl32_Leana_Shared_Service_Route_Task_List_Own_Response} */
                result = new Response();
                const items = [];
                for (const one of Object.values(json.data.items)) {
                    /** @type {Fl32_Leana_Shared_Service_Data_Task} */
                    const item = Object.assign(new DTask(), one);
                    item.dateBook = new Date(item.dateBook);
                    item.dateCreated = new Date(item.dateCreated);
                    items.push(item);
                }
                result.items = items;
            } else {
                // business error
                result = new GateError();
                result.message = 'Unknown business error.';
                if (json.error) {
                    result.error = Object.assign({}, json.error);
                    if (json.error.sqlMessage) result.message = json.error.sqlMessage;
                }

            }
            return result;
        } catch (e) {
            // infrastructure error
            const result = new GateError();
            result.error = Object.assign({}, e);
            if (e.message) result.message = e.message;
            return result;
        }
    }

    // We should place function separately to allow JSDoc & IDEA hints & navigation.
    return Fl32_Leana_Front_Gate_Task_List_Own;
}

