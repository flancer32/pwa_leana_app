const template = `
<div class="layout_centered">
    <router-view></router-view>
</div>
`;

/**
 * Simple layout.
 */
function Fl32_Leana_Front_Desk_Layout_Centered() {
    return {
        name: 'LayoutSimple',
        template,
        data: function () {
            return {};
        },
        methods: {},
    };
}

export default Fl32_Leana_Front_Desk_Layout_Centered;
