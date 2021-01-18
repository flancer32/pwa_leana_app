const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeHistory', {
    date: 'Datums',
    employee: 'Meistars',
    service: 'Pakalpojums',
    time: 'Laiks',
});
i18next.addResources('ru', 'routeHistory', {
    date: 'Дата',
    employee: 'Мастер',
    service: 'Услуга',
    time: 'Время',
});

const template = `
<div class="layout_centered">
     <div class="grid gridHistory">
        <div class="headCell">{{ $t('routeHistory:date') }}</div>
        <div class="headCell">{{ $t('routeHistory:time') }}</div>
        <div class="headCell">{{ $t('routeHistory:employee') }}</div>
        <div class="headCell">{{ $t('routeHistory:service') }}</div>
        <template v-for="item in items">
            <div class="dataCell right">{{ outDate(item) }}</div>
            <div class="dataCell right">{{ outTime(item) }}</div>
            <div class="dataCell">{{ outMaster(item) }}</div>
            <div class="dataCell">{{ outService(item) }}</div>    
        </template>
     </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_Route_History(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];  // singleton instance
    const gateEmployee = spec['Fl32_Leana_Front_Gate_Employee_List$'];   // singleton function
    const gateHistory = spec['Fl32_Leana_Front_Gate_Task_List_Own$'];   // singleton function
    const gateServices = spec['Fl32_Leana_Front_Gate_Service_List$'];   // singleton function
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_List_Request} */
    const EmployeeReq = spec['Fl32_Leana_Shared_Service_Route_Employee_List#Request'];  // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Task_List_Own_Request} */
    const HistoryReq = spec['Fl32_Leana_Shared_Service_Route_Task_List_Own#Request'];   // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Service_List_Request} */
    const ServiceReq = spec['Fl32_Leana_Shared_Service_Route_Service_List#Request'];   // class constructor
    /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
    const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor

    return {
        template,
        components: {},
        data: function () {
            return {
                masters: null,
                services: null,
                tasks: [],
            };
        },
        computed: {
            items() {
                const result = [];
                for (const one of this.tasks) {
                    result.push(one);
                }
                return result;
            },
        },
        methods: {
            /**
             * @param {Fl32_Leana_Shared_Service_Data_Task} item
             */
            outDate: (item) => utilDate.formatDate(item.dateBook),
            /**
             * @param {Fl32_Leana_Shared_Service_Data_Task} item
             */
            outMaster(item) {
                return this.masters[item.employeeRef];
            },
            /**
             * @param {Fl32_Leana_Shared_Service_Data_Task} item
             */
            outService(item) {
                return this.services[item.serviceRef];
            },
            /**
             * @param {Fl32_Leana_Shared_Service_Data_Task} item
             */
            outTime: (item) => utilDate.formatTime(item.dateBook),
            ...mapMutations({
                setStateUserAuthenticated: 'user/setAuthenticated'
            }),
        },
        async mounted() {
            const me = this;

            // DEFINE INNER FUNCTIONS

            async function loadMasters() {
                // load data from server
                const req = new EmployeeReq();
                req.locale = i18next.language;
                /** @type {Fl32_Leana_Shared_Service_Route_Employee_List_Response} */
                const res = await gateEmployee(req);
                if (!(res instanceof GateError)) {
                    me.masters = {};
                    for (const one of Object.values(res.items)) me.masters[one.id] = one.name;
                } else {
                    console.error('Service Gate Error: ' + res.message);
                }
            }

            async function loadHistory() {
                // load data from server
                const req = new HistoryReq();
                /** @type {Fl32_Leana_Shared_Service_Route_Task_List_Own_Response} */
                const res = await gateHistory(req);
                if (!(res instanceof GateError)) {
                    me.tasks = res.items;
                } else {
                    console.error('Service Gate Error: ' + res.message);
                }
            }

            async function loadServices() {
                // load data from server
                const req = new ServiceReq();
                req.locale = i18next.language;
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
                const res = await gateServices(req);
                if (!(res instanceof GateError)) {
                    me.services = {};
                    for (const one of Object.values(res.items)) me.services[one.id] = one.name;
                } else {
                    console.error('Service Gate Error: ' + res.message);
                }
            }

            // MAIN FUNCTIONALITY
            // validate user's permissions
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_CUSTOMER)) {
                await Promise.all([loadMasters(), loadHistory(), loadServices(),]);
            }
        },
    };
}
