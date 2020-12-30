const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'route-about', {});
i18next.addResources('ru', 'route-about', {});

const template = `
<div>
    <div>Employees</div>
</div>
`;

export default function Fl32_Leana_Front_Desk_Route_Employees(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
    /** @type {Fl32_Leana_Front_Desk_App_Session} */
    const session = spec.Fl32_Leana_Front_Desk_App_Session$;

    return {
        template,
        data: function () {
            return {};
        },
        async mounted() {
            if (!session.hasPermission(DEF.ACL_IS_EMPLOYEE)) {
                const route = this.$router.currentRoute.value.path;
                session.setRouteToRedirect(route);
                await this.$router.push('/user/signIn');
            }
        }
    };
}
