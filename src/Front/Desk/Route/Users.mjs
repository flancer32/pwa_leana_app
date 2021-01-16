const i18next = self.teqfw.i18next;

const I18N_BUNDLE_LV = {
    created: 'Izveidots',
    id: '#',
    login: 'Lietotājvārds',
    name: 'Vārds',
};
const I18N_BUNDLE_RU = {
    created: 'Создан',
    id: '#',
    login: 'Login',
    name: 'Имя',
};

i18next.addResourceBundle('lv', 'routeUsers', I18N_BUNDLE_LV, true);
i18next.addResourceBundle('ru', 'routeUsers', I18N_BUNDLE_RU, true);

const template = `
<div class="layout_centered">
    <div class="grid gridUsers">
        <div class="headCell">{{ $t('routeUsers:id') }}</div>
        <div class="headCell">{{ $t('routeUsers:created') }}</div>
        <div class="headCell">{{ $t('routeUsers:login') }}</div>
        <div class="headCell">{{ $t('routeUsers:name') }}</div>
        <template v-for="item in items">
            <div class="dataCell">{{ item.id }}</div>
            <div class="dataCell">{{ formatDate(item.dateCreated) }}</div>
            <div class="dataCell">{{ item.login }}</div>
            <div class="dataCell">{{ item.name }}</div>
        </template>
    </div>
</div>
`;

/**
 * @exports Fl32_Leana_Front_Desk_Route_Users
 */
function Fl32_Leana_Front_Desk_Route_Users(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$'];
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
        computed: {},
        methods: {
            formatDate(date) {
                return utilDate.formatDate(date);
            }
        },
        async mounted() {
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                const req = new UsersListReq();
                /** @type {Fl32_Teq_User_Shared_Service_Route_List_Response} */
                const res = await gateUsersList(req);
                this.items = Object.values(res.items).reverse();
            }
        }
    };
}

export default Fl32_Leana_Front_Desk_Route_Users;
