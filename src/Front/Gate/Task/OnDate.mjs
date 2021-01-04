/**
 * Frontend gate to 'task/on_date' service.
 */
export default function (spec) {
    const config = spec.config; // named singleton
    /** @type {typeof Fl32_Leana_Shared_Service_Data_Task} */
    const Task = spec['Fl32_Leana_Shared_Service_Data_Task#'];
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_OnDate_Response} */
    const Response = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Response'];
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.web.urlBase}/api/task/onDate`;

    /**
     * @param {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} data
     * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_OnDate_Response>}
     * @exports Fl32_Leana_Front_Gate_Task_OnDate
     */
    async function Fl32_Leana_Front_Gate_Task_OnDate(data) {
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
            });
            const json = await res.json();
            /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Response} */
            const result = new Response();
            result.items = {};
            for (const key in json.data.items) {
                /** @type {Fl32_Leana_Shared_Service_Data_Task} */
                const item = Object.assign(new Task(), json.data.items[key]);
                result.items[item.id] = item;
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
    return Fl32_Leana_Front_Gate_Task_OnDate;
}

