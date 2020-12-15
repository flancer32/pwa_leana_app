const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResourceBundle('lv', 'route-book', {
    action: {
        send: 'Nosūtīt'
    },
    email: 'Jūsu e-pasts',
    emailPH: 'e-pasts: user@domain.com',
    master: 'Meistars',
    masterSelect: 'Izvēlieties meistaru',
    name: 'Jūsu vārds',
    namePH: 'vārds: Līga Ozola',
    phone: 'Jūsu telefons',
    phonePH: 'telefons: 29101010',
    service: 'Pakalpojums',
    serviceSelect: 'Izvēlieties pakalpojumu',
    title: 'Pierakstīties',
}, true);
i18next.addResourceBundle('ru', 'route-book', {
    action: {
        send: 'Отправить'
    },
    email: 'Ваш email',
    emailPH: 'email: user@domain.com',
    master: 'Мастер',
    masterSelect: 'Выберите мастера',
    name: 'Ваше имя',
    namePH: 'имя: Светлана Соколова',
    phone: 'Ваш телефон',
    phonePH: 'телефон: 29101010',
    service: 'Услуга',
    serviceSelect: 'Выберите услугу',
    title: 'Записаться',
}, true);

const template = `
<div>
    <h1>{{ $t('route-book:title') }}</h1>
    <form class="form_c1" onsubmit="return false">
        <div class="fld-name form_row">
            <div class="form_label">
                <span>{{ $t('route-book:name') }}:</span>
            </div>
            <div class="form_field">
                <input type="text" name="name" v-model="name" :placeholder="$t('route-book:namePH')">
            </div>
        </div>
        <div class="fld-phone form_row">
            <div class="form_label">
                <span>{{ $t('route-book:phone') }}:</span>
            </div>
            <div class="form_field">
                <input type="text" name="phone" v-model="phone" :placeholder="$t('route-book:phonePH')">
            </div>
        </div>
        <div class="fld-email form_row">
            <div class="form_label">
                <span>{{ $t('route-book:email') }}:</span>
            </div>
            <div class="form_field">
                <input type="text" name="email" v-model="email" :placeholder="$t('route-book:emailPH')">
            </div>
        </div>
        <div class="fld-service form_row">
            <div class="form_label">
                <span>{{ $t('route-book:service') }}:</span>
            </div>
            <div class="form_field">
                <select name="service" v-model="service">
                    <option disabled value="null">{{ $t('route-book:serviceSelect') }}</option>
                    <option v-for="(one) in serviceOptions" :value="one.id" :disabled="one.disabled">
                        {{ one.name }} ({{one.duration}})
                    </option>
                </select>
            </div>
        </div>
        <div class="fld-master form_row" v-show="service && name && (phone || email)">
            <div class="form_label">
                <span>{{ $t('route-book:master') }}:</span>
            </div>
            <div class="form_field">
                <select name="employeeId" v-model="employeeId">
                    <option disabled value="null">{{ $t('route-book:masterSelect') }}</option>
                    <option v-for="(one) in masterOptions" :value="one.id" :disabled="one.disabled">
                        {{ one.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="fld-date form_row" v-show="employeeId">
            <date-picker ref="datePicker"
                         :min="dpDateMin"
                         :max="dpDateMax"
                         :dates-disabled="dpDatesDisabled"
                         @selected="setDate"
            ></date-picker>
        </div>
        <div class="fld-time form_row" v-show="showTime">
            <div class="form_label">
                <span>{{ $t('route-book:time') }}:</span>
            </div>
            <div class="form_field">
                <time-picker ref="timePicker"
                             :entries="timeEntries"
                             @selected="setTime"
                ></time-picker>
            </div>
        </div>

        <div class="form_actions">
            <div>
                <button v-on:click="send" v-show="time">{{ $t('route-book:action.send') }}</button>
            </div>
        </div>
    </form>
</div>
`;

