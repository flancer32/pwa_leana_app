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
        {{$t('message')}}
    </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_Route_SignOut(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];

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
