const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'taskPreview', {});
i18next.addResources('ru', 'taskPreview', {
    customer: 'Клиент',
    date: 'Дата',
    email: 'Email',
    employee: 'Мастер',
    madeBy: 'Создан',
    madeByAdmin: 'Вручную',
    madeByCustomer: 'Клиентом',
    notes: 'Заметки',
    phone: 'Телефон',
    service: 'Задача',
    task: 'Задача',
});

const template = `
<div>
    <actions @actionSave="onTaskSave"></actions>
    <h1>{{ params.customer.name }}</h1>
    <form class="preview" onsubmit="return false">
        <div class="id-email row" v-show="customer.email">
            <div class="label">
                <span>{{ $t('taskPreview:email') }}:</span>
            </div>
            <div class="field">
                <a href="mailto:{{ customer.email }}">{{ customer.email }}</a>
            </div>
        </div>
        <div class="id-phone row" v-show="customer.phone">
            <div class="label">
                <span>{{ $t('taskPreview:phone') }}:</span>
            </div>
            <div class="field">
                <a href="tel:{{ customer.phone }}">{{ customer.phone }}</a>
            </div>
        </div>
        <div class="id-date row">
            <div class="label">
                <span>{{ $t('taskPreview:date') }}:</span>
            </div>
            <div class="field editable">
                <div class="value">{{ dateSchedule }}</div>
                <div class="action">
                    <button v-on:click="actionEditDate">...</button>
                </div>
            </div>
        </div>
        <div class="id-employee row" v-show="employee.code">
            <div class="label">
                <span>{{ $t('taskPreview:employee') }}:</span>
            </div>
            <div class="field">
                <span>{{ employee.name }}</span>
            </div>
        </div>
        <div class="id-service row" v-show="service.code">
            <div class="label">
                <span>{{ $t('taskPreview:service') }}:</span>
            </div>
            <div class="field">
                <select name="service" v-model="service.id">
                    <option v-for="(one) in optsServices" :value="one.id">
                        {{ one.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="id-duration row">
            <div class="label">
                <span>{{ $t('taskPreview:duration') }}:</span>
            </div>
            <div class="field">
                <select v-model="item.duration" style="width: auto">
                    <option v-for="(one) in optsDuration" :value="one.id">
                        {{ one.value }}
                    </option>
                </select>
            </div>
        </div>
        <div class="id-madeBy row">
            <div class="label">
                <span>{{ $t('taskPreview:madeBy') }}:</span>
            </div>
            <div class="field">
                <span v-show="!item.madeOnFront">{{ $t('taskPreview:madeByAdmin') }}</span>
                <span v-show="item.madeOnFront">{{ $t('taskPreview:madeByCustomer') }}</span>
            </div>
        </div>
        <div class="id-notes row">
            <div class="label">
                <span>{{ $t('taskPreview:notes') }}:</span>
            </div>
            <div class="field">
                <textarea v-model="item.note"></textarea>
            </div>
        </div>
        <div class="controls dtp_widget">
            <date-time-picker
                    :yearMin="dtpGetYearMin"
                    :yearMax="dtpGetYearMax"
                    :hourMin="dtpGetHourMin"
                    :hourMax="dtpGetHourMax"
                    :minsStep="dtpGetStep"
                    :initDate="item.dateBook"
                    @cancelled="onDtpCancelled"
                    @selected="onDtpSelected"
            ></date-time-picker>
        </div>
    </form>
</div>
`;

/**
 * Widget to preview task details in desk overlay.
 * @param {TeqFw_Di_SpecProxy} spec
 */
