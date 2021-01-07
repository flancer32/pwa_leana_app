const i18next = self.teqfw.i18next;

i18next.addResources('lv', 'routeProfile', {});
i18next.addResources('ru', 'routeProfile', {});


const template = `
<div>
    <div class="id-message">Profile</div>
</div>
`;

function Fl32_Leana_Front_Desk_Route_Profile(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton

    return {
        name: 'RouteProfile',
        template,
        data() {
            return {};
        },
        computed: {},
        methods: {},
        async mounted() {
            await session.redirectOnFail(this.$router, DEF.ACL_IS_EMPLOYEE);
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Route_Profile;
