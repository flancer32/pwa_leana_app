const mapMutations = self.teqfw.lib.Vuex.mapMutations;

const template = `
<div id="layer_overlay">
    <div class="layer_overlay_close" v-on:click="resetOverlay">
        <i class="far fa-times-circle fa-2x filter-top-fg"></i>  
    </div>
    <div class="layer_overlay_content">
        <component :is="currentComponent" :params="params"></component>
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Layout_Overlay() {

    return {
        template,
        props: {
            name: String,    // name of the component to display in popup
        },
        data: function () {
            return {};
        },
        computed: {
            currentComponent() {
                const overlay = this.$store.state.app.overlay;
                let name = overlay.name;
                if (!self.teqfw.app._context.components[name]) {
                    name = null;
                } else {
                    this.show();
                }
                return name;
            },
            params() {
                const overlay = this.$store.state.app.overlay;
                let name = overlay.name;
                if (!self.teqfw.app._context.components[name]) {
                    this.hideOverlay();
                    if (typeof name === 'string') {
                        console.log(`Cannot use component with name '${name}' in overlay.`);
                    }
                    return null;
                } else {
                    return overlay.params;
                }
            }
        },
        methods: {
            close() {
                this.resetOverlay();
            },
            hideOverlay() {
                const elOverlay = self.document.querySelector('#layer_overlay');
                if (elOverlay) {
                    elOverlay.style.visibility = 'hidden';
                    elOverlay.style.opacity = '0';
                }
                const elBase = self.document.querySelector('#layer_base');
                if (elBase) {
                    elBase.style.overflow = 'scroll';
                }
            },
            show() {
                const elBase = self.document.querySelector('#layer_base');
                elBase.style.overflow = 'hidden';
                const elOverlay = self.document.querySelector('#layer_overlay');
                elOverlay.style.visibility = 'visible';
                elOverlay.style.opacity = '1';
            },
            ...mapMutations('app', [
                'resetOverlay'
            ]),
        },
    };
}
