/**
 * Frontend gate to 'task/on_date' service.
 */
export default function (spec) {
    const config = spec.config;
    const Task = spec['Fl32_Leana_Shared_Api_Data_Task#'];
    const Response = spec['Fl32_Leana_Shared_Api_Route_Task_OnDate#Response'];

    const URL = `https://${config.web.urlBase}/api/task/on_date`;

    /**
     *
     * @param {Fl32_Leana_Shared_Api_Route_Task_OnDate_Request} data
     * @return {Promise<Fl32_Leana_Shared_Api_Route_Task_OnDate_Response>}
     * @constructor
     */
    async function Fl32_Leana_Front_Shared_Gate_Task_OnDate(data) {
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        });
        const json = await res.json();
        /** @type {Fl32_Leana_Shared_Api_Route_Task_OnDate_Response} */
        const result = new Response();
        result.items = {};
        for (const key in json.data.items) {
            /** @type {Fl32_Leana_Shared_Api_Data_Task} */
            const item = Object.assign(new Task(), json.data.items[key]);
            result.items[item.id] = item;
        }
        return result;
    }

    return Fl32_Leana_Front_Shared_Gate_Task_OnDate;
}

