/**
 * Frontend gate to 'service/list' service.
 */
export default function (spec) {
    const config = spec.config;
    const Service = spec['Fl32_Leana_Shared_Service_Data_Service#'];
    const Response = spec['Fl32_Leana_Shared_Service_Route_Service_List#Response'];

    const URL = `https://${config.web.urlBase}/api/service/list`;

    return async function Fl32_Leana_Front_Service_Service_List(data) {
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        });
        const json = await res.json();
        /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
        const result = new Response();
        result.items = {};
        for (const key in json.data.items) {
            /** @type {Fl32_Leana_Shared_Service_Data_Service} */
            const item = Object.assign(new Service(), json.data.items[key]);
            result.items[item.id] = item;
        }
        return result;
    };

}

