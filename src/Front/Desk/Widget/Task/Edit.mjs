/**
 * Widget to add/edit task in desk realm.
 */
const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'taskEdit', {});
i18next.addResources('ru', 'taskEdit', {
    customer: 'Клиент',
    email: 'Email',
    duration: 'Продолжительность',
    employee: 'Мастер',
    employeeSelect: 'Выберите мастера',
    note: 'Заметки',
    phone: 'Телефон',
    service: 'Услуга',
    serviceSelect: 'Выберите услугу',
    task: 'Задача',
    time: 'Время',
    title: 'Новая запись',
});

const template = `
<div class="">
    <actions
        @actionAdd="onTaskAdd"
    ></actions>
    <h1>{{$t('taskEdit:title')}}</h1>
    <form class="edit" onsubmit="return false">
    
        <div class="id-customer row">
            <div class="label">
                <span>{{ $t('taskEdit:customer') }}:</span>
            </div>
            <div class="field">
                 <input v-model="customer">
            </div>
        </div>    
        
        <div class="id-email row">
            <div class="label">
                <span>{{ $t('taskEdit:email') }}:</span>
            </div>
            <div class="field">
                 <input v-model="email">
            </div>
        </div>   
        
        <div class="id-phone row">
            <div class="label">
                <span>{{ $t('taskEdit:phone') }}:</span>
            </div>
            <div class="field">
                 <input v-model="phone">
            </div>
        </div>
        
        <div class="id-service row">
            <div class="label">
                <span>{{ $t('taskEdit:service') }}:</span>
            </div>
            <div class="field">
                  <select name="service" v-model="serviceId">
                    <option disabled value="null">{{ $t('taskEdit:serviceSelect') }}</option>
                    <option v-for="(one) in optsServices" :value="one.id" :disabled="one.disabled">
                        {{ one.name }}
                    </option>
                </select>
            </div>
        </div>
        
        <div class="id-duration row">
            <div class="label">
                <span>{{ $t('taskEdit:duration') }}:</span>
            </div>
            <div class="field">
                <select v-model="duration" style="width: auto">
                    <option v-for="(one) in optsDuration" :value="one.id">
                        {{ one.value }}
                    </option>
                </select>
            </div>
        </div>
        
        <div class="id-time row">
            <div class="label">
                <span>{{ $t('taskEdit:time') }}:</span>
            </div>
            <div class="field editable">
                <div class="value">{{ dateSchedule }}</div>
                <div class="action">
                    <button v-on:click="actionEditDate">...</button>
                </div>
            </div>
        </div>
        
        <div class="id-employee row">
            <div class="label">
                <span>{{ $t('taskEdit:employee') }}:</span>
            </div>
            <div class="field">
                 {{employeeName}}
            </div>
        </div>
        
        <div class="id-note row">
            <div class="label">
                <span>{{ $t('taskEdit:note') }}:</span>
            </div>
            <div class="field">
                 <textarea v-model="note"></textarea>
            </div>
        </div>
        
      <div class="controls dtp_widget">
            <date-time-picker
                :yearMin="dtpGetYearMin"
                :yearMax="dtpGetYearMax"
                :hourMin="dtpGetHourMin"
                :hourMax="dtpGetHourMax"
                :minsStep="dtpGetStep"
                :initDate="dateSelected"
                @cancelled="onDtpCancelled"
                @selected="onDtpSelected"
            ></date-time-picker>
        </div>
    </form>
</div>
`;

/**
 * Widget to add/edit task in desk realm.
 * @param {TeqFw_Di_SpecProxy} spec
 */
