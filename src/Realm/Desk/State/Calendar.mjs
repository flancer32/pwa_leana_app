/**
 * State for calendar related functionality.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Leana_Realm_Desk_State_Calendar(spec) {
    const Task = spec['Fl32_Leana_Realm_Desk_Widget_Api_Task#'];

    return {
        namespaced: true,
        state: {
            dateSelected: Date,
            taskSelected: Task,
        },
        getters: {},
        mutations: {
            setDateSelected(state, data) {
                state.dateSelected = data;
            },
            setTaskSelected(state, data) {
                state.taskSelected = data;
            },
        },
        actions: {},
    };
}
