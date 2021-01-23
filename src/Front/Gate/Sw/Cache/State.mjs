/**
 * Frontend gate to  request service worker state ('/sw/cache/state' pseudo route).
 */
export default function (spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    const config = spec[DEF.DI_CONFIG]; // named singleton
    /** @type {TeqFw_Di_Container} */
    const container = spec['TeqFw_Di_Container$'];  // singleton instance
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Sw_Cache_State_Response} */
    const Response = spec['Fl32_Leana_Shared_Service_Route_Sw_Cache_State#Response'];
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    // TODO: we need to map gate to API URI
    const URL = `https://${config.web.urlBase}/sw/${DEF.SW_ROUTE_CACHE_STATE}`;

    /**
     * @param {Fl32_Leana_Shared_Service_Route_Sw_Cache_State_Request} data
     * @return {Promise<Fl32_Leana_Shared_Service_Route_Sw_Cache_State_Response|TeqFw_Core_App_Front_Gate_Response_Error>}
     * @exports Fl32_Leana_Front_Gate_Sw_Cache_State
     */
    async function Fl32_Leana_Front_Gate_Sw_Cache_State(data) {
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
            /** @type {Fl32_Leana_Shared_Service_Route_Sw_Cache_State_Response} */
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
    return Fl32_Leana_Front_Gate_Sw_Cache_State;
}

