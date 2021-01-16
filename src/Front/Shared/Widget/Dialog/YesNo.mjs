const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'dialog', {
    no: 'Nē',
    yes: 'Jā',
});
i18next.addResources('ru', 'dialog', {
    no: 'Нет',
    yes: 'Да',
});

const template = `
<div class="dialog-yes-no">
    <div class="dialog-yes-no_message">{{getMessage}}</div>
    <div class="dialog-yes-no_actions">
        <button v-on:click="actYes">{{$t('dialog:yes')}}</button>
        <button v-on:click="actNo">{{$t('dialog:no')}}</button>
    </div>
</div>
`;

/**
 * Library component: yes/no dialog to use in overlay.
 */
function Fl32_Leana_Front_Shared_Widget_Dialog_YesNo() {

    return {
        name: 'DialogYesNo',
        template,
        props: {
            params: {
                message: String,
                onNo: Function,
                onYes: Function,
            }
        },
        computed: {
            getMessage() {
                return (this.params && this.params.message) ?? 'Set \'params.message\' to display text here.';
            }
        },
        methods: {
            async actYes() {
                if (this.params && (typeof this.params.onYes === 'function')) {
                    await this.params.onYes();
                }
            },
            async actNo() {
                if (this.params && (typeof this.params.onNo === 'function')) {
                    await this.params.onNo();
                }
            }
        },
    };
}

export default Fl32_Leana_Front_Shared_Widget_Dialog_YesNo;
