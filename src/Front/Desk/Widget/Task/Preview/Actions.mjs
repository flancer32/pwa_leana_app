const app = self.teqfw.app;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const EVENT_SAVE = 'actionSave';

const template = `
<div class="task_preview_action_bar">
    <action-bar :params="actions"></action-bar>
</div>
`;
/**
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {*}
 * @constructor
 */
export default function Fl32_Leana_Front_Desk_Widget_Task_Preview_Actions(spec) {
    /** @type {Fl32_Leana_Front_Desk_Widget_Action_Bar} */
    const actionBar = spec.Fl32_Leana_Front_Desk_Widget_Action_Bar$$;   // new instance
    const Bar = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Bar'];    // class constructor
    const Item = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Item'];  // class constructor
    const TaskOnDateRequest = spec['Fl32_Leana_Shared_Api_Route_Task_OnDate#Request']; // class constructor
    const popupYesNo = spec.Fl32_Leana_Front_Desk_Widget_Task_Preview_Actions_Remove$$;  // new instance

    // add components being used in overlay to application
    app.component('popupYesNo', popupYesNo);

    return {
        template,
        components: {
            actionBar
        },
        emits: ['actionSave', 'actionRemove'],
        computed: {
            actions() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const remove = new Item();
                remove.code = 'remove';
                remove.func = this.actionRemove;
                remove.icon = 'far fa-calendar-minus';
                remove.title = 'removeTitle';
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const save = new Item();
                save.code = 'save';
                save.func = this.actionSave;
                save.icon = 'fas fa-cloud-upload-alt';
                save.title = 'saveTitle';
                // compose result
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
                const result = new Bar();
                result.items = {remove, save};
                return result;
            },
            ...mapState({
                dateSelected: state => state.calendar.dateSelected,
                taskSelected: state => state.calendar.taskSelected,
            })
        },
        methods: {
            actionRemove() {
                const me = this;
                // data from Vuex is not transmitted into handlers, pin it here.
                const storedTask = this.taskSelected;
                const storedDate = this.dateSelected;

                async function onNo() {
                    me.resetOverlay();
                }

                async function onYes() {
                    /**
                     * Send API request to remove task on server.
                     * @return {Promise<any>}
                     */
                    async function removeTask(taskId) {
                        const res = await fetch('../api/task/remove', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({data: {taskId}})
                        });
                        return await res.json();
                    }

                    // we cannot use 'me.taskSelected.id' here, we need to pin stored task before
                    const taskId = storedTask.id;
                    const res = await removeTask(taskId);
                    console.log(`Remove task operation is completed: ${JSON.stringify(res)}`);
                    me.resetOverlay();
                    /** @type {Fl32_Leana_Shared_Api_Route_Task_OnDate_Request} */
                    const req = new TaskOnDateRequest();
                    req.date = storedDate;
                    me.loadTasksOnDate(req);
                }

                this.setOverlay({name: 'popupYesNo', params: {onYes, onNo}});
            },
            actionSave() {
                this.$emit(EVENT_SAVE);
            },
            ...mapMutations('app', [
                'setOverlay',
                'resetOverlay',
            ]),
            ...mapActions({
                loadTasksOnDate: 'calendar/loadTasksOnDate',
            }),
        }
    };
}
