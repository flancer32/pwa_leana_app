/**
 * Aggregated state for 'pub' realm.
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {*}
 * @constructor
 */
function Fl32_Leana_Front_Pub_State(spec) {
    /** @type {Fl32_Leana_Front_Pub_State_App} */
    const app = spec['Fl32_Leana_Front_Pub_State_App$'];    // singleton object
    /** @type {Fl32_Leana_Front_Pub_State_Book} */
    const book = spec['Fl32_Leana_Front_Pub_State_Book$'];  // singleton object
    /** @type {Fl32_Teq_User_Front_State} */
    const user = spec['Fl32_Teq_User_Front_State$'];   // singleton object

    return {
        namespaced: true,
        modules: {app, book, user},
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Pub_State;
