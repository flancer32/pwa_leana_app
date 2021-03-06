const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapState = self.teqfw.lib.Vuex.mapState;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeSchedule', {
    title: 'Saraksts: {{date}}',
});
i18next.addResources('ru', 'routeSchedule', {
    title: 'Расписание: {{date}}',
});

const template = `
<div>
    <action-bar></action-bar>
    <div class="calendar_current_date">{{dateFormatted}}</div>
    <div id="calendar_entries">
        <booking 
            :tasks="bookedTasks"
            :hourBegin="hourBegin"
            :hourEnd="hourEnd"
            :step="60"
        ></booking>
    </div>
</div>
`;

/**
 *
 * @param {TeqFw_Di_SpecProxy} spec
 * @return {Object}
 * @exports Fl32_Leana_Front_Desk_Route_Calendar
 */
function Fl32_Leana_Front_Desk_Route_Calendar(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    /** @type {Fl32_Leana_Front_Desk_Widget_Booking} */
    const booking = spec.Fl32_Leana_Front_Desk_Widget_Booking$;  // singleton
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    /** @type {Fl32_Leana_Front_Desk_Util_Convert_Api2Ui} */
    const utilConvert = spec.Fl32_Leana_Front_Desk_Util_Convert_Api2Ui$;
    /** @type {Fl32_Leana_Front_Desk_Widget_Calendar_ActionBar} */
    const wgActionBar = spec.Fl32_Leana_Front_Desk_Widget_Calendar_ActionBar$;   // singleton
    const EmplReq = spec['Fl32_Leana_Shared_Service_Route_Employee_List#Request'];  // class constructor
    const ServReq = spec['Fl32_Leana_Shared_Service_Route_Service_List#Request'];   // class constructor
    const Swipe = spec['Fl32_Leana_Front_Desk_Util_Swipe#'];                    // class constructor
    const TaskOnDateRequest = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request']; // class constructor
    const TaskWidget = spec['Fl32_Leana_Front_Desk_Widget_Booking_Api#Task'];   // class constructor

    return {
        template,
        components: {
            booking,
            actionBar: wgActionBar
        },
        data: function () {
            return {};
        },
        computed: {
            dateFormatted() {
                let result = '';
                if (typeof this.calendarDateSelected.toLocaleDateString === 'function') {
                    const locale = i18next.language;
                    result = this.calendarDateSelected.toLocaleDateString(locale, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
                return result;
            },
            hourBegin() {
                return 9;   // including: 9 >=
            },
            hourEnd() {
                return 20;  // excluding < 20
            },
            /**
             * Return tasks on date converted into Booking Widget format.
             * @return {Object.<number, Fl32_Leana_Front_Desk_Widget_Booking_Api_Task>}
             */
            bookedTasks() {
                const result = {};
                // convert tasks on the date to UI format
                if (Array.isArray(Object.keys(this.calendarTasksOnDate))) {
                    for (
                        /** @type {Fl32_Leana_Shared_Service_Data_Task} */
                        const one of Object.values(this.calendarTasksOnDate)) {
                        /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
                        const taskUi = utilConvert.taskApi2Ui(one, this.calendarEmployees, this.calendarServices);
                        /** @type {Fl32_Leana_Front_Desk_Widget_Booking_Api_Task} */
                        const taskWidget = new TaskWidget();
                        taskWidget.id = taskUi.id;              // 1
                        const durationInMsec = utilDate.minutesToMilliseconds(taskUi.duration);
                        const timeEnd = taskUi.dateBook.getTime() + durationInMsec;
                        taskWidget.begin = taskUi.dateBook;     // Date
                        taskWidget.end = new Date(timeEnd);     // Date
                        taskWidget.duration = taskUi.duration;  // 30: in minutes
                        taskWidget.taskData = taskUi;
                        // add widget task data to results
                        result[taskWidget.id] = taskWidget;
                    }
                }
                return result;
            },
            ...mapState({
                calendarDateSelected: state => state.calendar.dateSelected,
                calendarEmployees: state => state.calendar.employees,
                calendarServices: state => state.calendar.services,
                calendarTasksOnDate: state => state.calendar.tasksOnDate,
                stateSignInRedirect: state => state.app.signInRedirect,
            })
        },
        methods: {
            /**
             * Load employees & services data and save it into vuex store.
             * @return {Promise<void>}
             */
            async apiLoadCodifiers() {
                const locale = i18next.language;
                // load employees
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_List_Request} */
                const emplReq = new EmplReq();
                emplReq.locale = locale;
                this.loadEmployees(emplReq);
                // load services
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Request} */
                const servReq = new ServReq();
                servReq.locale = locale;
                this.loadServices(servReq);
            },
            /**
             * Load tasks on the selected data and save its into vuex store.
             * @return {Promise<void>}
             */
            async apiLoadTasks() {
                /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
                const req = new TaskOnDateRequest();
                req.date = this.calendarDateSelected;
                this.loadTasksOnDate(req);
            },
            ...mapMutations({
                setDateSelected: 'calendar/setDateSelected',
                setSignInRedirect: 'app/setSignInRedirect',
                setStateAppTitle: 'app/setTitle',
                setTasksOnDate: 'calendar/setTasksOnDate',
            }),
            setTitle(date) {
                const y = `${date.getFullYear()}`;
                const m = `${(date.getMonth() + 1)}`.padStart(2, '0');
                const d = `${(date.getDate())}`.padStart(2, '0');
                // don't use '/' in title (HTML safe transformation will be applied)
                const formatted = `${y}-${m}-${d}`;
                this.setStateAppTitle(this.$t('routeSchedule:title', {date: formatted}));
            },
            ...mapActions({
                loadEmployees: 'calendar/loadEmployees',
                loadServices: 'calendar/loadServices',
                loadTasksOnDate: 'calendar/loadTasksOnDate',
            }),
        },
        async mounted() {
            // DEFINE INNER FUNCTIONS
            /**
             * Add onSwipes handlers to change selected date.
             */
            function addSwipes() {
                /** @type {Fl32_Leana_Front_Desk_Util_Swipe} */
                const swipe = new Swipe('#calendar_entries');
                swipe.setOnLeft(function () {
                    const dayAfter = new Date(me.calendarDateSelected.getTime());
                    dayAfter.setDate(dayAfter.getDate() + 1);
                    me.setDateSelected(dayAfter);
                    me.setTitle(dayAfter);
                    me.apiLoadTasks();
                });
                swipe.setOnRight(function () {
                    const dayBefore = new Date(me.calendarDateSelected.getTime());
                    dayBefore.setDate(dayBefore.getDate() - 1);
                    me.setDateSelected(dayBefore);
                    me.setTitle(dayBefore);
                    me.apiLoadTasks();
                });
            }

            // MAIN FUNCTIONALITY
            const me = this;
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                addSwipes();
                if (typeof this.calendarDateSelected.getTime !== 'function') {
                    const now = new Date(Date.now());
                    now.setUTCHours(0, 0, 0, 0);
                    this.setDateSelected(now);
                }
                this.setTitle(this.calendarDateSelected);
                await this.apiLoadCodifiers();
                await this.apiLoadTasks();
            }
        }
    };
}

export default Fl32_Leana_Front_Desk_Route_Calendar;
