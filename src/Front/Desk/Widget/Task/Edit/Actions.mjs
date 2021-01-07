const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const EVENT_ADD = 'actionAdd';

const template = `
<div class="task_edit_action_bar">
    <action-bar :params="actions"></action-bar>
</div>
`;

export default function Fl32_Leana_Front_Desk_Widget_Task_Edit_Actions(spec) {
    /** @type {Fl32_Leana_Front_Desk_Widget_Action_Bar} */
    const actionBar = spec['Fl32_Leana_Front_Desk_Widget_Action_Bar$$'];   // new instance
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
    const Bar = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Bar'];    // class constructor
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
    const Item = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Item'];  // class constructor

    return {
        template,
        components: {
            actionBar
        },
        emits: ['actionAdd'],
        computed: {
            actions() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const save = new Item();
                save.code = 'save';
                save.func = this.actionAdd;
                save.icon = 'fas fa-cloud-upload-alt';
                save.title = 'saveTitle';
                // compose result
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
                const result = new Bar();
                result.items = {save};
                return result;
            },
            ...mapState({
                taskSelected: state => state.calendar.taskSelected,
            })
        },
        methods: {
            actionAdd() {
                this.$emit(EVENT_ADD);
            },
            ...mapMutations('app', [
                'setOverlay',
                'resetOverlay',
            ]),
        }
    };
}
