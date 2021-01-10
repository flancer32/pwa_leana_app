const i18next = self.teqfw.i18next;

i18next.addResources('lv', 'routeWorkTime', {});
i18next.addResources('ru', 'routeWorkTime', {});


const template = `
<div>
    <actions
        @actionNext="onNext"
        @actionPrevious="onPrevious"
        @actionSetTime="onTimeSet"
    ></actions>
    <work-time></work-time>
</div>
`;

function Fl32_Leana_Front_Desk_Route_WorkTime(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton
    /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Actions} */
    const actions = spec['Fl32_Leana_Front_Desk_Widget_WorkTime_Actions$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime} */
    const workTime = spec['Fl32_Leana_Front_Desk_Widget_WorkTime$']; // singleton instance

    return {
        name: 'RouteWorkTime',
        template,
        components: {actions, workTime},
        data() {
            return {};
        },
        computed: {},
        methods: {
            async onNext() {
                console.log('Get data for the next month.');
            },
            async onPrevious() {
                console.log('Get data for the previous month.');
            },
            async onTimeSet() {
                console.log('Ask server to generate schedule for the next unscheduled week.');
            },
        },
        async mounted() {
            await session.redirectOnFail(this.$router, DEF.ACL_IS_EMPLOYEE);
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Route_WorkTime;
