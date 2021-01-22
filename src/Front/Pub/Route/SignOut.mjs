const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeSignOut', {
    message: 'Gaida sesijas beigas.',
    title: 'Izeja',
});
i18next.addResources('ru', 'routeSignOut', {
    message: 'Ожидание завершения сессии.',
    title: 'Выход',
});


const template = `
<div>
    <div class="id-message">
        {{$t('routeSignOut:message')}}
    </div>
</div>
`;

function Fl32_Leana_Front_Pub_Route_SignOut(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton

    return {
        template,
        methods: {
            ...mapMutations({
                setStateAppTitle: 'app/setTitle',
                setUserAuthenticated: 'user/setAuthenticated'
            }),
        },
        async mounted() {
            this.setStateAppTitle(this.$t('routeSignOut:title'));
            await session.close();
            this.setUserAuthenticated(session.getUser());
            await this.$router.push('/');
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Pub_Route_SignOut;
