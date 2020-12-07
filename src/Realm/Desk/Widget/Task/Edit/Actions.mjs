const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const template = `
<div class="task_edit_action_bar">
    <action-bar :params="actions"></action-bar>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Widget_Task_Edit_Actions(spec) {
    /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Bar} */
    const actionBar = spec.Fl32_Leana_Realm_Desk_Widget_Action_Bar$$;   // new instance
    const Bar = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Bar'];
    const Item = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Item'];

    return {
        template,
        components: {
            actionBar
        },
        computed: {
            actions() {
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Item} */
                const save = new Item();
                save.code = 'save';
                save.func = this.actionSave;
                save.icon = 'fas fa-cloud-upload-alt';
                save.title = 'saveTitle';
                // compose result
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Bar} */
                const result = new Bar();
                result.items = {save};
                return result;
            },
            ...mapState({
                taskSelected: state => state.calendar.taskSelected,
            })
        },
        methods: {
            actionSave() {
                console.log('Save action is fired.');
            },
            ...mapMutations('app', [
                'setOverlay',
                'resetOverlay',
            ]),
        }
    };
}
