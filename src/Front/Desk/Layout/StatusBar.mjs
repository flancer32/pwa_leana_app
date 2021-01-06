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
<div class="status_bar">

</div>
`;

/**
 * @deprecated
 */
function Fl32_Leana_Front_Desk_Layout_StatusBar() {
    return {
        name: 'StatusBar',
        template,
        data: function () {
            return {};
        },
        methods: {},
    };
}

export default Fl32_Leana_Front_Desk_Layout_StatusBar;
