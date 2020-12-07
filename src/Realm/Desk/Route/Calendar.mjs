const mapState = self.teqfw.lib.Vuex.mapState;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'route-about', {});
i18next.addResources('ru', 'route-about', {});

const template = `
<div>
    <action-bar></action-bar>
    <div class="calendar_current_date">{{dateFormatted}}</div>
    <booking 
        :tasks="bookedTasks"
        :begin="'0900'"
        :end="'2000'"
        :step="60"
    ></booking>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Route_Calendar(spec) {
    /** @type {Fl32_Leana_Realm_Desk_Widget_Booking} */
    const booking = spec.Fl32_Leana_Realm_Desk_Widget_Booking$;  // singleton
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    /** @type {Fl32_Leana_Realm_Desk_Widget_Calendar_ActionBar} */
    const wgActionBar = spec.Fl32_Leana_Realm_Desk_Widget_Calendar_ActionBar$;   // singleton
    const CustomerUi = spec['Fl32_Leana_Realm_Desk_Widget_Api_Customer#'];   // class constructor
    const EmployeeUi = spec['Fl32_Leana_Realm_Desk_Widget_Api_Employee#'];
    const ServiceUi = spec['Fl32_Leana_Realm_Desk_Widget_Api_Service#'];
    const TaskUi = spec['Fl32_Leana_Realm_Desk_Widget_Api_Task#'];
    const TaskWidget = spec['Fl32_Leana_Realm_Desk_Widget_Booking_Api#Task'];

    return {
        template,
        components: {
            booking,
            actionBar: wgActionBar
        },
        data: function () {
            return {
                /** @type {Fl32_Leana_Shared_Api_Route_Desk_Calendar_Get_Response} */
                calendarData: {},
                /** @type {Object.<string,Object<number, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task>>} */
                bookedTasks: {},
            };
        },
        computed: {
            dateFormatted() {
                let result = '';
                if (typeof this.dateSelected.toLocaleDateString === 'function') {
                    const locale = i18next.language;
                    result = this.dateSelected.toLocaleDateString(locale, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
                return result;
            },
            ...mapState({
                dateSelected: state => state.calendar.dateSelected,
            })
        },
        methods: {
            ...mapMutations({
                setDateSelected: 'calendar/setDateSelected'
            })
        },
        async mounted() {
            // DEFINE INNER FUNCTIONS

            /**
             * Load all booked tasks from server.
             * @return {Promise<any>}
             * @private
             */
            async function _loadData() {
                const res = await fetch('../api/desk/calendar/get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return await res.json();
            }

            /**
             * Convert API data to UI data.
             * @param {Fl32_Leana_Shared_Api_Route_Desk_Calendar_Get_Response} data
             * @return {Object.<string, Object.<number, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task>>} {'YYYYMMDD':{id:{TaskUI}}}
             */
            function _prepareBookedTasks(data) {
                /**
                 * Convert data from Backend API fromat to UI format.
                 *
                 * @param {Fl32_Leana_Shared_Api_Data_Desk_Task} taskApi
                 * @param {Fl32_Leana_Shared_Api_Data_Desk_Employee} employeeApi
                 * @param {Fl32_Leana_Shared_Api_Data_Service} serviceApi
                 * @param {number} duration
                 * @return {Fl32_Leana_Realm_Desk_Widget_Api_Task}
                 */
                function _parseTaskUi(taskApi, employeeApi, serviceApi, duration) {
                    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Task} */
                    const result = new TaskUi();
                    result.id = taskApi.id;
                    result.dateBook = utilDate.unformatDate(taskApi.bookedDate, taskApi.bookedBegin);
                    result.dateCreated = taskApi.dateCreated;
                    result.duration = duration;
                    result.note = taskApi.note;
                    result.lang = taskApi.lang;
                    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Customer} */
                    const customer = new CustomerUi();
                    customer.name = taskApi.customerName;
                    customer.email = taskApi.customerEmail;
                    customer.phone = taskApi.customerPhone;
                    result.customer = customer;
                    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Service} */
                    const service = new ServiceUi();
                    service.id = serviceApi.id;
                    service.code = serviceApi.code;
                    service.duration = serviceApi.duration;
                    result.service = service;
                    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Employee} */
                    const employee = new EmployeeUi();
                    employee.id = employeeApi.id;
                    employee.code = employeeApi.code;
                    result.employee = employee;
                    return result;
                }

                const result = {};
                for (const taskId in data.tasks) {
                    // convert Backend API data to UI data
                    /** @type {Fl32_Leana_Shared_Api_Data_Desk_Task} */
                    const taskApi = data.tasks[taskId];
                    /** @type {Fl32_Leana_Shared_Api_Data_Desk_Employee} */
                    const employeeApi = data.employees[taskApi.employeeRef];
                    /** @type {Fl32_Leana_Shared_Api_Data_Service} */
                    const serviceApi = data.services[taskApi.serviceRef];
                    // prepare intermediate data
                    const minsBegin = utilDate.convertDbHrsMinsToMins(taskApi.bookedBegin); // 615
                    const minsEnd = utilDate.convertDbHrsMinsToMins(taskApi.bookedEnd); // 645
                    const duration = minsEnd - minsBegin;       // 30
                    // compose task common data for all widgets (UI)
                    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Task} */
                    const taskUi = _parseTaskUi(taskApi, employeeApi, serviceApi, duration);
                    /** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task} */
                    const taskWidget = new TaskWidget();
                    const id = Number.parseInt(taskApi.id);
                    taskWidget.id = id;             // 1
                    taskWidget.begin = minsBegin;   // 540
                    taskWidget.end = minsEnd;       // 570
                    taskWidget.duration = duration; // 30
                    taskWidget.taskData = taskUi;
                    // add widget task data to results
                    const bookedDate = taskApi.bookedDate;  // 20201120
                    result[bookedDate] = result[bookedDate] || {};
                    result[bookedDate][id] = taskWidget;
                }
                return result;
            }

            // MAIN FUNCTIONALITY
            if (typeof this.dateSelected.getTime !== 'function') {
                const now = new Date(Date.now());
                this.setDateSelected(now);
            }
            const {data} = await _loadData();
            this.calendarData = data;
            this.bookedTasks = _prepareBookedTasks(data);
        }
    };
}
