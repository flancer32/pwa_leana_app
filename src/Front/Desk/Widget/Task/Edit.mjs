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
    
        <div class="row">
            <div class="label">
                <span>{{ $t('taskEdit:customer') }}:</span>
            </div>
            <div class="field">
                 <input v-model="customer">
            </div>
        </div>    
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskEdit:email') }}:</span>
            </div>
            <div class="field">
                 <input v-model="email">
            </div>
        </div>   
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskEdit:phone') }}:</span>
            </div>
            <div class="field">
                 <input v-model="phone">
            </div>
        </div>
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskEdit:service') }}:</span>
            </div>
            <div class="field">
                  <select name="service" v-model="serviceId">
                    <option disabled value="null">{{ $t('taskEdit:serviceSelect') }}</option>
                    <option v-for="(one) in optionsServices" :value="one.id" :disabled="one.disabled">
                        {{ one.name }} ({{one.duration}})
                    </option>
                </select>
            </div>
        </div>
        
        <div class="row">
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
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskEdit:employee') }}:</span>
            </div>
            <div class="field">
                 <select name="employeeId" v-model="employeeId">
                    <option disabled value="null">{{ $t('taskEdit:employeeSelect') }}</option>
                    <option v-for="(one) in optionsEmployees" :value="one.id" :disabled="one.disabled">
                        {{ one.name }}
                    </option>
                </select>
            </div>
        </div>
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskEdit:note') }}:</span>
            </div>
            <div class="field">
                 <textarea v-model="note"></textarea>
            </div>
        </div>
        
      <div class="controls dtp_widget">
            <date-time-picker
                :yearMin="2020"
                :yearMax="2021"
                :hourMin="9"
                :hourMax="20"
                :minsStep="30"
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
 */
export default function Fl32_Leana_Front_Desk_Widget_Task_Edit(spec) {
    const gateTaskSave = spec.Fl32_Leana_Front_Shared_Gate_Task_Save$;  //singleton
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    const wgActions = spec.Fl32_Leana_Front_Desk_Widget_Task_Edit_Actions$;
    const wgDateTimePicker = spec.Fl32_Leana_Front_Shared_Widget_DateTimePicker$; // singleton
    const Task = spec['Fl32_Leana_Front_Desk_Widget_Api_Task#'];
    const EmplReq = spec['Fl32_Leana_Shared_Api_Route_Employee_List#Request'];
    const ServReq = spec['Fl32_Leana_Shared_Api_Route_Service_List#Request'];
    const TaskSaveReq = spec['Fl32_Leana_Shared_Api_Route_Task_Save#Request'];

    return {
        template,
        components: {
            actions: wgActions,
            dateTimePicker: wgDateTimePicker,
        },
        props: {
            /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
            params: new Task()
        },
        data: function () {
            return {
                customer: null,
                date: null,
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
            optionsEmployees() {
                let result = [];
                if (this.apiEmployees) {
                    for (const key in this.apiEmployees) {
                        /** @type {Fl32_Leana_Shared_Api_Data_New_Employee} */
                        const one = this.apiEmployees[key];
                        if (Array.isArray(one.services) && one.services.includes(this.serviceId)) {
                            result.push({id: one.id, name: one.name});
                        }
                    }
                }
                return result;
            },
            optionsServices() {
                let result = [];
                if (this.apiServices) {
                    for (const key in this.apiServices) {
                        /** @type {Fl32_Leana_Shared_Api_Data_New_Service} */
                        const one = this.apiServices[key];
                        if (one.public) {
                            const duration = utilDate.convertMinsToHrsMins(one.duration);
                            const option = {id: one.id, name: one.name, duration};
                            result.push(option);
                        }
                    }
                }
                return result;
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
                /** @type {Fl32_Leana_Shared_Api_Route_Task_Save_Request} */
                const req = new TaskSaveReq();
                req.date = this.date;
                req.duration = 30;
                req.email = this.email;
                req.lang = i18next.language;
                req.masterId = this.employeeId;
                req.name = this.customer;
                req.note = this.note;
                req.phone = this.phone;
                req.serviceId = this.serviceId;
                const res = await gateTaskSave(req);
                if (res.data && (typeof res.data.id === 'number')) {
                    this.resetOverlay();
                }
            },
            ...mapActions({
                loadEmployees: 'calendar/loadEmployees',
                loadServices: 'calendar/loadServices',
            }),
            ...mapMutations({
                resetOverlay: 'app/resetOverlay',
            }),

        },
        async mounted() {
            const locale = i18next.language;
            // load employees to compose options array
            /** @type {Fl32_Leana_Shared_Api_Route_Employee_List_Request} */
            const emplReq = new EmplReq();
            emplReq.locale = locale;
            this.loadEmployees(emplReq);
            // load services to compose options array
            /** @type {Fl32_Leana_Shared_Api_Route_Service_List_Request} */
            const servReq = new ServReq();
            servReq.locale = locale;
            this.loadServices(servReq);
        }
    };
}
