const app = self.teqfw.app;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

const template = `
<div class="calendar_action_bar">
    <action-bar :params="actions"></action-bar>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Widget_Calendar_ActionBar(spec) {
    const Bar = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Bar'];
    const Item = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Item'];
    const wgActionBar = spec.Fl32_Leana_Realm_Desk_Widget_Action_Bar$;    // singleton
    const wgSetDate = spec.Fl32_Leana_Realm_Desk_Widget_Calendar_SetDate$;    // singleton
    const wgTaskEdit = spec.Fl32_Leana_Realm_Desk_Widget_Task_Edit$;    // singleton

    // add globally used components (accessible from other components)
    app.component('calendarSetDate', wgSetDate);
    app.component('taskEdit', wgTaskEdit);

    return {
        template,
        components: {
            actionBar: wgActionBar
        },
        computed: {
            actions() {
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Item} */
                const add = new Item();
                add.code = 'add';
                add.func = this.actionAddTask;
                add.icon = 'far fa-calendar-plus';
                add.title = 'addTitle';
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Item} */
                const setDate = new Item();
                setDate.code = 'setDate';
                setDate.func = this.actionSetDate;
                setDate.icon = 'fas fa-calendar-day';
                setDate.title = 'setDateTitle';
                // compose result
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Bar} */
                const result = new Bar();
                result.items = {add, setDate};
                return result;
            }
        },
        methods: {
            actionAddTask() {
                this.setOverlay({name: 'taskEdit', params: {}});
            },
            actionSetDate() {
                this.setOverlay({name: 'calendarSetDate', params: {}});
            },
            ...mapMutations('app', [
                'setOverlay'
            ]),
        }
    };
}
