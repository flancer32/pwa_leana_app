const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'navig', {});
i18next.addResources('ru', 'navig', {});

const template = `
<div class="navigator">
    Navigator
</div>
`;

/**
 * Right side navigator (main).
 */
function Fl32_Leana_Front_Desk_Layout_Navigator() {
    return {
        name: 'Navigator',
        template,
        data: function () {
            return {};
        },
        methods: {},
    };
}

export default Fl32_Leana_Front_Desk_Layout_Navigator;
