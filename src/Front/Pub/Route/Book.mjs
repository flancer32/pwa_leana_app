const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResourceBundle('lv', 'routeBook', {
    action: {
        send: 'Nosūtīt'
    },
    date: 'Datums',
    employee: 'Meistars',
    employeeSelect: 'Izvēlieties meistaru',
    service: 'Pakalpojums',
    serviceSelect: 'Izvēlieties pakalpojumu',
    time: 'Laiks',
    title: 'Pierakstīties',
}, true);
i18next.addResourceBundle('ru', 'routeBook', {
    action: {
        send: 'Отправить'
    },
    date: 'Дата',
    employee: 'Мастер',
    employeeSelect: 'Выберите мастера',
    service: 'Услуга',
    serviceSelect: 'Выберите услугу',
    time: 'Время',
    title: 'Записаться',
}, true);

const template = `
<div class="layout_centered">
    <form class="edit" onsubmit="return false">
    
        <div class="id-service row">
            <div class="label">
                <span>{{ $t('routeBook:service') }}:</span>
            </div>
            <div class="field">
                <select name="service" v-model="service">
                    <option disabled value="null">{{ $t('routeBook:serviceSelect') }}</option>
                    <option v-for="(one) in serviceOptions" :value="one.id" :disabled="one.disabled">
                        {{ one.name }} ({{one.duration}})
                    </option>
                </select>
            </div>
        </div>
        
        <div class="id-employee row" v-show="service">
            <div class="label">
                <span>{{ $t('routeBook:employee') }}:</span>
            </div>
            <div class="field">
                <select name="employeeId" v-model="employeeId">
                    <option disabled value="null">{{ $t('routeBook:employeeSelect') }}</option>
                    <option v-for="(one) in employeeOptions" :value="one.id" :disabled="one.disabled">
                        {{ one.name }}
                    </option>
                </select>
            </div>
        </div>
        
        <div class="id-date row" v-show="employeeId">
            <div class="label">
                <span>{{ $t('routeBook:date') }}:</span>
            </div>
            <div class="field">
                <date-picker ref="datePicker"
                             :min="dpDateMin"
                             :max="dpDateMax"
                             :dates-disabled="dpDatesDisabled"
                             @selected="setDate"
                ></date-picker>
            </div>
        </div>
        
        <div class="id-time row" v-show="showTime">
            <div class="label">
                <span>{{ $t('routeBook:time') }}:</span>
            </div>
            <div class="field">
                <time-picker ref="timePicker"
                             :entries="timeEntries"
                             @selected="setTime"
                ></time-picker>
            </div>
        </div>

        <div class="actions">
            <div>
                <button v-on:click="send" v-show="time">{{ $t('routeBook:action.send') }}</button>
            </div>
        </div>
    </form>
</div>
`;

