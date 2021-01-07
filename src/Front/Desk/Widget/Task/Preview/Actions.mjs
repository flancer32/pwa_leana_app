const app = self.teqfw.app;
const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const EVENT_SAVE = 'actionSave';

i18next.addResources('lv', 'previewAct', {
    removeConfirm: 'Vai tiešām vēlaties dzēst ierakstu?',
});
i18next.addResources('ru', 'previewAct', {
    removeConfirm: 'Вы действительно хотите удалить запись?',
});

const template = `
<div class="task_preview_action_bar">
    <action-bar :params="actions"></action-bar>
</div>
`;

/**
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {*}
 */
function Fl32_Leana_Front_Desk_Widget_Task_Preview_Actions(spec) {
    /** @type {Fl32_Leana_Front_Desk_Widget_Action_Bar} */
    const actionBar = spec['Fl32_Leana_Front_Desk_Widget_Action_Bar$$'];   // new instance
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Bar} */
    const Bar = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Bar'];    // class constructor
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
    const Item = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Item'];  // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
    const TaskOnDateRequest = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request']; // class constructor
    /** @type {Fl32_Leana_Front_Shared_Widget_Dialog_YesNo} */
    const dialogYesNo = spec['Fl32_Leana_Front_Shared_Widget_Dialog_YesNo$'];  // singleton instance

    // add components being used in overlay to application
    app.component('popupYesNo', dialogYesNo);    // rewrite component's name with 'popupYesNo'

    return {
        template,
        components: {
            actionBar
        },
        emits: [EVENT_SAVE],
        computed: {
            actions() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
                const remove = new Item();
                remove.code = 'remove';
                remove.func = this.actionCancel;
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
                stateCalendarDateSelected: state => state.calendar.dateSelected,
                stateCalendarTaskSelected: state => state.calendar.taskSelected,
            })
        },
        methods: {
            actionCancel() {
                const me = this;
                // data from Vuex is not transmitted into 'onYes' handler, close it here.
                const storedTask = this.stateCalendarTaskSelected;
                const storedDate = this.stateCalendarDateSelected;

                async function onNo() {
                    me.resetOverlay();
                }

                async function onYes() {
                    /**
                     * Send API request to remove task on server.
                     * @return {Promise<any>}
                     */
                    async function removeTask(taskId) {
                        const res = await fetch('../api/task/cancel', {
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
                    /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
                    const req = new TaskOnDateRequest();
                    req.date = storedDate;
                    me.loadTasksOnDate(req);
                }

                // use 'popupYesNo' as component name (see "app.component('popupYesNo', dialogYesNo)")
                const message = this.$t('previewAct:removeConfirm');
                this.setOverlay({name: 'popupYesNo', params: {message, onYes, onNo}});
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

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_Task_Preview_Actions;
