const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'routeServices', {
    id: '#',
    name: 'Nosaukums',
    duration: 'Ilgums',
});
i18next.addResources('ru', 'routeServices', {
    id: '#',
    name: 'Название',
    duration: 'Время',
});

const template = `
<div>
    <div class="table">
        <div class="table-head" :style="colspan">
            <div class="headCell">{{ $t('routeServices:id') }}</div>
            <div class="headCell">{{ $t('routeServices:name') }}</div>
            <div class="headCell">{{ $t('routeServices:duration') }}</div>
        </div>
        <div v-for="item in items" class="table-row" :style="colspan">
            <div class="dataCell">{{ item.id }}</div>
            <div class="dataCell">{{ item.name }}</div>
            <div class="dataCell">{{ formatDuration(item.duration) }}</div>
        </div>
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
            formatDuration(mins) {
                return utilDate.convertMinsToHrsMins(mins);
            }
        },
        async mounted() {
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
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
