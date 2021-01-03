/**
 * Aggregated state for 'pub' realm.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {*}
 * @constructor
 */
export default function Fl32_Leana_Front_Pub_State(spec) {
    const app = spec.Fl32_Leana_Front_Pub_State_App$;
    const book = spec.Fl32_Leana_Front_Pub_State_Book$;
    const user = spec.Fl32_Teq_User_Front_State$;

    return {
        namespaced: true,
        modules: {app, book, user},
    };
}
