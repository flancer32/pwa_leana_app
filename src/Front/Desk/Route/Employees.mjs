const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'route-about', {});
i18next.addResources('ru', 'route-about', {});

const template = `
<div>
    <div>Employees</div>
</div>
`;

function Fl32_Leana_Front_Desk_Route_Employees(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];

    return {
        template,
        data: function () {
            return {};
        },
        async mounted() {
            await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE);
        }
    };
}

export default Fl32_Leana_Front_Desk_Route_Employees;
