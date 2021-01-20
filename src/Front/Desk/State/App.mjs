/**
 * State for common functionality of the 'desk' realm.
 *
 * @return {Object}
 * @constructor
 */
function Fl32_Leana_Front_Desk_State_App() {
    return {
        namespaced: true,
        state: {
            lang: 'lv-LV',
            loader: {active: Boolean},
            overlay: {name: String, params: Object},
            title: 'Leana Desk',
        },
        getters: {},
        mutations: {
            resetOverlay(state) {
                state.overlay = {name: null, params: {}};
            },
            setLang(state, payload) {
                state.lang = payload;
            },
            setLoader(state, {active}) {
                state.loader = {active};
            },
            setOverlay(state, {name, params}) {
                state.overlay = {name, params};
            },
            setTitle(state, payload) {
                self.document.title = payload;
                state.title = payload;
            },
            startLoader(state) {
                state.loader.active = true;
            },
            stopLoader(state) {
                state.loader.active = false;
            },
        },
        actions: {},
    };
}

export default Fl32_Leana_Front_Desk_State_App;
