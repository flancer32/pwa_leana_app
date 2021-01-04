/**
 * State for booking functionality.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Leana_Front_Pub_State_Book(spec) {
    const gateEmployeeList = spec['Fl32_Leana_Front_Gate_Employee_List$'];  // singleton function
    const gateServiceList = spec['Fl32_Leana_Front_Gate_Service_List$'];   // singleton function
    const gateTaskOnDate = spec['Fl32_Leana_Front_Gate_Task_OnDate$']; // singleton function
    const gateTimeWorkList = spec['Fl32_Leana_Front_Gate_Employee_TimeWork_List$'];    // singleton function
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    return {
        namespaced: true,
        state: {
            dateSelected: Date,
            employees: Object,
            services: Object,
            tasksOnDate: null,  // Object.<Number, Fl32_Leana_Shared_Service_Data_Employee_TimeWork>
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
             * @param {Fl32_Leana_Shared_Service_Route_Employee_List_Request} req
             * @return {Promise<void>}
             */
            async loadEmployees({commit}, req) {
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_List_Response} */
                const res = await gateEmployeeList(req);
                if (!(res instanceof GateError)) {
                    commit('setEmployees', res.items);
                } else {
                    console.error('Service Gate Error: ' + res.message);
                }
            },

            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Service_Route_Service_List_Request} req
             * @return {Promise<void>}
             */
            async loadServices({commit}, req) {
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
                const res = await gateServiceList(req);
                if (!(res instanceof GateError)) {
                    commit('setServices', res.items);
                } else {
                    console.error('Service Gate Error: ' + res.message);
                }
            },

            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} req
             * @return {Promise<void>}
             */
            async loadTimeWork({commit}, req) {
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response} */
                const res = await gateTimeWorkList(req);
                if (!(res instanceof GateError)) {
                    commit('setTimeWork', res.items);
                } else {
                    console.error('Service Gate Error: ' + res.message);
                }
            },

            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} req
             * @return {Promise<void>}
             */
            async loadTasksOnDate({commit}, req) {
                /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Response} */
                const res = await gateTaskOnDate(req);
                if (!(res instanceof GateError)) {
                    commit('setTasksOnDate', res.items);
                } else {
                    console.error('Service Gate Error: ' + res.message);
                }
            },
        },
    };
}
