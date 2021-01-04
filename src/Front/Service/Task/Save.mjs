/**
 * Frontend gate to 'task/save' service.
 */
export default function (spec) {
    const config = spec.config;
    const Response = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Response'];

    const URL = `https://${config.web.urlBase}/api/task/save`;

    /**
     *
     * @param {Fl32_Leana_Shared_Service_Route_Task_Save_Request} data
     * @return {Promise<Fl32_Leana_Shared_Service_Route_Task_Save_Response>}
     * @constructor
     */
    async function Fl32_Leana_Front_Service_Task_Save(data) {
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        });
        const json = await res.json();
        /** @type {Fl32_Leana_Shared_Service_Route_Task_Save_Response} */
        const result = new Response();
        Object.assign(result, json);
        return result;
    }

    return Fl32_Leana_Front_Service_Task_Save;
}

