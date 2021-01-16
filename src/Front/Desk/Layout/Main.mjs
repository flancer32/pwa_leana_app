const mapState = self.teqfw.lib.Vuex.mapState;

const template = `
<div class="layout_main">
    <div class="layer_base">
        <router-view></router-view>
    </div>
    <div class="layer_navigation">
        <navigator :key="langChange"></navigator>
    </div>
    <app-overlay></app-overlay>
    <div class="layer_notification"></div>
</div>
`;

/**
 * Main layout for authenticated users.
 */
function Fl32_Leana_Front_Desk_Layout_Main(spec) {
    /** @type {Fl32_Leana_Front_Desk_Layout_Navigator} */
    const navigator = spec['Fl32_Leana_Front_Desk_Layout_Navigator$'];   // singleton component

    return {
        name: 'LayoutMain',
        template,
        components: {navigator},
        data: function () {
            return {
                langChange: 0,
            };
        },
        computed: {
            ...mapState({
                stateAppLang: state => state.app.lang,
            }),
        },
        methods: {},
        watch: {
            stateAppLang() {
                this.langChange++;
            }
        },
    };
}

export default Fl32_Leana_Front_Desk_Layout_Main;
