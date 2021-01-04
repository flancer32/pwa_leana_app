const i18next = self.teqfw.i18next;

const I18N_BUNDLE_RU = {
    id: '#',
    login: 'Код',
    name: 'Имя',
};

i18next.addResourceBundle('lv', 'routeClients', {}, true);
i18next.addResourceBundle('ru', 'routeClients', I18N_BUNDLE_RU, true);

const template = `
<div>
    <div class="table">
        <div class="table-head" :style="colspan">
            <div class="headCell">{{ $t('routeClients:id') }}</div>
            <div class="headCell">{{ $t('routeClients:login') }}</div>
            <div class="headCell">{{ $t('routeClients:name') }}</div>
        </div>
        <div v-for="item in items" class="table-row" :style="colspan">
            <div class="dataCell">{{ item.id }}</div>
            <div class="dataCell">{{ item.login }}</div>
            <div class="dataCell">{{ item.name }}</div>
        </div>
    </div>
</div>
`;

export default function Fl32_Leana_Front_Desk_Route_Clients(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    /** @type {Fl32_Teq_User_Front_Gate_List} */
    const gateUsersList = spec.Fl32_Teq_User_Front_Gate_List$;
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_List_Request} */
    const UsersListReq = spec['Fl32_Teq_User_Shared_Service_Route_List#Request'];

    return {
        template,
        data: function () {
            return {
                items: {},
                colspan: 'grid-template-columns: 1fr 2fr 4fr;',
            };
        },
        async mounted() {
            if (!session.hasPermission(DEF.ACL_IS_EMPLOYEE)) {
                const route = this.$router.currentRoute.value.path;
                session.setRouteToRedirect(route);
                await this.$router.push('/user/signIn');
            } else {
                const req = new UsersListReq();
                /** @type {Fl32_Teq_User_Shared_Service_Route_List_Response} */
                const res = await gateUsersList(req);
                this.items = Object.values(res.items);
            }
        }
    };
}
