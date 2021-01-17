const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'wtEdit', {
    date: 'Datums',
    employee: 'Darbinieks',
    timeFrom: 'Sākums',
    timeTo: 'Beigas',
    title: 'Darba laiks: {{date}}',
});
i18next.addResources('ru', 'wtEdit', {
    date: 'Дата',
    employee: 'Сотрудник',
    timeFrom: 'Начало',
    timeTo: 'Конец',
    title: 'Рабочее время: {{date}}',
});

const template = `
<div>
    <actions
        @actionSave="onSave"
    ></actions>
     <form class="edit" onsubmit="return false">

        <div class="id-date row">
            <div class="label">
                <span>{{ $t('wtEdit:date') }}:</span>
            </div>
            <div class="field">
                 {{date}}
            </div>
        </div>  
        
        <div class="id-employee row">
            <div class="label">
                <span>{{ $t('wtEdit:employee') }}:</span>
            </div>
            <div class="field">
                <select name="employee" v-model="employeeId">
                    <option v-for="(one) in optsEmployees" :value="one.id">
                        {{ one.name }}
                    </option>
                </select>
            </div>
        </div>          
        
        <div class="id-timeFrom row">
            <div class="label">
                <span>{{ $t('wtEdit:timeFrom') }}:</span>
            </div>
            <div class="field">
                 <select name="timeFrom" v-model="hourFrom">
                    <option v-for="(one) in optsTimeFrom" :value="one.id">
                        {{ one.value }}
                    </option>
                </select>
            </div>
        </div>          
        
        <div class="id-timeTo row">
            <div class="label">
                <span>{{ $t('wtEdit:timeTo') }}:</span>
            </div>
            <div class="field">
                 <select name="timeTo" v-model="hourTo">
                    <option v-for="(one) in optsTimeTo" :value="one.id">
                        {{ one.value }}
                    </option>
                </select>
            </div>
        </div>          
        
     </form>
</div>`;

