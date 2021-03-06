/**
 * Frontend gate to 'service/list' service.
 */
export default function (spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    const config = spec[DEF.DI_CONFIG]; // named singleton
    /** @type {TeqFw_Di_Container} */
    const container = spec['TeqFw_Di_Container$'];  // singleton instance
    /** @type {typeof Fl32_Leana_Shared_Service_Data_Service} */
    const Service = spec['Fl32_Leana_Shared_Service_Data_Service#']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Service_List_Response} */
    const Response = spec['Fl32_Leana_Shared_Service_Route_Service_List#Response']; // class constructor
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.web.urlBase}/api/${DEF.API_ROUTE_SRV_LIST}`;

    /**
     * We should place function separately to allow JSDoc & IDEA hints & navigation.
     *
     * @param {Fl32_Leana_Shared_Service_Route_Service_List_Request} data
     * @return {Promise<Fl32_Leana_Shared_Service_Route_Service_List_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @exports Fl32_Leana_Front_Gate_Service_List
     */
    async function Fl32_Leana_Front_Gate_Service_List(data) {
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
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
                result = new Response();
                result.items = {};
                for (const one of Object.values(json.data.items)) {
                    /** @type {Fl32_Leana_Shared_Service_Data_Service} */
                    const item = Object.assign(new Service, one);
                    result.items[item.id] = item;
                }
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
    return Fl32_Leana_Front_Gate_Service_List;
}
