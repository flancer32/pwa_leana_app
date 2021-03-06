const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'routeWorkTime', {
    title: 'Darba laiks: {{date}}',
});
i18next.addResources('ru', 'routeWorkTime', {
    title: 'Рабочее время: {{date}}',
});

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
    /** @type {Fl32_Leana_Front_Gate_Employee_WorkTime_Generate} */
    const gateTimeGenerate = spec['Fl32_Leana_Front_Gate_Employee_WorkTime_Generate$']; // singleton function
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Request} */
    const WorkTimeListReq = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate_Request} */
    const WorkTimeGenReq = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Generate#Request'];  // class constructor


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
                const req = new WorkTimeGenReq();
                await gateTimeGenerate(req);
                await this.requestWorkTime();
            },
            async requestWorkTime() {
                const me = this;

                // DEFINE INNER FUNCTIONS
                function setTitle(month) {
                    const y = `${month.getFullYear()}`;
                    const m = `${(month.getMonth() + 1)}`.padStart(2, '0');
                    const date = `${y}-${m}`; // don't use '/' in title (HTML safe transformation will be applied)
                    me.setStateAppTitle(me.$t('routeWorkTime:title', {date}));
                }

                // MAIN FUNCTIONALITY
                try {
                    const month = this.getMonth();
                    setTitle(month);
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
                setStateAppTitle: 'app/setTitle',
                setStateWorkTimeMonthCurrent: 'workTime/setMonthCurrent',
            }),
            ...mapActions({
                loadDbItems: 'workTime/loadDbItems',
            }),
        },
        async mounted() {
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                await this.requestWorkTime();
            }
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Route_WorkTime;