function Fl32_Leana_Front_Desk_Widget_Task_Preview(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
    /** @type {Fl32_Leana_Front_Desk_Widget_Task_Preview_Actions} */
    const actions = spec['Fl32_Leana_Front_Desk_Widget_Task_Preview_Actions$$'];    // new instance
    /** @type {Fl32_Leana_Front_Desk_Util_Options} */
    const utilOpts = spec['Fl32_Leana_Front_Desk_Util_Options$'];   // singleton instance
    /** @type {Fl32_Leana_Front_Shared_Widget_DateTimePicker} */
    const dateTimePicker = spec['Fl32_Leana_Front_Shared_Widget_DateTimePicker$']; // singleton instance
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
    const SaveReq = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Api_Task} */
    const Task = spec['Fl32_Leana_Front_Desk_Widget_Api_Task#'];    // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
    const TaskOnDateReq = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} */
    const TimeWorkReq = spec['Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List#Request'];   // class constructor

    return {
        name: 'CalendarTaskPreview',
        template,
        components: {actions, dateTimePicker},
        data() {
            return {
                serviceId: null,
            };
        },
        props: {
            /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
            params: new Task()
        },
        computed: {
            /**
             * @return {{}|Fl32_Leana_Front_Desk_Widget_Api_Customer}
             */
            customer() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
                const result = this.params;
                if (result && result.customer) {
                    return result.customer;
                } else {
                    return {};
                }
            },
            dateSchedule() {
                let result = '';
                if (
                    this.item.dateBook &&
                    (typeof this.item.dateBook.toLocaleDateString === 'function')
                ) {
                    const locale = i18next.language;
                    result = this.item.dateBook.toLocaleDateString(locale, {
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
            /**
             * @return {{}|Fl32_Leana_Front_Desk_Widget_Api_Employee}
             */
            employee() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
                const result = this.params;
                if (result && result.employee) {
                    return result.employee;
                } else {
                    return {};
                }
            },
            /**
             * @return {{}|Fl32_Leana_Front_Desk_Widget_Api_Task}
             */
            item() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
                const result = this.params;
                if (result) {
                    return result;
                } else {
                    return {};
                }
            },
            optsDuration() {
                return utilOpts.getDurationValues();
            },
            optsServices() {
                const result = [];
                if (this.calendarServices) {
                    for (
                        /** @type {Fl32_Leana_Shared_Service_Data_Service} */
                        const one of Object.values(this.calendarServices)) {
                        const item = {id: one.id, name: one.name, duration: one.duration};
                        result.push(item);
                    }
                    result.sort((a, b) => (a.name > b.name) ? 1 : -1);
                }
                return result;
            },
            /**
             * @return {Fl32_Leana_Front_Desk_Widget_Api_Service|{}}
             */
            service() {
                /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
                const result = this.params;
                if (result && result.service) {
                    return result.service;
                } else {
                    return {};
                }
            },
            ...mapState({
                calendarDateSelected: state => state.calendar.dateSelected,
                calendarEmployees: state => state.calendar.employees,
                calendarServices: state => state.calendar.services,
                calendarTimeWork: state => state.calendar.timeWork,
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
                this.item.dateBook = data;
                // load time work & switch employee
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_TimeWork_List_Request} */
                const timeReq = new TimeWorkReq();
                timeReq.dateBegin = data;
                timeReq.dateEnd = data;
                this.loadTimeWork(timeReq).then(() => {
                    const employeeId = this.employee.id;
                    let changeId = null;
                    if (this.calendarTimeWork) {
                        for (
                            /** @type {Fl32_Leana_Shared_Service_Data_Employee_TimeWork} */
                            const one of Object.values(this.calendarTimeWork)) {
                            if (one.employeeRef === employeeId) {
                                changeId = null;
                                break;
                            }
                            if (changeId === null) changeId = one.employeeRef;
                        }
                    }
                    // change employee if need
                    if (changeId !== null) {
                        this.params.employee = this.calendarEmployees[changeId];
                    }
                });


                // hide widget
                const elControl = this.$el.querySelector('.controls.dtp_widget');
                elControl.style.visibility = 'hidden';
                elControl.style.opacity = 0;
            },
            async onTaskSave() {
                /** @type {Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
                const data = new SaveReq();
                data.id = this.item.id;
                data.date = this.item.dateBook;
                data.duration = this.item.duration;
                data.email = this.item.customer.email;
                data.employeeId = this.employee.id;
                data.name = this.customer.name;
                data.phone = this.customer.phone;
                data.serviceId = this.service.id;
                data.note = this.item.note;
                data.locale = this.item.locale;
                const res = await fetch('../api/task/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({data})
                });
                const result = await res.json();
                console.log('Saved: ' + JSON.stringify(result));
                this.resetOverlay();
                /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
                const req = new TaskOnDateReq();
                req.date = this.calendarDateSelected;
                this.loadTasksOnDate(req);
            },
            ...mapMutations({
                resetOverlay: 'app/resetOverlay',
            }),
            ...mapActions({
                loadTasksOnDate: 'calendar/loadTasksOnDate',
                loadTimeWork: 'calendar/loadTimeWork',
            }),
        },
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_Task_Preview;
