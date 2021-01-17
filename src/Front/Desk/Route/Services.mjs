const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeServices', {
    duration: 'Ilgums',
    id: '#',
    isPublic: 'Publ.',
    name: 'Nosaukums',
    title: 'Pakalpojumi',
});
i18next.addResources('ru', 'routeServices', {
    duration: 'Время',
    id: '#',
    isPublic: 'Публ.',
    name: 'Название',
    title: 'Услуги',
});

const template = `
<div class="layout_centered">
    <div class="grid gridSerivces">
        <div class="headCell">{{ $t('routeServices:id') }}</div>
        <div class="headCell">{{ $t('routeServices:name') }}</div>
        <div class="headCell">{{ $t('routeServices:isPublic') }}</div>
        <div class="headCell">{{ $t('routeServices:duration') }}</div>
        <template v-for="item in items">
            <div class="dataCell">{{ item.id }}</div>
            <div class="dataCell">{{ item.name }}</div>
            <div class="dataCell center">{{ formatBool(item.public) }}</div>
            <div class="dataCell center">{{ formatDuration(item.duration) }}</div>
        </template>
    </div>
</div>
`;

function Fl32_Leana_Front_Desk_Route_Services(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    /** @type {Fl32_Leana_Front_Gate_Service_List} */
    const gate = spec.Fl32_Leana_Front_Gate_Service_List$;
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Service_List_Request} */
    const ListReq = spec['Fl32_Leana_Shared_Service_Route_Service_List#Request'];

    return {
        template,
        data: function () {
            return {
                items: {},
                colspan: 'grid-template-columns: 1fr 4fr 2fr;',
            };
        },
        methods: {
            formatBool: (data) => (data) ? '+' : '',
            formatDuration(mins) {
                return utilDate.convertMinsToHrsMins(mins);
            },
            ...mapMutations({
                setStateAppTitle: 'app/setTitle',
            }),
        },
        async mounted() {
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                this.setStateAppTitle(this.$t('routeServices:title'));
                const req = new ListReq();
                req.locale = i18next.language;
                /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
                const res = await gate(req);
                this.items = Object.values(res.items);
            }
        }
    };
}

export default Fl32_Leana_Front_Desk_Route_Services;