function Fl32_Leana_Front_Desk_Widget_Task_Edit(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
    const gateTaskSave = spec['Fl32_Leana_Front_Gate_Task_Save$'];  //singleton function
    const gateTimeWork = spec['Fl32_Leana_Front_Gate_Employee_TimeWork_List$']; // singleton function
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$']; // singleton class instance
    const actions = spec['Fl32_Leana_Front_Desk_Widget_Task_Edit_Actions$']; // singleton component
    const dateTimePicker = spec['Fl32_Leana_Front_Shared_Widget_DateTimePicker$']; // singleton component
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_List_Request} */
    const EmplReq = spec['Fl32_Leana_Shared_Service_Route_Employee_List#Request'];  // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Service_List_Request} */
    const ServReq = spec['Fl32_Leana_Shared_Service_Route_Service_List#Request'];   // class constructor
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Api_Task} */
    const Task = spec['Fl32_Leana_Front_Desk_Widget_Api_Task#'];    // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
    const TaskOnDateReq = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
    const TaskSaveReq = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Request'];  // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} */
    const TimeWorkReq = spec['Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List#Request']; // class constructor

    return {
        name: 'CalendarTaskEdit',
        template,
        components: {actions, dateTimePicker},
        props: {
            /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
            params: new Task()
        },
        data: function () {
            return {
                customer: null,
                date: null,
                duration: null,
                email: null,
                employeeId: null,
                note: null,
                phone: null,
                serviceId: null,
            };
        },
        computed: {
            dateSchedule() {
                let result = '';
                if (
                    this.date &&
                    (typeof this.date.toLocaleDateString === 'function')
                ) {
                    const locale = i18next.language;
                    result = this.date.toLocaleDateString(locale, {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                }
                return result;
            },
            dtpGetStep() {
                return DEF.TIME_STEP_MINUTES;
            },
            dtpGetHourMax() {
                const date = new Date();
                date.setUTCHours(DEF.DAY_END_HOUR_UTC);
                return date.getHours();
            },
            dtpGetHourMin() {
                const date = new Date();
                date.setUTCHours(DEF.DAY_START_HOUR_UTC);
                return date.getHours();
            },
            dtpGetYearMax() {
                const date = new Date();
                date.setMonth(date.getMonth() + DEF.SCHEDULE_FORECAST_MONTHS);
                return date.getFullYear();
            },
            dtpGetYearMin() {
                return (new Date()).getFullYear();
            },
            employeeName() {
                let result = '';
                if (this.employeeId && this.apiEmployees && this.apiEmployees[this.employeeId]) {
                    /** @type {Fl32_Leana_Shared_Service_Data_Employee} */
                    const employee = this.apiEmployees[this.employeeId];
                    result = employee.name;
                }
                return result;
            },
            optsDuration() {
                const result = [];
                for (let i = DEF.TIME_STEP_MINUTES; i <= 240; i += DEF.TIME_STEP_MINUTES) {
                    result.push({id: i, value: utilDate.convertMinsToHrsMins(i)});
                }
                return result;
            },
            optsServices() {
                let result = [];
                if (this.apiServices) {
                    for (const key in this.apiServices) {
                        /** @type {Fl32_Leana_Shared_Service_Data_Service} */
                        const one = this.apiServices[key];
                        const duration = utilDate.convertMinsToHrsMins(one.duration);
                        const option = {id: one.id, name: one.name, duration};
                        result.push(option);
                    }
                }
                return result.sort((a, b) => (a.name > b.name) ? 1 : -1);
            },
            ...mapState({
                apiEmployees: state => state.calendar.employees,
                apiServices: state => state.calendar.services,
                dateSelected: state => state.calendar.dateSelected,
            })
        },
        methods: {
            actionClose() {
                this.resetOverlay();
            },
            actionEditDate() {
                const elControl = this.$el.querySelector('.controls.dtp_widget');
                elControl.style.visibility = 'visible';
                elControl.style.opacity = 1;
            },
            onDtpCancelled() {
                const elControl = this.$el.querySelector('.controls.dtp_widget');
                elControl.style.visibility = 'hidden';
                elControl.style.opacity = 0;
            },
            onDtpSelected(data) {
                this.date = data;
                const elControl = this.$el.querySelector('.controls.dtp_widget');
                elControl.style.visibility = 'hidden';
                elControl.style.opacity = 0;
            },
            async onTaskAdd() {
                /** @type {Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
                const req = new TaskSaveReq();
                req.date = this.date;
                req.duration = this.duration;
                req.email = this.email;
                req.locale = i18next.language;
                req.employeeId = this.employeeId;
                req.name = this.customer;
                req.note = this.note;
                req.phone = this.phone;
                req.serviceId = this.serviceId;
                const res = await gateTaskSave(req);
                if (res.data && (typeof res.data.id === 'number')) {
                    this.resetOverlay();
                    /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
                    const req = new TaskOnDateReq();
                    req.date = this.dateSelected;
                    this.loadTasksOnDate(req);
                }
            },
            ...mapActions({
                loadEmployees: 'calendar/loadEmployees',
                loadServices: 'calendar/loadServices',
                loadTasksOnDate: 'calendar/loadTasksOnDate',
            }),
            ...mapMutations({
                resetOverlay: 'app/resetOverlay',
            }),

        },
        watch: {
            /**
             * Load work time data and get active employee on the date.
             * @param {Date} val
             * @return {Promise<void>}
             */
            async date(val) {
                if (val instanceof Date) {
                    /** @type {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} */
                    const req = new TimeWorkReq();
                    req.dateBegin = val;
                    req.dateEnd = val;
                    /** @type {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Response} */
                    const res = await gateTimeWork(req);
                    if (Array.isArray(res.items)) {
                        // there is one ony employee on the date in the app
                        /** @type {Fl32_Leana_Shared_Service_Data_Employee_TimeWork} */
                        const item = res.items.find(() => true);    // get first element from array
                        this.employeeId = item.employeeRef;
                    } else {
                        this.employeeId = null;
                    }
                }
            },
            /**
             * Reset duration on service change.
             * @param {Number} val
             */
            serviceId(val) {
                if (this.apiServices && this.apiServices[val]) {
                    /** @type {Fl32_Leana_Shared_Service_Data_Service} */
                    const service = this.apiServices[val];
                    this.duration = service.duration;
                }
            }
        },
        async mounted() {
            const locale = i18next.language;
            // load employees to compose options array
            /** @type {Fl32_Leana_Shared_Service_Route_Employee_List_Request} */
            const reqEmpl = new EmplReq();
            reqEmpl.locale = locale;
            this.loadEmployees(reqEmpl);
            // load services to compose options array
            /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Request} */
            const reqServ = new ServReq();
            reqServ.locale = locale;
            this.loadServices(reqServ);
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_Task_Edit;
