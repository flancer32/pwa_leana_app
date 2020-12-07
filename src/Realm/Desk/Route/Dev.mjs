/**
 * Special route to develop widgets.
 */
const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'route-about', {});
i18next.addResources('ru', 'route-about', {});

const template = `
<div style="min-width: 80%; margin: auto; height: 300px;">
<!--    <task-edit :params="params"></task-edit>-->
    <date-time-picker
        :yearMin="2020"
        :yearMax="2021"
        :hourMin="9"
        :hourMax="20"
        :minsStep="30"
    ></date-time-picker>
<!--    <scroller-vertical-->
<!--        :items="getScrollerItems()"-->
<!--    ></scroller-vertical>-->
</div>`;

export default function Fl32_Leana_Realm_Desk_Route_Dev(spec) {
    // inject dependencies first
    const Task = spec['Fl32_Leana_Realm_Desk_Widget_Api_Task#'];
    const wgDateTimePicker = spec.Fl32_Leana_Realm_Shared_Widget_DateTimePicker$;
    const wgScrollerVertical = spec.Fl32_Leana_Realm_Shared_Widget_Scroller_Vertical$;
    const wgTaskEdit = spec.Fl32_Leana_Realm_Desk_Widget_Task_Edit$;

    // other activity
    return {
        template,
        components: {
            dateTimePicker: wgDateTimePicker,
            scrollerVertical: wgScrollerVertical,
            taskEdit: wgTaskEdit,
        },
        data: function () {
            return {
                params: new Task()
            };
        },
        methods: {
            getScrollerItems() {
                const items = [];
                for (let i = 2020; i <= 2030; i++) {
                    items.push({key: i, value: i});
                }
                return items;
            },
        },
    };
}