function Fl32_Leana_Front_Desk_Route_WorkTime_Edit(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];  // singleton instance
    /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Edit_Actions} */
    const actions = spec['Fl32_Leana_Front_Desk_Widget_WorkTime_Edit_Actions$']; // singleton component
    /** @type {Fl32_Leana_Front_Gate_Employee_WorkTime_List} */
    const gateWorkTimeList = spec['Fl32_Leana_Front_Gate_Employee_WorkTime_List$'];    // singleton function
    /** @type {Fl32_Leana_Front_Gate_Employee_WorkTime_Save} */
    const gateWorkTimeSave = spec['Fl32_Leana_Front_Gate_Employee_WorkTime_Save$']; // singleton function
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Request} */
    const WorkTimeListReq = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Request} */
    const WorkTimeSaveReq = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save_Response} */
    const WorkTimeSaveRes = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_Save#Response'];    // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_List_Request} */
    const EmplListReq = spec['Fl32_Leana_Shared_Service_Route_Employee_List#Request'];  // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
    const WorkTime = spec['Fl32_Leana_Shared_Service_Data_Employee_WorkTime#']; // class constructor


    /**
     * Generated options for time selector. 'id' - UTC hour (7), value - local hour (09:00)
     * @return {[{id: Number, value: String}]}
     */
    function generateTimeOpts() {
        const result = [];
        // add 2 hours to start & end
        const from = DEF.DAY_START_HOUR_UTC - 1;
        const end = DEF.DAY_END_HOUR_UTC + 1;
        const now = new Date();
        const minsOffset = now.getTimezoneOffset();
        for (let id = from; id <= end; id++) {
            const minsLocal = (id * 60) - minsOffset;
            // good enough for Latvian timezone
            const value = utilDate.convertMinsToHrsMins(minsLocal, true);
            const item = {id, value};
            result.push(item);
        }
        return result;
    }

    return {
        name: 'RouteWorkTimeEdit',
        template,
        components: {actions},
        data: function () {
            return {
                employeeId: null,
                hourFrom: null,
                hourTo: null,
                item: null,  // Fl32_Leana_Shared_Service_Data_Employee_WorkTime
            };
        },
        props: {
            datestamp: String, // "/workTime/edit/:datestamp" - YYYYMMDD
        },
        computed: {
            date() {
                let result = '';
                /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                const item = this.item;
                if (item && item.start) {
                    result = utilDate.formatDate(item.start);
                }
                return result;
            },
            employeeName() {
                let result = '';
                /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                const item = this.item;
                const empls = this.stateCalendarEmployees;
                if (item && item.employeeRef && empls && empls[item.employeeRef]) {
                    this.employeeId = item.employeeRef;
                    /** @type {Fl32_Leana_Shared_Service_Data_Employee} */
                    const one = empls[item.employeeRef];
                    result = one.name;
                }
                return result;
            },
            optsEmployees() {
                const result = [];
                if (this.stateCalendarEmployees) {
                    for (
                        /** @type {Fl32_Leana_Shared_Service_Data_Employee} */
                        const one of Object.values(this.stateCalendarEmployees)) {
                        const item = {id: one.id, name: one.name};
                        result.push(item);
                    }
                    result.sort((a, b) => (a.name > b.name) ? 1 : -1);
                }
                // set initial value
                /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                const item = this.item;
                if (item && item.employeeRef) {
                    this.employeeId = item.employeeRef;
                }
                return result;
            },
            optsTimeFrom() {
                const result = generateTimeOpts();
                /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                const item = this.item;
                if (item && (item.start instanceof Date)) {
                    this.hourFrom = item.start.getUTCHours();
                }
                return result;
            },
            optsTimeTo() {
                const result = generateTimeOpts();
                /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                const item = this.item;
                if (item && (item.start instanceof Date)) {
                    const end = new Date(item.start.getTime());
                    end.setMinutes(end.getMinutes() + item.duration);
                    this.hourTo = end.getUTCHours();
                }
                return result;
            },
            ...mapState({
                stateCalendarEmployees: state => state.calendar.employees,
                stateWorkTimeDbItems: state => state.workTime.dbItems,
            }),
        },
        methods: {
            async onSave() {
                const item = Object.assign(new WorkTime(), this.item);
                item.employeeRef = this.employeeId;
                item.start.setUTCHours(this.hourFrom);
                item.duration = (this.hourTo - this.hourFrom) * 60;
                const req = new WorkTimeSaveReq();
                req.item = item;
                const res = await gateWorkTimeSave(req);
                if (res instanceof WorkTimeSaveRes) {
                    // this is normal answer, not error
                    this.$router.push('/workTime');
                }
            },
            ...mapMutations({
                setStateAppTitle: 'app/setTitle',
            }),
            ...mapActions({
                loadDbItems: 'workTime/loadDbItems',
                loadEmployees: 'calendar/loadEmployees',
            }),
        },
        async mounted() {
            // PARSE INPUT & DEFINE WORKING VARS
            const me = this;

            // DEFINE INNER FUNCTIONS
            /**
             * Start loading employees data if not in Vuex.
             */
            function loadEmployee() {
                if (!Object.keys(me.stateCalendarEmployees).length) {
                    // empty employees data
                    const req = new EmplListReq();
                    req.locale = i18next.language;
                    me.loadEmployees(req);
                }
            }

            /**
             * Get data from vuex if exists or load it from the server.
             * @param ds
             * @return {Promise<Fl32_Leana_Shared_Service_Data_Employee_WorkTime>}
             */
            async function loadItem(ds) {
                // DEFINE INNER FUNCTIONS
                function setTitle(ds) {
                    const y = ds.substring(0, 4);
                    const m = ds.substring(4, 6);
                    const d = ds.substring(6, 8);
                    const date = `${y}-${m}-${d}`; // don't use '/' in title (HTML safe transformation will be applied)
                    me.setStateAppTitle(me.$t('routeWorkTime:title', {date}));
                }

                // MAIN FUNCTIONALITY
                setTitle(ds);
                /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime[]} */
                const items = me.stateWorkTimeDbItems;
                let result;
                if (Array.isArray(items)) {
                    for (const one of items) {
                        if (utilDate.stampDate(one.start) === ds) {
                            result = one;
                            break;
                        }
                    }
                }
                if (!result) {
                    /** @type {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Request} */
                    const req = new WorkTimeListReq();
                    req.dateBegin = utilDate.unformatDate(ds);
                    req.dateEnd = req.dateBegin;
                    /** @type {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Response} */
                    const res = await gateWorkTimeList(req);
                    result = Array.isArray(res.items) ? res.items[0] : null;
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                loadEmployee(); // start loading asynchronously
                this.item = await loadItem(this.datestamp);
            }
        }
    };
}

export default Fl32_Leana_Front_Desk_Route_WorkTime_Edit;
