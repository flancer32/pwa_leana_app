const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'routeWorkTime', {});
i18next.addResources('ru', 'routeWorkTime', {});


const template = `
<div>
    <actions
        @actionNext="onNext"
        @actionPrevious="onPrevious"
        @actionSetTime="onTimeSet"
    ></actions>
    <div class="layout_centered">
        <work-time></work-time>
    </div>
</div>
`;

function Fl32_Leana_Front_Desk_Route_WorkTime(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];  // singleton instance
    /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Actions} */
    const actions = spec['Fl32_Leana_Front_Desk_Widget_WorkTime_Actions$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime} */
    const workTime = spec['Fl32_Leana_Front_Desk_Widget_WorkTime$']; // singleton instance
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Request} */
    const WorkTimeListReq = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List#Request']; // class constructor


    return {
        name: 'RouteWorkTime',
        template,
        components: {actions, workTime},
        data() {
            return {};
        },
        computed: {
            ...mapState({
                stateWorkTimeMonthCurrent: state => state.workTime.monthCurrent,
            })
        },
        methods: {
            getMonth() {
                let result = new Date();
                if (this.stateWorkTimeMonthCurrent instanceof Date) {
                    result = this.stateWorkTimeMonthCurrent;
                } else {
                    // force day of the month & time (YYYY/MM/01 00:00:00 UTC)
                    result.setUTCDate(1);
                    result.setUTCHours(0, 0, 0, 0);
                    this.setStateWorkTimeMonthCurrent(result);
                }
                return result;
            },
            async onNext() {
                const month = (typeof this.stateWorkTimeMonthCurrent.getTime === 'function')
                    ? new Date(this.stateWorkTimeMonthCurrent.getTime())
                    : new Date();
                month.setUTCMonth(month.getUTCMonth() + 1);
                this.setStateWorkTimeMonthCurrent(month);
                await this.requestWorkTime();
            },
            async onPrevious() {
                const month = (typeof this.stateWorkTimeMonthCurrent.getTime === 'function')
                    ? new Date(this.stateWorkTimeMonthCurrent.getTime())
                    : new Date();
                month.setUTCMonth(month.getUTCMonth() - 1);
                this.setStateWorkTimeMonthCurrent(month);
                await this.requestWorkTime();
            },
            async onTimeSet() {
                console.log('Ask server to generate schedule for the next unscheduled week.');
            },
            async requestWorkTime() {
                try {
                    const month = this.getMonth();
                    const {dateFirst, dateLast} = utilDate.getMonthWidgetData(month);
                    const req = new WorkTimeListReq();
                    req.dateBegin = dateFirst;
                    req.dateEnd = dateLast;
                    this.loadDbItems(req);
                } catch (e) {
                    console.error('Cannot load working time: ' + e.message);
                }
            },
            ...mapMutations({
                setStateWorkTimeMonthCurrent: 'workTime/setMonthCurrent',
            }),
            ...mapActions({
                loadDbItems: 'workTime/loadDbItems',
            }),
        },
        async mounted() {
            if (await session.redirectOnFail(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                await this.requestWorkTime();
            }
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Route_WorkTime;
