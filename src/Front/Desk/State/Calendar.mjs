/**
 * State for calendar related functionality.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Leana_Front_Desk_State_Calendar(spec) {
    const gateEmployeeList = spec.Fl32_Leana_Front_Shared_Gate_Employee_List$;
    const gateServiceList = spec.Fl32_Leana_Front_Shared_Gate_Service_List$;
    const gateTaskOnDate = spec.Fl32_Leana_Front_Shared_Gate_Task_OnDate$;
    const Task = spec['Fl32_Leana_Front_Desk_Widget_Api_Task#'];

    return {
        namespaced: true,
        state: {
            dateSelected: Date,
            employees: Object,
            services: Object,
            taskSelected: Task,
            tasksOnDate: Object,  // Object.<Number, Fl32_Leana_Shared_Api_Data_Task>
        },
        getters: {},
        mutations: {
            setDateSelected(state, data) {
                state.dateSelected = data;
            },
            setEmployees(state, data) {
                state.employees = data;
            },
            setServices(state, data) {
                state.services = data;
            },
            setTaskSelected(state, data) {
                state.taskSelected = data;
            },
            setTasksOnDate(state, data) {
                state.tasksOnDate = data;
            },
        },
        actions: {
            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Api_Route_Employee_List_Request} req
             * @return {Promise<void>}
             */
            async loadEmployees({commit}, req) {
                /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Response} */
                const res = await gateEmployeeList(req);
                commit('setEmployees', res.items);
            },
            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Api_Route_Service_List_Request} req
             * @return {Promise<void>}
             */
            async loadServices({commit}, req) {
                /** @type {Fl32_Leana_Shared_Api_Route_Service_List_Response} */
                const res = await gateServiceList(req);
                commit('setServices', res.items);
            },
            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Api_Route_Task_OnDate_Request} req
             * @return {Promise<void>}
             */
            async loadTasksOnDate({commit}, req) {
                /** @type {Fl32_Leana_Shared_Api_Route_Task_OnDate_Response} */
                const res = await gateTaskOnDate(req);
                commit('setTasksOnDate', res.items);
            },
        },
    };
}
