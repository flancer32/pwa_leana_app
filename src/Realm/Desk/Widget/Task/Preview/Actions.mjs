const app = self.teqfw.app;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const EVENT_SAVE = 'actionSave';

const template = `
<div class="task_preview_action_bar">
    <action-bar :params="actions"></action-bar>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Widget_Task_Preview_Actions(spec) {
    /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Bar} */
    const actionBar = spec.Fl32_Leana_Realm_Desk_Widget_Action_Bar$$;   // new instance
    const Bar = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Bar'];
    const Item = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Item'];
    const popupYesNo = spec.Fl32_Leana_Realm_Desk_Widget_Task_Preview_Actions_Remove$$;  // new instance

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
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Item} */
                const remove = new Item();
                remove.code = 'remove';
                remove.func = this.actionRemove;
                remove.icon = 'far fa-calendar-minus';
                remove.title = 'removeTitle';
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Item} */
                const save = new Item();
                save.code = 'save';
                save.func = this.actionSave;
                save.icon = 'fas fa-cloud-upload-alt';
                save.title = 'saveTitle';
                // compose result
                /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Bar} */
                const result = new Bar();
                result.items = {remove, save};
                return result;
            },
            ...mapState({
                taskSelected: state => state.calendar.taskSelected,
            })
        },
        methods: {
            actionRemove() {
                const me = this;
                const storedTask = this.taskSelected;

                async function onNo() {
                    me.resetOverlay();
                }

                async function onYes() {
                    /**
                     * Send API request to remove task on server.
                     * @return {Promise<any>}
                     */
                    async function removeTask(taskId) {
                        const res = await fetch('../api/book/remove', {
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
        }
    };
}
