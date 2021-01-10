const EVENT_NEXT = 'actionNext';
const EVENT_PREVIOUS = 'actionPrevious';
const EVENT_SET_TIME = 'actionSetTime';

const template = `
<div>
    <action-bar :params="actions"></action-bar>
</div>
`;

function Fl32_Leana_Front_Desk_Widget_WorkTime_Actions(spec) {
    /** @type {Fl32_Leana_Front_Desk_Widget_Action_Bar} */
    const actionBar = spec['Fl32_Leana_Front_Desk_Widget_Action_Bar$$'];   // new instance
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
    const Bar = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Bar'];    // class constructor
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
    const Item = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Item'];  // class constructor

    return {
        name: 'WorkTimeActions',
        template,
        components: {
            actionBar
        },
        emits: [EVENT_PREVIOUS, EVENT_SET_TIME, EVENT_NEXT],
        computed: {
            actions() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const prev = new Item();
                prev.code = 'setTime';
                prev.func = this.actionPrevious;
                prev.icon = 'fas fa-caret-left';
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const setTime = new Item();
                setTime.code = 'setTime';
                setTime.func = this.actionSetTime;
                setTime.icon = 'fas fa-business-time';
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const next = new Item();
                next.code = 'next';
                next.func = this.actionNext;
                next.icon = 'fas fa-caret-right';
                // compose result
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
                const result = new Bar();
                result.items = {prev, setTime, next};
                return result;
            },
        },
        methods: {
            actionNext() {
                this.$emit(EVENT_NEXT);
            },
            async actionPrevious() {
                this.$emit(EVENT_PREVIOUS);
            },
            actionSetTime() {
                this.$emit(EVENT_SET_TIME);
            },
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_WorkTime_Actions;
