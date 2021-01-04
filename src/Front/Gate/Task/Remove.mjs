/**
 * Frontend gate to 'task/remove' service.
 */
export default function (spec) {
    const config = spec.config; // named singleton
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Remove_Response} */
    const Response = spec['Fl32_Leana_Shared_Service_Route_Task_Remove#Response'];
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.web.urlBase}/api/task/remove`;

    /**
     * @param {Fl32_Leana_Shared_Service_Route_Task_Remove_Request} data
     * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_Remove_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @exports Fl32_Leana_Front_Gate_Task_Remove
     */
    async function Fl32_Leana_Front_Gate_Task_Remove(data) {
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
            });
            const json = await res.json();
            /** @type {Fl32_Leana_Shared_Service_Route_Task_Remove_Response} */
            const result = new Response();
            Object.assign(result, json);
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
    return Fl32_Leana_Front_Gate_Task_Remove;
}

