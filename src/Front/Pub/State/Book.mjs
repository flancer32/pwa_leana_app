/**
 * State for booking functionality.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Leana_Front_Pub_State_Book(spec) {
    const gateEmployeeList = spec.Fl32_Leana_Front_Shared_Gate_Employee_List$;
    const gateServiceList = spec.Fl32_Leana_Shared_Service_Gate_Service_List$;
    const gateTaskOnDate = spec.Fl32_Leana_Front_Shared_Gate_Task_OnDate$;
    const gateTimeWorkList = spec.Fl32_Leana_Front_Shared_Gate_Employee_TimeWork_List$;

    return {
        namespaced: true,
        state: {
            dateSelected: Date,
            employees: Object,
            services: Object,
            tasksOnDate: null,  // Object.<Number, Fl32_Leana_Shared_Api_Data_Employee_Time_Work>
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
             * @param {Fl32_Leana_Shared_Service_Route_Service_List_Request} req
             * @return {Promise<void>}
             */
            async loadServices({commit}, req) {
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
                const res = await gateServiceList(req);
                commit('setServices', res.items);
            },

            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Request} req
             * @return {Promise<void>}
             */
            async loadTimeWork({commit}, req) {
                /** @type {Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Response} */
                const res = await gateTimeWorkList(req);
                commit('setTimeWork', res.items);
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
