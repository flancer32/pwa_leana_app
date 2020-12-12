/**
 * State for booking functionality.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Leana_Front_Pub_State_Book(spec) {
    const gateEmployeeList = spec.Fl32_Leana_Front_Shared_Gate_Employee_List$;
    const gateServiceList = spec.Fl32_Leana_Front_Shared_Gate_Service_List$;
    const gateTaskOnDate = spec.Fl32_Leana_Front_Shared_Gate_Task_OnDate$;
    const gateTimeWorkList = spec.Fl32_Leana_Front_Shared_Gate_Employee_TimeWork_List$;

    return {
        namespaced: true,
        state: {
            dateSelected: Date,
            employees: Object,
            services: Object,
            tasksOnDate: null,  // Object.<Number, Fl32_Leana_Shared_Api_Data_New_Employee_Time_Work>
            timeWork: Array,
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
            setTasksOnDate(state, data) {
                state.tasksOnDate = data;
            },
            setTimeWork(state, data) {
                state.timeWork = data;
            },
        },
        actions: {
            async loadEmployees({commit}) {
                /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Response} */
                const res = await gateEmployeeList({locale: 'ru_RU'});
                commit('setEmployees', res.items);
            },

            async loadServices({commit}) {
                /** @type {Fl32_Leana_Shared_Api_Route_Service_List_Response} */
                const res = await gateServiceList({locale: 'ru_RU'});
                commit('setServices', res.items);
            },

            async loadTimeWork({commit}, req) {
                /** @type {Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Response} */
                const res = await gateTimeWorkList(req);
                commit('setTimeWork', res.items);
            },

            async loadTasksOnDate({commit}, req) {
                /** @type {Fl32_Leana_Shared_Api_Route_Task_OnDate_Response} */
                const res = await gateTaskOnDate(req);
                commit('setTasksOnDate', res.items);
            },
        },
    };
}