export default function Fl32_Leana_Front_Pub_Route_Book(spec) {
    /** @type {Fl32_Leana_Front_Pub_Widget_DatePicker} */
    const datePicker = spec.Fl32_Leana_Front_Pub_Widget_DatePicker$;
    /** @type {Fl32_Leana_Front_Pub_Widget_TimePicker} */
    const timePicker = spec.Fl32_Leana_Front_Pub_Widget_TimePicker$;
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    /** @type {Fl32_Leana_Shared_Util_Mix} */
    const utilMix = spec.Fl32_Leana_Shared_Util_Mix$;
    // classes and functions
    const EmployeeRequest = spec['Fl32_Leana_Shared_Api_Route_Employee_List#Request']; // class constructor
    const SaveRequest = spec['Fl32_Leana_Shared_Api_Route_Task_Save#Request']; // class constructor
    const ServiceRequest = spec['Fl32_Leana_Shared_Api_Route_Service_List#Request']; // class constructor
    const TaskOnDateRequest = spec['Fl32_Leana_Shared_Api_Route_Task_OnDate#Request']; // class constructor
    const TimeWorkRequest = spec['Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List#Request']; // class constructor

    return {
        template,
        components: {
            datePicker,
            timePicker
        },
        data: function () {
            return {
                email: null,
                employeeId: null,
                name: null,
                phone: null,
                service: null,
                time: null,
            };
        },
        computed: {
            masterOptions() {
                let result = [];
                if (this.apiEmployees) {
                    for (const key in this.apiEmployees) {
                        /** @type {Fl32_Leana_Shared_Api_Data_Employee} */
                        const one = this.apiEmployees[key];
                        if (Array.isArray(one.services) && one.services.includes(this.service)) {
                            result.push({id: one.id, name: one.name});
                        }
                    }
                }
                return result;
            },
            serviceOptions() {
                let result = [];
                if (this.apiServices) {
                    for (const key in this.apiServices) {
                        /** @type {Fl32_Leana_Shared_Api_Data_Service} */
                        const one = this.apiServices[key];
                        const duration = utilDate.convertMinsToHrsMins(one.duration);
                        const option = {id: one.id, name: one.name, duration};
                        result.push(option);
                    }
                }
                return result;
            },
            dpDateMax() {
                return utilDate.forwardDate(21, new Date(Date.now()));
            },
            dpDateMin() {
                return new Date(Date.now());
            },
            dpDatesDisabled() {
                const result = [];
                if (this.employeeId && Array.isArray(this.apiTimeWork)) {
                    // get working days
                    const workDays = [];
                    for (
                        /** @type {Fl32_Leana_Shared_Api_Data_Employee_Time_Work} */
                        const one of this.apiTimeWork) {
                        if (one.employeeRef === this.employeeId) {
                            const dateStart = one.start;
                            const formatted = utilDate.formatDate(dateStart);
                            workDays.push(formatted);
                        }
                    }
                    let date = this.dpDateMin;
                    let dateMax = this.dpDateMax;
                    while (date < dateMax) {
                        const formatted = utilDate.formatDate(date);
                        if (!workDays.includes(formatted)) {
                            const disabled = utilDate.unformatDate(formatted);
                            result.push(disabled);
                        }
                        date = utilDate.forwardDate(1, date);
                    }
                }
                return result;
            },
            duration() {
                let result = null;
                if (this.service !== null) {
                    const option = utilMix.getOptionById(this.serviceOptions, this.service);
                    if (option && option.duration) {
                        result = utilDate.convertHrsMinsToMins(option.duration);
                    }
                }
                return result;
            },
            timeEntries() {
                /**
                 * Collect 'from' & 'to' times for booking intervals.
                 *
                 * @param {Object.<number, Fl32_Leana_Shared_Api_Data_Task>} tasksOnDate
                 * @return {Object<number, number>} dateTimeBegin => dateTimeEnd
                 */
                function getBookedTime(tasksOnDate) {
                    const result = {};
                    if (Array.isArray(Object.keys(tasksOnDate))) {
                        // order tasks by booking time (by beginning)
                        const orderedAsc = Object.values(tasksOnDate)
                            .sort((a, b) => (new Date(a.dateBook)).getTime() - (new Date(b.dateBook)).getTime());
                        for (
                            /** @type {Fl32_Leana_Shared_Api_Data_Task} */
                            const one of orderedAsc) {
                            const dateFrom = new Date(one.dateBook);
                            const duration = utilDate.minutesToMilliseconds(one.duration);
                            const dateTo = new Date(dateFrom.getTime() + duration);
                            const timeFrom = dateFrom.getTime();
                            const timeTo = dateTo.getTime();
                            if (result[timeFrom]) {
                                // more than one tasks on the time
                                result[timeFrom].timeTo = Math.max(timeTo, result[timeFrom]);
                                result[timeFrom].dateTo = new Date(result[timeFrom].timeTo);
                            } else {
                                // first task on the time
                                result[timeFrom] = {
                                    timeTo,
                                    dateFrom: new Date(timeFrom),
                                    dateTo: new Date(timeTo),
                                };
                            }
                        }
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                const result = [];
                if (
                    (this.dateSelected instanceof Date) &&
                    this.employeeId && this.apiTasksOnDate
                ) {
                    const {dateStart, dateEnd} = this.workTimeForEmployeeOnDate;
                    // employee has working hours for the date
                    if (dateStart && dateEnd) {
                        // perform all date operations in milliseconds
                        const duration = utilDate.minutesToMilliseconds(this.duration);
                        // begin & end of the working day
                        let workFrom = dateStart.getTime();
                        const workTo = dateEnd.getTime();
                        const bookedTime = getBookedTime(this.apiTasksOnDate);
                        const bookedFroms = Object.keys(bookedTime).sort(); // num => str type conversion for keys
                        let bookFrom = Number.parseInt(bookedFroms.shift()); // get first booked interval
                        while (workFrom < workTo) {
                            const intervalEnd = workFrom + duration;
                            if (bookFrom && (intervalEnd > bookFrom)) {
                                // planned interval overlays already booked interval,
                                // set workFrom to the end of the last booked interval (if intervals are overlaid)
                                do {
                                    // move 'from' to the end of booked interval if it is later than current 'from'
                                    const task = bookedTime[bookFrom];
                                    workFrom = Math.max(workFrom, task.timeTo);
                                    // shift booked interval
                                    bookFrom = Number.parseInt(bookedFroms.shift());
                                } while (bookFrom < workFrom);
                            } else {
                                // no booked interval or end of planned interval is less than start of booked interval
                                const id = workFrom;
                                const dateFrom = new Date(workFrom);
                                const hh = dateFrom.getHours().toString().padStart(2, '0');
                                const mm = dateFrom.getMinutes().toString().padStart(2, '0');
                                const label = `${hh}:${mm}`;
                                result.push({id, label});
                                workFrom = intervalEnd;
                            }
                        }
                    }
                }
                return result;
            },
            showTime() {
                return (this.dateSelected instanceof Date);
            },
            /**
             * Collect working time for selected employee on selected date.
             */
            workTimeForEmployeeOnDate() {
                const result = {};
                const stampSelected = utilDate.stampDateUtc(this.dateSelected);
                for (const key in this.apiTimeWork) {
                    /** @type {Fl32_Leana_Shared_Api_Data_Employee_Time_Work} */
                    const one = this.apiTimeWork[key];
                    if (one.employeeRef === this.employeeId) {
                        const stampWork = utilDate.stampDateUtc(one.start);
                        if (stampSelected === stampWork) {
                            // convert start time from UTC to local timezone
                            result.dateStart = new Date(one.start);
                            const durationInMsec = utilDate.minutesToMilliseconds(one.duration);
                            result.dateEnd = new Date(result.dateStart.getTime() + durationInMsec);
                        }
                    }
                }
                return result;
            },
            ...mapState({
                apiEmployees: state => state.book.employees,
                apiServices: state => state.book.services,
                apiTasksOnDate: state => state.book.tasksOnDate,
                apiTimeWork: state => state.book.timeWork,
                dateSelected: state => state.book.dateSelected,
            })
        },
        methods: {
            /**
             * Handler for datePicker's event.
             * Set selected date as state in Vuex and load tasks on the date.
             *
             * @param {Date} date
             */
            setDate(date) {
                this.setDateSelected(date);
                /** @type {Fl32_Leana_Shared_Api_Route_Task_OnDate_Request} */
                const req = new TaskOnDateRequest();
                req.date = date;
                this.loadTasksOnDate(req);
            },
            /**
             * Handler for timePicker's event.
             *
             * @param {number} id
             */
            setTime(id) {
                this.time = id;
            },
            async send() {
                // 'time' contains date-time value for beginning of the interval
                const date = new Date(this.time);
                /** @type {Fl32_Leana_Shared_Api_Route_Task_Save_Request} */
                const req = new SaveRequest();
                req.date = date;
                req.duration = this.duration;
                req.email = this.email;
                req.locale = i18next.language;
                req.employeeId = this.employeeId;
                req.madeOnFront = true;
                req.name = this.name;
                req.phone = this.phone;
                req.serviceId = this.service;
                const res = await fetch('../api/task/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({data: req})
                });
                const result = await res.json();
                // there is task id in the response
                if (typeof result.data.id === 'number') {
                    this.name = null;
                    this.email = null;
                    this.phone = null;
                    this.service = null;
                    this.employeeId = null;
                    this.time = null;
                    this.setDateSelected(null);
                    this.$refs['timePicker'].idSelected = null;
                    this.$refs['datePicker'].cleanSelected();
                }
            },
            ...mapMutations({
                setDateSelected: 'book/setDateSelected',
            }),
            ...mapActions({
                loadEmployees: 'book/loadEmployees',
                loadServices: 'book/loadServices',
                loadTasksOnDate: 'book/loadTasksOnDate',
                loadTimeWork: 'book/loadTimeWork',
            }),
        },
        async mounted() {
            /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Request} */
            const reqEmpl = new EmployeeRequest();
            reqEmpl.locale = i18next.language;
            await this.loadEmployees(reqEmpl);
            /** @type {Fl32_Leana_Shared_Api_Route_Service_List_Request} */
            const reqSrv = new ServiceRequest();
            reqSrv.locale = i18next.language;
            reqSrv.publicOnly = true;
            await this.loadServices(reqSrv);
            /** @type {Fl32_Leana_Shared_Api_Route_Employee_TimeWork_List_Request} */
            const reqTimeWork = new TimeWorkRequest();
            reqTimeWork.dateBegin = new Date(Date.now()); // UTC
            await this.loadTimeWork(reqTimeWork);
        }
    };
}