export default function Fl32_Leana_Front_Pub_Route_Book(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    /** @type {Fl32_Leana_Front_Pub_Widget_DatePicker} */
    const datePicker = spec['Fl32_Leana_Front_Pub_Widget_DatePicker$'];
    /** @type {Fl32_Leana_Front_Pub_Widget_TimePicker} */
    const timePicker = spec['Fl32_Leana_Front_Pub_Widget_TimePicker$'];
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];
    /** @type {Fl32_Leana_Shared_Util_Mix} */
    const utilMix = spec['Fl32_Leana_Shared_Util_Mix$'];
    // classes and functions
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_List_Request} */
    const EmployeeRequest = spec['Fl32_Leana_Shared_Service_Route_Employee_List#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
    const SaveRequest = spec['Fl32_Leana_Shared_Service_Route_Task_Save#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Service_List_Request} */
    const ServiceRequest = spec['Fl32_Leana_Shared_Service_Route_Service_List#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
    const TaskOnDateRequest = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Request} */
    const WorkTimeRequest = spec['Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List#Request']; // class constructor

    return {
        name: 'RouteBook',
        template,
        components: {
            datePicker,
            timePicker
        },
        data: function () {
            return {
                employeeId: null,
                service: null,
                time: null,
            };
        },
        computed: {
            employeeOptions() {
                let result = [];
                if (this.apiEmployees) {
                    for (const key in this.apiEmployees) {
                        /** @type {Fl32_Leana_Shared_Service_Data_Employee} */
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
                        /** @type {Fl32_Leana_Shared_Service_Data_Service} */
                        const one = this.apiServices[key];
                        const duration = utilDate.convertMinsToHrsMins(one.duration);
                        const option = {id: one.id, name: one.name, duration};
                        result.push(option);
                    }
                }
                return result;
            },
            dpDateMax() {
                const result = new Date();
                result.setDate(result.getDate() + 21);
                return result;
            },
            dpDateMin() {
                return new Date();
            },
            dpDatesDisabled() {
                const result = [];
                if (this.employeeId && Array.isArray(this.apiWorkTime)) {
                    // get working days
                    const workDays = [];
                    for (
                        /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                        const one of this.apiWorkTime) {
                        if (one.employeeRef === this.employeeId) {
                            const dateStart = one.start;
                            const formatted = utilDate.stampDate(dateStart);
                            workDays.push(formatted);
                        }
                    }
                    let date = new Date(this.dpDateMin);
                    let dateMax = new Date(this.dpDateMax);
                    while (date < dateMax) {
                        const formatted = utilDate.stampDate(date);
                        if (!workDays.includes(formatted)) {
                            const disabled = utilDate.unformatDate(formatted);
                            result.push(disabled);
                        }
                        date.setDate(date.getDate() + 1);
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
                 * @param {Object.<number, Fl32_Leana_Shared_Service_Data_Task>} tasksOnDate
                 * @return {Object<number, number>} dateTimeBegin => dateTimeEnd
                 */
                function getBookedTime(tasksOnDate) {
                    const result = {};
                    if (tasksOnDate && Array.isArray(Object.values(tasksOnDate))) {
                        // order tasks by booking time (by beginning)
                        const orderedAsc = Object.values(tasksOnDate)
                            .sort((a, b) => (new Date(a.dateBook)).getTime() - (new Date(b.dateBook)).getTime());
                        for (
                            /** @type {Fl32_Leana_Shared_Service_Data_Task} */
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
                if ((this.dateSelected instanceof Date) && this.employeeId) {
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
                for (const key in this.apiWorkTime) {
                    /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                    const one = this.apiWorkTime[key];
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
                apiWorkTime: state => state.book.workTime,
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
                /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
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
                /** @type {Fl32_Leana_Shared_Service_Route_Task_Save_Request} */
                const req = new SaveRequest();
                req.date = date;
                req.duration = this.duration;
                req.locale = i18next.language;
                req.employeeId = this.employeeId;
                req.madeOnFront = true;
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
                    this.service = null;
                    this.employeeId = null;
                    this.time = null;
                    this.setDateSelected(null);
                    this.$refs['timePicker'].idSelected = null;
                    this.$refs['datePicker'].cleanSelected();
                    this.$router.push('/history');
                }
            },
            ...mapMutations({
                setDateSelected: 'book/setDateSelected',
                setStateAppTitle: 'app/setTitle',
            }),
            ...mapActions({
                loadEmployees: 'book/loadEmployees',
                loadServices: 'book/loadServices',
                loadTasksOnDate: 'book/loadTasksOnDate',
                loadWorkTime: 'book/loadWorkTime',
            }),
        },
        async mounted() {
            // validate user's permissions
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_CUSTOMER)) {
                // set title
                this.setStateAppTitle(this.$t('routeBook:title'));
                // continue if not redirected
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_List_Request} */
                const reqEmpl = new EmployeeRequest();
                reqEmpl.locale = i18next.language;
                await this.loadEmployees(reqEmpl);
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Request} */
                const reqSrv = new ServiceRequest();
                reqSrv.locale = i18next.language;
                reqSrv.publicOnly = true;
                await this.loadServices(reqSrv);
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_WorkTime_List_Request} */
                const reqWorkTime = new WorkTimeRequest();
                reqWorkTime.dateBegin = new Date(Date.now());
                await this.loadWorkTime(reqWorkTime);
                // get user data from profile
                const user = session.getUser();
                this.name = user.name;
                const [email] = user.emails;
                this.email = email;
                const [phone] = user.phones;
                this.phone = phone;
            }
        }
    };
}
