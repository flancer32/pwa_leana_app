const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'route-about', {});
i18next.addResources('ru', 'route-about', {});

const template = `
<div>
    <div>Clients</div>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Route_Clients() {

    return {
        template,
        data: function () {
            return {};
        },
    };
}
