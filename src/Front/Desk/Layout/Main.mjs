const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'navig', {});
i18next.addResources('ru', 'navig', {});

const template = `
<div id="layout_main">
    <div id="layer_base">
        <main>
            <router-view></router-view>
        </main>
    </div>
    <div id="layer_status_bar">
        <app-status-bar></app-status-bar>
    </div>
    <div id="layer_side_bar"></div>
    <app-overlay></app-overlay>
    <div id="layer_notification"></div>
</div>
`;

/**
 * Right side navigator (main).
 */
function Fl32_Leana_Front_Desk_Layout_Main() {
    return {
        name: 'LayoutMain',
        template,
        data: function () {
            return {};
        },
        methods: {},
    };
}

export default Fl32_Leana_Front_Desk_Layout_Main;
