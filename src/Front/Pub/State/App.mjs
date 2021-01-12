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
            loader: {active: Boolean},
            overlay: {name: String, params: Object},
        },
        getters: {},
        mutations: {
            setLoader(state, {active}) {
                state.loader = {active};
            },
            startLoader(state) {
                state.loader.active = true;
            },
            stopLoader(state) {
                state.loader.active = false;
            },
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
