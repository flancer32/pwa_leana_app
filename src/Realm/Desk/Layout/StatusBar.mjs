const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'statusBar', {
    calendar: 'Kalendārs',
    clients: 'Klienti',
    employees: 'Darbinieki',
    services: 'Pakalpoumi',
});
i18next.addResources('ru', 'statusBar', {
    calendar: 'Календарь',
    clients: 'Клиенты',
    employees: 'Сотрудники',
    services: 'Сервисы',
});

const template = `
<div id="status_bar">
    <div v-on:click="$router.push('/calendar')">
        <i class="far fa-calendar-alt fa-3x filter-top-fg" :title="$t('statusBar:calendar')"></i>  
    </div>
    <div v-on:click="$router.push('/clients')">
        <i class="fas fa-users fa-3x filter-top-fg" :title="$t('statusBar:clients')"></i> 
    </div>
    <div v-on:click="$router.push('/services')">
        <i class="fas fa-server fa-3x filter-top-fg" :title="$t('statusBar:services')"></i> 
    </div>
    <div v-on:click="$router.push('/employees')">
        <i class="fas fa-user-tie fa-3x filter-top-fg" :title="$t('statusBar:employees')"></i> 
    </div>
    <div v-on:click="$router.push('/dev')">
        <i class="fas fa-tools fa-3x filter-top-fg" :title="$t('statusBar:dev')"></i> 
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Layout_StatusBar() {
    return {
        template,
        data: function () {
            return {};
        },
        methods: {},
    };
}
