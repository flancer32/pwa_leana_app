const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeSignOut', {
    message: 'Gaida sesijas beigas.',
});
i18next.addResources('ru', 'routeSignOut', {
    message: 'Ожидание завершения сессии.',
});


const template = `
<div>
    <div class="id-message">
        {{$t('routeSignOut:message')}}
    </div>
</div>
`;

function Fl32_Leana_Front_Desk_Route_User_SignOut(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton

    return {
        template,
        methods: {
            ...mapMutations({
                setUserAuthenticated: 'user/setAuthenticated'
            }),
        },
        async mounted() {
            await session.close();
            this.setUserAuthenticated(session.getUser());
            await this.$router.push('/');
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Route_User_SignOut;
