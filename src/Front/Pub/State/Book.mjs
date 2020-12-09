/**
 * State for booking functionality.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Leana_Front_Pub_State_Book(spec) {
    const gateEmployeeList = spec.Fl32_Leana_Front_Shared_Gate_Employee_List$;
    const gateServiceList = spec.Fl32_Leana_Front_Shared_Gate_Service_List$;

    return {
        namespaced: true,
        state: {
            dateSelected: Date,
            employees: Object,
            services: Object,
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
        },
        actions: {
            async loadEmployees({commit}) {
                const res = await gateEmployeeList({locale: 'ru_RU'});
                commit('setEmployees', res.items);
            },

            async loadServices({commit}) {
                const res = await gateServiceList({locale: 'ru_RU'});
                commit('setServices', res.items);
            },
        },
    };
}
