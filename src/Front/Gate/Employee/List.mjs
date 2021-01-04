/**
 * Frontend gate to 'employee/list' service.
 */
export default function (spec) {
    const config = spec.config; // named singleton
    /** @type {typeof Fl32_Leana_Shared_Service_Data_Employee} */
    const Employee = spec['Fl32_Leana_Shared_Service_Data_Employee#'];  // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_List_Response} */
    const Response = spec['Fl32_Leana_Shared_Service_Route_Employee_List#Response'];    // class constructor
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.web.urlBase}/api/employee/list`;

    /**
     * @param {Fl32_Leana_Shared_Service_Route_Employee_List_Request} data
     * @return {Promise<Fl32_Leana_Shared_Service_Route_Employee_List_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @exports Fl32_Leana_Front_Gate_Employee_List
     */
    async function Fl32_Leana_Front_Gate_Employee_List(data) {
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data})
            });
            const json = await res.json();
            /** @type {Fl32_Leana_Shared_Service_Route_Employee_List_Response} */
            const result = new Response();
            result.items = {};
            for (const key in json.data.items) {
                /** @type {Fl32_Leana_Shared_Service_Data_Employee} */
                const item = Object.assign(new Employee(), json.data.items[key]);
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
    return Fl32_Leana_Front_Gate_Employee_List;
}

