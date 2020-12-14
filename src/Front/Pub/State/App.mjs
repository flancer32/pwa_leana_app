/**
 * State for common functionality of the 'pub' realm.
 *
 * @return {Object}
 * @constructor
 */
export default function Fl32_Leana_Front_Pub_State_App() {
    return {
        namespaced: true,
        state: {
            overlay: {name: String, params: Object},
        },
        getters: {},
        mutations: {
            setOverlay(state, {name, params}) {
                state.overlay = {name, params};
            },
            resetOverlay(state) {
                state.overlay = {name: null, params: {}};
            }
        },
        actions: {},
    };
}