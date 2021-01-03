export default function Fl32_Leana_Front_Desk_State(spec) {
    const app = spec.Fl32_Leana_Front_Desk_State_App$;
    const calendar = spec.Fl32_Leana_Front_Desk_State_Calendar$;
    const user = spec.Fl32_Teq_User_Front_State$;
    return {
        namespaced: true,
        modules: {app, calendar, user},
    };
}
