const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'taskPreview', {});
i18next.addResources('ru', 'taskPreview', {
    actionClose: 'Закрыть',
});

const template = `
<div class="">
    <div>Do you really want to do it?</div>
    <button v-on:click="clickYes">Yes</button>
    <button v-on:click="clickNo">No</button>
</div>
`;
/**
 * Widget to preview task details in dashboard overlay.
 */
export default function Fl32_Leana_Realm_Desk_Widget_Task_Preview_Actions_Remove() {

    return {
        template,
        props: {
            params: Object,
        },
        methods: {
            async clickYes() {
                await this.params.onYes();
            },
            async clickNo() {
                await this.params.onNo();
            }
        }
    };
}
