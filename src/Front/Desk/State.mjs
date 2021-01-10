/**
 * Aggregated state for the application.
 */
function Fl32_Leana_Front_Desk_State(spec) {
    /** @type {Fl32_Leana_Front_Desk_State_App} */
    const app = spec['Fl32_Leana_Front_Desk_State_App$'];   // singleton object
    /** @type {Fl32_Leana_Front_Desk_State_Calendar} */
    const calendar = spec['Fl32_Leana_Front_Desk_State_Calendar$'];    // singleton object
    /** @type {Fl32_Leana_Front_Desk_State_WorkTime} */
    const workTime = spec['Fl32_Leana_Front_Desk_State_WorkTime$'];    // singleton object
    /** @type {Fl32_Teq_User_Front_State} */
    const user = spec['Fl32_Teq_User_Front_State$'];   // singleton object
    return {
        namespaced: true,
        modules: {app, calendar, user, workTime},
    };
}

export default Fl32_Leana_Front_Desk_State;
