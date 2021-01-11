const mapState = self.teqfw.lib.Vuex.mapState;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

const template = `
<div class="teq_ui_loader" v-on:click="onClick()">
    <div class="filter-darkest" v-show="loading"><img :src="srcLoader"></div>
    <div class="filter-darkest" v-show="!loading"><img :src="srcCircle"></div>
</div>
`;

/**
 * Async loader widget.
 * @param spec
 * @return {Object}
 */
function Fl32_Leana_Front_Shared_Widget_Loader(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    const config = spec[DEF.DI_CONFIG]; // named singleton

    const EVENT_FORCE = 'forceLoading';

    return {
        name: 'Loader',
        template,
        components: {},
        data: function () {
            return {};
        },
        props: {},
        computed: {
            loading() {
                return (this.stateAppLoader && this.stateAppLoader.active === true);
            },
            srcCircle() {
                return `//${config.web.urlBase}/img/icon/circle.svg`;
            },
            srcLoader() {
                return `//${config.web.urlBase}/img/icon/loader.svg`;
            },
            ...mapState({
                stateAppLoader: state => state.app.loader,
            }),
        },
        methods: {
            onClick() {
                if (this.loading) {
                    // this.stateSetLoader({active: false});
                    this.stateStopLoader();
                } else {
                    // this.stateSetLoader({active: true});
                    this.stateStartLoader();
                }
                this.$emit(EVENT_FORCE);
            },
            ...mapMutations({
                stateSetLoader: 'app/setLoader',
                stateStartLoader: 'app/startLoader',
                stateStopLoader: 'app/stopLoader',
            }),
        },
        emits: [EVENT_FORCE],
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Shared_Widget_Loader;
