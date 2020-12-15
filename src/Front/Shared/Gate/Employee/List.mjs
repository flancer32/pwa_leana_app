/**
 * Frontend gate to 'employee/list' service.
 */
export default function (spec) {
    const config = spec.config;
    const Employee = spec['Fl32_Leana_Shared_Api_Data_Employee#'];
    const Response = spec['Fl32_Leana_Shared_Api_Route_Employee_List#Response'];

    const URL = `https://${config.web.urlBase}/api/employee/list`;

    return async function Fl32_Leana_Front_Shared_Gate_Employee_List(data) {
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        });
        const json = await res.json();
        /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Response} */
        const result = new Response();
        result.items = {};
        for (const key in json.data.items) {
            /** @type {Fl32_Leana_Shared_Api_Data_Employee} */
            const item = Object.assign(new Employee(), json.data.items[key]);
            result.items[item.id] = item;
        }
        return result;
    };

}

