const EVENT_SAVE = 'actionSave';

const template = `
<div>
    <action-bar :params="actions"></action-bar>
</div>
`;

function Fl32_Leana_Front_Desk_Widget_WorkTime_Edit_Actions(spec) {
    /** @type {Fl32_Leana_Front_Desk_Widget_Action_Bar} */
    const actionBar = spec['Fl32_Leana_Front_Desk_Widget_Action_Bar$$'];   // new instance
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
    const Bar = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Bar'];    // class constructor
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
    const Item = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Item'];  // class constructor

    return {
        name: 'WorkTimeEditActions',
        template,
        components: {
            actionBar
        },
        emits: [EVENT_SAVE],
        computed: {
            actions() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const save = new Item();
                save.code = 'save';
                save.func = this.actionSave;
                save.icon = 'fas fa-cloud-upload-alt';
                // compose result
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
                const result = new Bar();
                result.items = {save};
                return result;
            },
        },
        methods: {
            actionSave() {
                this.$emit(EVENT_SAVE);
            },
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_WorkTime_Edit_Actions;
