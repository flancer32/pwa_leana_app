/**
 * Frontend gate to 'employee/time_work/list' service.
 */
export default function (spec) {
    const config = spec.config;
    const TimeWork = spec['Fl32_Leana_Shared_Api_Data_New_Employee_Time_Work#'];
    const Response = spec['Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List#Response'];

    const URL = `https://${config.web.urlBase}/api/employee/time_work/list`;

    return async function Fl32_Leana_Front_Shared_Gate_Employee_TimeWork_List(data) {
        const res = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data})
        });
        const json = await res.json();
        /** @type {Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Response} */
        const result = new Response();
        result.items = [];
        for (const one of json.data.items) {
            /** @type {Fl32_Leana_Shared_Api_Data_New_Employee_Time_Work} */
            const item = Object.assign(new TimeWork(), one);
            result.items.push(item);
        }
        return result;
    };

}

