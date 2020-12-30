/**
 * Aggregated state for 'pub' realm.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {*}
 * @constructor
 */
export default function Fl32_Leana_Front_Pub_State(spec) {
    const acl = spec.Fl32_Teq_Acl_Front_State$;
    const app = spec.Fl32_Leana_Front_Pub_State_App$;
    const book = spec.Fl32_Leana_Front_Pub_State_Book$;

    return {
        namespaced: true,
        modules: {acl, app, book},
    };
}
