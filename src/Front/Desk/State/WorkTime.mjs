/**
 * State for working time related functionality.
 *
 * @return {Object}
 * @constructor
 */
function Fl32_Leana_Front_Desk_State_WorkTime(spec) {
    /** @type {Fl32_Leana_Front_Gate_Employee_WorkTime_List} */
    const gateWorkTimeList = spec['Fl32_Leana_Front_Gate_Employee_WorkTime_List$'];    // singleton function

    return {
        namespaced: true,
        state: {
            dbItems: Array,// Fl32_Leana_Shared_Service_Data_Employee_WorkTime[]
            monthCurrent: Date,
        },
        getters: {},
        mutations: {
            setDbItems(state, data) {
                state.dbItems = data;
            },
            setMonthCurrent(state, data) {
                state.monthCurrent = data;
            },
        },
        actions: {
            /**
             * @param commit
             * @param {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Request} req
             * @return {Promise<void>}
             */
            async loadDbItems({commit}, req) {
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Response} */
                const res = await gateWorkTimeList(req);
                commit('setDbItems', res.items);
            },
        },
    };
}

export default Fl32_Leana_Front_Desk_State_WorkTime;
