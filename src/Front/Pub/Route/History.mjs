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
            <div class="dataCell right">{{ item.date }}</div>
            <div class="dataCell right">{{ item.time }}</div>
            <div class="dataCell">{{ item.employee }}</div>
            <div class="dataCell">{{ item.service }}</div>    
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


    return {
        template,
        components: {},
        data: function () {
            return {};
        },
        computed: {
            items() {
                return [
                    {date: '2021/01/18', time: '18:45', employee: 'Helena', service: 'Haircut'},
                    {date: '2021/01/18', time: '18:45', employee: 'Helena', service: 'Haircut'},
                    {date: '2021/01/18', time: '18:45', employee: 'Helena', service: 'Haircut'},
                ];
            },
        },
        methods: {
            ...mapMutations({
                setStateUserAuthenticated: 'user/setAuthenticated'
            }),
        },
        async mounted() {
            // validate user's permissions
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_CUSTOMER)) {

            }
        },
    };
}
