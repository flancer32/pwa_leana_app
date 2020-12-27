const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'routeServices', {});
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

export default function Fl32_Leana_Front_Desk_Route_Services(spec) {
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    /** @type {Fl32_Leana_Shared_Service_Gate_Service_List} */
    const gate = spec.Fl32_Leana_Shared_Service_Gate_Service_List$;
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
            const req = new ListReq();
            req.locale = i18next.language;
            /** @type {Fl32_Leana_Shared_Service_Route_Service_List_Response} */
            const res = await gate(req);
            this.items = Object.values(res.items);
        }
    };
}
