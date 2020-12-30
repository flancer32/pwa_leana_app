export default function Fl32_Leana_Front_Desk_State(spec) {
    const acl = spec.Fl32_Teq_Acl_Front_State$;
    const app = spec.Fl32_Leana_Front_Desk_State_App$;
    const calendar = spec.Fl32_Leana_Front_Desk_State_Calendar$;
    return {
        namespaced: true,
        modules: {acl, app, calendar},
    };
}
